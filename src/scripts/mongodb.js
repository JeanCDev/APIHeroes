// Autentica no mongoDb
/* docker exec -it 5260cdcf8d3a mongo -u jeancdev -p 19029696 --authenticationDatabase heroes */

// mostra o banco de dados
// show dbs

// Escolhe o banco de dados a ser usado
// use heroes

// mostra as coleções(tabelas)
// show collections

// insere um dado no banco
db.heroes.insert({
  name: "flash",
  power: "Velocidade",
  datNascimento: '1998-01-01'
});

// Pega os dados do banco de dados formatados
db.heroes.find().pretty();

// insere vários dados de uma vez no mangoDB com comando js
for(let i =0; i <= 10; i++){
  db.heroes.insert({
    name: `Clone-${i}`,
    power: "Velocidade",
    birthDay: `1998-01-${i}`
  });
}

//procura um dado específicos do banco de dados
db.heroes.findOne();

// conta quantas linhas tem no banco de dados
db.heroes.count();

// limita a busca e ordena pelo nome
db.heroes.find().limit(10).sort({name: -1});

// Edita os dados do objeto, sem apagar os dados não informados
db.heroes.update({
  _id: ObjectId("600b2b839e83e59675c88728")
}, {
  $set: {name: "Lanterna Verde"},
});

// Exclui os dados do banco de dados
// Se passar o objeto vazio apagará todos os dados do banco
db.heroes.remove({
  name: 'Clone-1'
});