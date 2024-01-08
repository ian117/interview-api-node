/**
 * This is .js for sequelize-cli
 *  sequelize-cli doesn't know .ts
 */

module.exports = {
  development: {
    use_env_variable: 'DATABASE_DEVELOPMENT',
    // logging: false,
    define: {
      underscored: true,
      underscoredAll: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
    timezone: 'utc',
  },
  test: {
    use_env_variable: 'DATABASE_TEST',
    define: {
      underscored: true,
      underscoredAll: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
    timezone: 'utc',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    logging: false,
    define: {
      underscored: true,
      underscoredAll: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
    timezone: 'utc',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
