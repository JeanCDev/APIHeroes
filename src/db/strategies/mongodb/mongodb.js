const ICrud = require('./../interfaces/interfaceCrud');
const mongoose = require('mongoose');

const STATUS = {
  0: 'desconectado', 
  1: 'conectado', 
  2: 'conectando', 
  3: 'desconectando'
}

// classe que gerencia o MongoDB
class MongoDB extends ICrud{

  constructor(connection, schema){
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected(){

    const state = STATUS[this._connection.readyState];
    
    if(state === 'conectado') return state;
    if(state !== 'conectando') return state;
    
    await new Promise(resolve => setTimeout(resolve, 1000));

    return STATUS[this._connection.readyState];

  }

  static connect(){
    
    mongoose.connect(process.env.MONGODB_URL,{
      useNewUrlParser:true,
      useUnifiedTopology: true
    },(error)=>{

      if(!error) return;

      console.log("Fail", error);

    });

    const connection = mongoose.connection;

    connection.once('open', ()=>console.log("Database on!"));

    return connection;

  }

  create(item){
    
    return this._schema.create(item);

  }

  read(item, skip = 0, limit = 10){

    return this._schema.find(item).skip(skip).limit(limit);

  }

  update(id, item){

    return this._schema.updateOne({_id: id}, {$set: item});

  }

  delete(id){
    return this._schema.deleteOne({_id: id});
  }

}

module.exports = MongoDB;