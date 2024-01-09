'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'users_opportunities',
        {
          user_id: {
            allowNull: false,
            primaryKey: true,
            foreignKey: true,
            type: Sequelize.UUID,
            references: {
              model: 'users',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          opportunity_id: {
            allowNull: false,
            primaryKey: true,
            foreignKey: true,
            type: Sequelize.UUID,
            references: {
              model: 'opportunities',
              key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          investment_amount: {
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
          deleted_at: {
            type: Sequelize.DATE,
            field: 'deleted_at',
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
      await queryInterface.dropTable('users_opportunities', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
