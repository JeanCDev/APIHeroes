const Sequelize = require('sequelize');

// cria a instância de conexão com o banco de dados
const driver = new Sequelize(
  'heroes',
  'jeancdev',
  '19029696',
  {
    host: 'localhost',
    dialect: 'postgres',
    quoteIdentifiers: false,
    operatorAliases: false
  }
);

async function main() {

  // cria o model que deve ser inserido no banco de dados
  const Heroes = driver.define('heroes', { 
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
  }, {
    tableName:"tb_heroes",
    freeTableName: false,
    timestamps: false
  });

  // conecta ao banco de dados
  await Heroes.sync();

  // cadastra um dado no banco de dados
  /* await Heroes.create({
    name: 'Lanterna Verde',
    power: 'Anel'
  }); */

  // pega os dados do banco de dados
  const result = await Heroes.findAll({raw: true});

  console.log(result);

}

main();