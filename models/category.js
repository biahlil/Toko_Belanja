'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Product);
    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { Message: "Must be a number"}
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate: (category, options) =>  {
        category.sold_product_amount = 0; 
      }
    },
    modelName: 'Category',
  });
  return Category;
};