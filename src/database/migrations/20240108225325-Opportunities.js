'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'opportunities',
        {
          id: {
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
            primaryKey: true,
            type: Sequelize.UUID,
          },
          title: {
            type: Sequelize.STRING(254),
            allowNull: false,
            unique: true,
          },
          total_amount: {
            type: Sequelize.DECIMAL,
            allowNull: false,
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
      await queryInterface.dropTable('opportunities', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
