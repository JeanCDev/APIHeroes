const Hapi = require('hapi');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const Context = require('./db/strategies/base/contextStrategy');
const heroSchema = require('./db/strategies/mongodb/schemas/heroesSchema');

const app = new Hapi.Server({
  port: 5000
});


async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, heroSchema));

  // cria uma rota que retorna a lista de heróis do banco de dados
  app.route([{
    path: '/heroes',
    method: 'GET',
    handler: (request, head) => {
      return context.read();
    }
  }]);

  await app.start();
  console.log('Server running');

}

main();