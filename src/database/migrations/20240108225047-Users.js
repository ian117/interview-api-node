'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'users',
        {
          id: {
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            primaryKey: true,
            type: Sequelize.UUID,
          },
          email: {
            allowNull: false,
            type: Sequelize.STRING(254),
            unique: true,
          },
          password: {
            allowNull: false,
            type: Sequelize.STRING(254),
          },
          first_name: {
            allowNull: false,
            type: Sequelize.STRING(254),
          },
          last_name: {
            allowNull: false,
            type: Sequelize.STRING(254),
          },
          address: {
            allowNull: false,
            type: Sequelize.STRING(254),
          },
          birthdate: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'created_at',
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            field: 'updated_at',
          },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('users', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
