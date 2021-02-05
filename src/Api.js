const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert');

const env = process.env.NODE_ENV || 'dev';
ok(env === 'prod' || env === 'dev', 'Variáveis de ambiente inválidas');

const configPath = join(__dirname, './config', `.env.${env}`);
config({
  path: configPath
});

const HapiSwagger = require('hapi-swagger');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiJwt = require('hapi-auth-jwt2');

const MongoDB = require('./db/strategies/mongodb/mongodb');
const Context = require('./db/strategies/base/contextStrategy');
const heroSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroRoute = require('./routes/heroRoutes');
const AuthRoutes = require('./routes/authRoutes');
const Postgres = require('./db/strategies/postgres/postgres');
const userSchema = require('./db/strategies/postgres/schemas/userSchema');

const JWT_SECRET = process.env.JWT_KEY;

// instancia o server 
const app = new Hapi.Server({
  port: process.env.PORT
});

// mapeia dinamicamente o objeto HeroRoutes e executa seus métodos
function mapRoutes(instance, methods) {
  
  return methods.map(method => instance[method]());

}

async function main() {
  // inicia a conexão com o mongodb
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, heroSchema));

  // inicia a conexão com o postgres
  const connectionPostgres = await Postgres.connect();
  const model = await Postgres.defineModel(connectionPostgres, userSchema);
  const contextPostgres = new Context(new Postgres(connectionPostgres, model));

  const swaggerOptions ={
    info: {
      title: 'API Heroes',
      version: 'v1.0'
    }
  }

  // registra os plugins de validação e documentação
  await app.register([
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  // cria estratégia de autenticação
  app.auth.strategy('jwt', 'jwt',{
    key: JWT_SECRET,
    /* options:{
      expiresIn: 20
    } */
    validate: async (data, request) =>{
      const [result] = await contextPostgres.read({
        username: data.username,
        id: data.id
      });

      if(!result){
        return {
          isValid: false
        }
      }

      // verifica no banco de dados se o usuário está ativo
      return {
        isValid: true 
      }
    }
  });

  // usa a estratégia de autenticação
  app.auth.default('jwt');

  // Pega todas as rotas baseadas nos nome do métodos de HeroRoute
  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()), 
    ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), 
                  AuthRoutes.methods())
  ]);

  await app.start();

  return app;

}

module.exports = main();