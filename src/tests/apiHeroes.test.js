const assert = require('assert');
const api = require('./../Api');
let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkplYW5DRGV2IiwiaWQiOjEsImlhdCI6MTYxMjMwMTUzMX0.r0H9-J0wYUsWEVbbt4770n658Y-0ajPRkjLIu6eo8mg';

const headers ={
  authorization: TOKEN
}

const MOCK_HERO_INSERT = {
  name: 'Chapolin Colarado',
  power: 'Marreta Biônica'
}

const MOCK_HERO_UPDATE = {
  name: 'Hancock',
}

const MOCK_HERO_DEFAULT = {
  name: 'Gavião arqueiro',
  power: 'Mira'
}

let MOCK_ID = '';

describe('Suíte de teste da api heroes', function () {

  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: 'POST',
      headers,
      url: '/heroes', 
      payload: JSON.stringify(MOCK_HERO_DEFAULT)
    });

    const data = JSON.parse(result.payload);
    MOCK_ID = data._id;

  });

  it('Listar /heróis', async function(){

    // simula uma requisição GET na roa /heroes
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/heroes?skip=0&limit=10'
    });
    
    // testa a conexão com a base de dados
    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.deepStrictEqual(statusCode, 200);
    assert.ok(Array.isArray(data));

  });

  it('Listar /heroes - deve retorna somente 3 registros', async function(){

    const LIMIT_SIZE = 3;
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/heroes?skip=0&limit=${LIMIT_SIZE}`
    });
    
    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.ok(data.length === LIMIT_SIZE);
    assert.deepStrictEqual(statusCode, 200);

  });

  it('Retornar um erro se o parâmetro não for um número', async function(){

    const LIMIT_SIZE = 'aaaa';
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/heroes?skip=0&limit=${LIMIT_SIZE}`
    });

    const resultError = {"statusCode":400,
      "error":"Bad Request",
      "message":"\"limit\" must be a number",
      "validation":{
        "source":"query",
        "keys":["limit"]
      }
    }

    assert.deepStrictEqual(result.statusCode, 400);
    assert.deepStrictEqual(result.payload, JSON.stringify(resultError));

  });

  it('Filtrar heróis pelo nome', async function(){

    const NAME = "Flash";
    const result = await app.inject({
      method: 'GET',
      headers,
      url: `/heroes?skip=0&limit=10&name=${NAME}`
    });
    
    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    assert.ok(data[0].name === NAME);
    assert.deepStrictEqual(statusCode, 200);

  });

  it('Cadastrar herói' , async function(){

    const result = await app.inject({
      method: 'POST',
      headers,
      url: `/heroes`,
      payload: JSON.stringify(MOCK_HERO_INSERT)
    });

    const statusCode = result.statusCode;
    const {message, _id} = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.notDeepStrictEqual(_id, undefined);
    assert.deepStrictEqual(message, 'Herói cadastrado com sucesso');

  });

  it('Atualizar um herói' , async function(){

    const _id = MOCK_ID;
    const expected = {
      power: 'Super Mira'
    }

    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/heroes/${_id}`,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepStrictEqual(data.message, 'Herói atualizado com sucesso');

  });

  it('Erro ao atualizar um herói' , async function(){

    const _id = `600b2c439e83e59675c88732`;
    const expected = {
      power: 'Super Mira'
    }

    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/heroes/${_id}`,
      payload: JSON.stringify(expected)
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    const expectedError = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Não encontrado no banco'
    }

    assert.ok(statusCode === 412);
    assert.deepStrictEqual(data, expectedError);

  });

  it('Remover um herói ', async function(){

    const _id = MOCK_ID;

    const result = await app.inject({
      method: 'DELETE', 
      headers,
      url: `/heroes/${_id}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepStrictEqual(data.message, 'Herói removido com sucesso');

  });
  
  it('Erro ao remover Remover um herói ', async function(){

    const _id = `600b2c439e83e59675c88732`;

    const result = await app.inject({
      method: 'DELETE', 
      headers,
      url: `/heroes/${_id}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    const expected = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'Não encontrado no banco'
    }

    assert.ok(statusCode === 412);
    assert.deepStrictEqual(data, expected);

  });

  it('Erro ao remover Remover um herói com id inválido', async function(){

    const _id = `ID_INVALIDO`;

    const result = await app.inject({
      method: 'DELETE', 
      headers,
      url: `/heroes/${_id}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    const expected = {
      statusCode: 500,
      error: "Internal Server Error",
      message: "An internal server error occurred"
    }

    assert.ok(statusCode === 500);
    assert.deepStrictEqual(data, expected);

  });

});