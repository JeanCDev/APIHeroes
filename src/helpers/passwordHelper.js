const bcrypt = require('bcrypt');

const {
  promisify
} = require('util');

// converte de callback para promise
const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);
const salt = Number(process.env.SALT_PWD);

class PasswordHelper{

  // cria o hash da senha
  static hashPassword(password) {

    return hashAsync(password, salt);

  }

  // compara a senha com o hash
  static comparePassword(password, hash) {

    return compareAsync(password, hash);

  }

}

module.exports = PasswordHelper;
