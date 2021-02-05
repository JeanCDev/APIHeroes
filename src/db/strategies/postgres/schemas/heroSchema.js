const Sequelize = require('sequelize');

const heroSchema = {
  name: 'heroes',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      require: true,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      require: true
    },
    power: {
      type: Sequelize.STRING,
      require: true
    }
  },
  options: {
    tableName:"tb_heroes",
    freeTableName: false,
    timestamps: false
  }
}

module.exports = heroSchema;