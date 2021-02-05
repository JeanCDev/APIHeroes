const Sequelize = require('sequelize');

const userSchema = {
  name: 'users',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      require: true,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      require: true
    },
    password: {
      type: Sequelize.STRING,
      require: true
    }
  },
  options: {
    tableName:"tb_users",
    freeTableName: false,
    timestamps: false
  }
}

module.exports = userSchema;