const assert = require('assert');
const api = require('./../Api');

const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const userSchema = require('../db/strategies/postgres/schemas/userSchema');

let app = {}

const USER = {
  username: 'JeanCDev',
  password: '123'
}

const USER_DB = {
  username: USER.username,
  password: '$2b$04$i84SUYhoYB20Gj5to.SKru1WsPnEtYoPQgS2OUWaoHxYrXImldLi.'
}

describe('Auth Test suíte', function () {
  this.beforeAll(async () => {
    app = await api;

    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, userSchema);
    const postgres = new Context(new Postgres(connection, model));
    await postgres.update(null, USER_DB, true);
  });

  it('Deve obter um token', async () => {

    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: USER
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepStrictEqual(statusCode, 200);
    assert.ok(data.token.length > 10);

  });
  
  it('Deve retorna não autorizado ao passar login errado', async () => {

    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'Someone',
        password: 'RandomPassword'
      }
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.deepStrictEqual(statusCode, 401);
    assert.deepStrictEqual(data.error, 'Unauthorized');

  });

});