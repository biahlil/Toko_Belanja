'use strict';

const bcrypt = require('bcrypt');
let password = "johndoe123";
password = bcrypt.hashSync(password,10);
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
    await queryInterface.bulkInsert('Users', [
      {
      full_name: 'John Doe',
      email: "john.doe@gmail.com",
      password: password,
      gender: 'male',
      role: "admin",
      balance: 3000000,
      createdAt: new Date(),
      updatedAt: new Date()
      }
    ], {validate:true, individualHooks:true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
