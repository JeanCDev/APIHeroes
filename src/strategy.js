
// exceção em caso de não implementação
class NotImplementedException extends Error {

  constructor(){

    super("Not Implemented Exception");

  }

}

// exceções para erro na execução dos comandos
class ICrud{

  create(item){
    throw new NotImplementedException();
  }

  read(item){
    throw new NotImplementedException();
  }

  update(id, item){
    throw new NotImplementedException();
  }

  delete(id){
    throw new NotImplementedException();
  }

}

// classe que gerencia o postgresSQL
class Postgres extends ICrud{

  constructor(){
    super();
  }

  create(item){
    console.log('O item foi salvo no Postgres');
  }

}

// classe que gerencia o MongoDB
class MongoDB extends ICrud{

  constructor(){
    super();
  }

  create(item){
    console.log('O item foi salvo no MongoDB');
  }

}

// Estratégia de implementação do CRUD
class ContentStrategy{

  constructor(strategy){
    this._database = strategy;
  }

  create(item){
    return this._database.create(item);
  }

  read(item){
    return this._database.read(item);
  }

  update(id, item){
    return this._database.update(id, item);
  }

  delete(id){
    return this._database.delete(id);
  }

}

const contextMongo = new ContentStrategy(new MongoDB());
contextMongo.create();
contextMongo.read(); // erro por não ter o método implementado

const contextPostgres = new ContentStrategy(new Postgres());
contextPostgres.create();