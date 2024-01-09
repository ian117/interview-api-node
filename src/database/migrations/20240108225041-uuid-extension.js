'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query('CREATE EXTENSION "uuid-ossp";');
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query('DROP EXTENSION "uuid-ossp";');
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
