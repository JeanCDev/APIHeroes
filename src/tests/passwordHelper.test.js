const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper');

const password = '123';
const hash = '$2b$04$i84SUYhoYB20Gj5to.SKru1WsPnEtYoPQgS2OUWaoHxYrXImldLi.';

describe('User Helper test suite', function () {

  it('Deve gerar um hash a partir de uma senha', async ()=>{

    const result = await PasswordHelper.hashPassword(password);
    
    assert.ok(result.length > 10);

  });

  it('Deve compara o hash com a senha', async ()=>{

    const result = await PasswordHelper.comparePassword(
      password, hash
    );

    assert.ok(result);

  });

});