var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Initialize GraphQL schema 
var schema = buildSchema(`
type Query {
  user(id: Int!): Person
  users(shark: String): [Person]
},
type Person {
  id: Int
  name: String
  age: Int
  shark: String
}
`);
// [Person] is syntax used to return an array of type PERSON.
// exclamation in user(id: Int!) means ID must be provided.
// USERS query takes an optional SHARK variable

// Sample users
var users = [
  {
    id: 1,
    name: 'Brian',
    age: '21',
    shark: 'Great White Shark'
  },
  {
    id: 2,
    name: 'Kim',
    age: '32',
    shark: 'Whale Shark'
  },
  {
    id: 3,
    name: 'Teresa',
    age: '23',
    shark: 'Whale Shark'
  },
  {
    id: 4,
    name: 'John',
    age: '36',
    shark: 'Hammerhead Shark'
  },
  {
    id: 5,
    name: 'Zach',
    age: '28',
    shark: 'Tiger Shark'
  }
];

// Resolver ::  Return a single user based on ID
var getUser = function(args) {
  var userID = args.id;
  return users.filter(user => user.id == userID)[0];
}

// Resolver ::  Return a list of users that takes an optional shark param
var retrieveUsers = function(args) {
  if (args.shark) {
    var shark = args.shark;
    return users.filter(user => user.shark === shark);
  } else {
    return users;
  }
}

// Root resolver
var root = {
  user: getUser,   // Resolver function to return user with specific id
  users: retrieveUsers
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema, // Must be provided
  rootValue: root, 
  graphiql: true,   // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));