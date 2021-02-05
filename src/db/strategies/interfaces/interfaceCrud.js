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

  update(id, item, upsert){
    throw new NotImplementedException();
  }

  delete(id){
    throw new NotImplementedException();
  }

  isConnected(){
    throw new NotImplementedException();
  }

  connect(){
    throw new NotImplementedException();
  }

}

module.exports = ICrud;