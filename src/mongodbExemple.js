const mongoose = require('mongoose');

mongoose.connect('mongodb://jeancdev:19029696@localhost:27017/heroes',{
  useNewUrlParser:true,
  useUnifiedTopology: true
},(error)=>{

  if(!error) return;

  console.log("Fail", error);

});

const connection = mongoose.connection;

connection.once('open', ()=>console.log("Database on!"));

// Verifica se está conectado 
//(0: disconectado, 1: conectado, 2: conectando, 3: desconectando)
/* setTimeout(()=>{
  const state = connection.readyState;
  console.log(state)
},1000); */

const heroSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  power:{
    type: String,
    required: true
  },
  insertedAt:{
    type: Date,
    default: new Date()
  }
});

const model = mongoose.model('heroes', heroSchema);

async function main(){
  /* const resultInsert = await model.create({
    name: "Batman",
    power: "Dinheiro"
  }); */

  //console.log(resultInsert);

  const listItems = await model.find();

  console.log(listItems);

}

main();