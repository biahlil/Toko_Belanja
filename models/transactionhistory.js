'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product);
      this.belongsTo(models.User);
    }
  }
  TransactionHistory.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER
  }, {
    sequelize,
    hooks: {
      afterFind: (values,options) => {
        if (Array.isArray(values) == true) {
          for (const transaction of values) {
            transaction.dataValues.total_price = "Rp"+ transaction.dataValues.total_price.toLocaleString('id-JD') + ",00";
            }
        } else {
          values.total_price = "Rp"+ values.total_price.toLocaleString('id-JD') + ",00";
        }
      }
    },
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};