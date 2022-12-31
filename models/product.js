'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here 
      this.belongsTo(models.Category);
      this.hasMany(models.TransactionHistory);
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        max: 50000000,
        min: 0
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 5
      }
    },
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    hooks: {
      afterUpdate: (product,options) => {
        product.price = "Rp"+ product.price.toLocaleString('id-JD') + ",00";
      },
      afterCreate: (product,options) => {
        product.price = "Rp"+ product.price.toLocaleString('id-JD') + ",00";
      },
      afterFind: (values,options) => {
        if (Array.isArray(values) == true) {
          for (const product of values) {
            product.dataValues.price = "Rp"+ product.dataValues.price.toLocaleString('id-JD') + ",00";
            }
        } else {
          values.price = "Rp"+ values.price.toLocaleString('id-JD') + ",00";
        }
      }
    },
    modelName: 'Product',
  });
  return Product;
};