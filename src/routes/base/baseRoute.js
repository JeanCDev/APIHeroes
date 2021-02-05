class BaseRoute {

  // retorna os nomes de classes que não sejam constructor nem privadas
  static methods(){

    return Object.getOwnPropertyNames(this.prototype)
      .filter(method => method !== 'constructor' && 
        !method.startsWith('_'));

  }

}

module.exports = BaseRoute;