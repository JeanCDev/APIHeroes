const assert = require('assert');
const Mongodb = require('./../db/strategies/mongodb/mongodb');
const Context = require('./../db/strategies/base/contextStrategy');

const heroSchema = require('../db/strategies/mongodb/schemas/heroesSchema');
let context = {};

const MOCK_HERO_INSERT = {
  name: 'Flash',
  power: 'Laço'
}

const MOCK_HERO_DEFAULT = {
  name: `Homem-Aranha-${Date.now()}`,
  power: 'Teia'
}

const MOCK_HERO_UPDATE = {
  name: `Patolino-${Date.now()}`,
  power: 'Velocidade'
}

let MOCK_HERO_ID = '';

describe('Mongodb Suíte de testes', async function (){

  this.beforeAll(async () => {
    const connection = Mongodb.connect();
    context = new Context(new Mongodb(connection, heroSchema));
    await context.create(MOCK_HERO_DEFAULT);
    const result = await context.create(MOCK_HERO_UPDATE);
    MOCK_HERO_ID = result._id;
  });

  it('Verificar conexão', async () => {

    const result = await context.isConnected();
    console.log(result);
    const expected = 'conectado';

    assert.deepStrictEqual(result, expected);

  });

  it('Cadastrar', async () => {

    const {name, power} = await context.create(MOCK_HERO_INSERT);

    assert.deepStrictEqual({name, power}, MOCK_HERO_INSERT);

  });

  it('Listar', async () => {

    const [{name, power}] = await context.read({name: MOCK_HERO_DEFAULT.name});
    
    const result = {name, power}

    console.log(result);

    assert.deepStrictEqual(result, MOCK_HERO_DEFAULT);

  });

  it('Atualizar', async () => {

    const result = await context.update(MOCK_HERO_ID, {
      name: 'Perna Longa'
    });
    
    assert.deepStrictEqual(result.nModified, 1);

  });

  it('Excluir', async () => {

    const result = await context.delete(MOCK_HERO_ID);

    assert.deepStrictEqual(result.n, 1);

  });

});