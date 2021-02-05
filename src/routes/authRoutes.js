const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');
const jwt = require('jsonwebtoken');

const PasswordHelper = require('../helpers/passwordHelper');

const failAction = (request, headers, error) => {
  throw error;
}

const user = {
  username: 'JeanCDev',
  password: '123456'
}

class AuthRoutes extends BaseRoute {

  constructor(secret, db){
    super();
    this.secret = secret;
    this.db = db;
  }

  login(){

    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Obtém token', 
        notes: 'Faz login com usuário e senha no banco',
        validate:{
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
          })
        }
      },
      handler: async (request)=>{

        const {
          username, password
        } = request.payload

        const [user] = await this.db.read({
          username
        });

        if(!user){
          return Boom.unauthorized('O usuário não existe');
        }

        const match = PasswordHelper
                        .comparePassword(password, user.password);

        if(!match){
          return Boom.unauthorized('Usuário ou senha é inválido');
        }

        const token = jwt.sign({
          username,
          id: user.id
        }, this.secret);

        return {
          token
        }

      }
    }

  }

}

module.exports = AuthRoutes;