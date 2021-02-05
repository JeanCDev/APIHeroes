const assert = require('assert');
const Postgres = require('./../db/strategies/postgres/postgres');
const Context = require('./../db/strategies/base/contextStrategy');
const heroSchema = require('../db/strategies/postgres/schemas/heroSchema');

const MOCK_HERO_SAVE = { 
  name: 'Gavião Negro', 
  power: 'Flechas'
}

const MOCK_HERO_UPDATE = { 
  name: 'Spider-man',
  power: 'Web'
}

let context = {};

describe('Postgres Strategy', function(){

  this.timeout(Infinity);

  this.beforeAll(async function(){
    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, heroSchema);
    context = new Context(new Postgres(connection, model));
    await context.delete();
    await context.create(MOCK_HERO_UPDATE);
  });

  it('PostgresSQL Connection', async function(){

    const result = await context.isConnected();
    assert.deepStrictEqual(result, true);

  });

  it('Cadastrar', async function(){

    const result = await context.create(
      MOCK_HERO_SAVE
    );
    
    delete result.id;

    assert.deepStrictEqual(result, MOCK_HERO_SAVE);

  });

  it("Listar", async function(){

    const [result] = await context.read({
      name: MOCK_HERO_SAVE.name
    });

    delete result.id;

    assert.deepStrictEqual(result, MOCK_HERO_SAVE);

  });

  it('Editar', async function(){

    const [itemUpdate] = await context.read({
      name: MOCK_HERO_UPDATE.name
    });

    const newItem = {
      ...MOCK_HERO_UPDATE,
      name:'Mulher Maravilha'
    }
    
    const [result] = await context.update(itemUpdate.id, newItem);

    const [itemUpdated] = await context.read({
      id: itemUpdate.id
    });

    assert.deepStrictEqual(result, 1);
    assert.deepStrictEqual(itemUpdated.name, newItem.name);

  });

  it('Excluir', async function(){

    const [item] = await context.read({

    });

    const result = await context.delete(item.id);

    assert.deepStrictEqual(result, 1);

  });
});
