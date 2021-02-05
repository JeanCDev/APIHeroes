const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('boom');

const failAction = (request, headers, error) => {
  throw error;
}

const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown();

class HeroRoute extends BaseRoute {

  constructor(db){
    super();
    this.db = db;
  }

  list(){

    return {
      path: '/heroes',
      method: 'GET',
      config: {
        tags: ['api'],
        description: 'Lista todos os heróis',
        notes: 'Pode listar com paginação',
        validate:{
          failAction,
          query: Joi.object({
            skip: Joi.number().integer().default(0), 
            limit: Joi.number().integer().default(10),
            name: Joi.string().min(3).max(100)
          }),
          headers
        }
      },
      handler: (request, headers)=>{

        try{

          const {
            skip, limit, name
          } = request.query;

          let query = {name: {
            $regex: `.*${name}*.`
          }};

          return this.db.read(name ? query : {}, skip, limit);

        } catch(e){
          console.log(e);
          return Boom.internal();
        }

      }
    }

  }

  create(){

    return {
      path: '/heroes',
      method: 'POST',
      config: {
        tags: ['api'],
        description: 'Cria um novo herói',
        notes: 'Adiciona o heróis e seu respectivo poder no banco de dados',
        validate: {
          failAction, 
          headers,
          payload: Joi.object({
            name: Joi.string().required().min(3).max(100),
            power: Joi.string().required().min(2).max(50)
          })
        }
      },
      handler: async (request)=>{
        try{

          const {name, power} = request.payload;
          const result = await this.db.create({name,power});

          return {
            message: 'Herói cadastrado com sucesso',
            _id: result._id
          }

        }catch(e) {
          console.log(e);
          return Boom.internal();
        }
      }
    }

  }

  update(){

    return {
      path: '/heroes/{id}',
      method: 'PATCH',
      config:{
        tags: ['api'],
        description: 'Atualiza os dados dos heróis',
        notes: 'Pode atualizar apenas um ou vários dados do herói',
        validate:{
          failAction,
          params: Joi.object({
            id: Joi.string().required()
          }),
          headers,
          payload:Joi.object({
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(2).max(100)
          })
        }
      },
      handler: async (request)=>{

        try { 
          
          const {id} = request.params;
          const {payload} = request;

          const stringData = JSON.stringify(payload);
          const data = JSON.parse(stringData);

          const result = await this.db.update(id, data);
          
          if(result.nModified !== 1) return Boom.preconditionFailed('Não encontrado no banco');

          return {
            message: 'Herói atualizado com sucesso'
          }

        } catch (e) {
          console.log(e);
          return Boom.internal();
        }

      }
    }

  }

  delete(){

    return {
      path: '/heroes/{id}',
      method: 'DELETE',
      config:{
        tags: ['api'],
        description: 'Exclui um herói',
        notes: 'Usa o id do herói para apagá-lo do banco de dados',
        validate:{
          failAction,
          headers,
          params: Joi.object({
            id: Joi.string().required()
          })
        }
      },
      handler: async (request)=>{

        try { 

          const {id} = request.params;
          const result = await this.db.delete(id);

          if(result.n !== 1) return Boom.preconditionFailed('Não encontrado no banco');

          return {
            message: 'Herói removido com sucesso'
          }

        } catch (e) { 
          console.log(e);
          return Boom.internal();
        }


      }
    }

  }

}

module.exports = HeroRoute;