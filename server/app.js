const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const mongoose  = require('mongoose'); // Acesso ao mongo DB

const app = express();

// Connection string
// Não subir a senha
mongoose.connect('mongodb+srv://gqluser:teste**@cluster0.itrkd.mongodb.net/graphiql?retryWrites=true&w=majority',
 { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open',()=>{
  console.log('Conectou no banco!');
})

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000,() =>{
  console.log('porta 4000');
})
