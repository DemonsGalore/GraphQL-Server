const express = require('express');
const graphqlHTTP = require('express-graphql');

const graphQLSchema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: graphQLSchema,
  graphiql: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
