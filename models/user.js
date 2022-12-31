'use strict';
const {
  Model, or
} = require('sequelize');
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.TransactionHistory);
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: 
    {
      type: DataTypes.STRING,
      len: [6,10]
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkgender(value) {
          if (value != "male" && value != "female") {
            throw new Error(value); 
          } 
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkrole(value) {
          if (value != "admin" && value != "customer") {
          throw new Error("role must be customer");
          }
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      min: 0,
      max: 100000000,
      allowNull: false,
      validate: {
        isInt: { message: 'Must be a Number'}
      }
    }
  },  {
    hooks: {
      beforeCreate: (user, options) =>  {
        user.password = bcrypt.hashSync(user.password,10);
      },
      afterCreate: (user, options) => {
        user.balance = "Rp"+ user.balance.toLocaleString('id-JD') + ",00";
      }
    },
    sequelize,
    modelName: 'User',
    validate: true
  });

  User.beforeBulkCreate((instances, options) => {
    for (const user of instances) {
      user.password = bcrypt.hashSync(user.password,10);
    }
  });
  return User;
};