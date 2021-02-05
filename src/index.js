const ContentStrategy = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb');
const Postgres = require('./db/strategies/postgres');

const contextMongo = new ContentStrategy(new MongoDB());
contextMongo.create();

const contextPostgres = new ContentStrategy(new Postgres());
contextPostgres.create();