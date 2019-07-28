const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");
const resolvers = require("./src/resolvers");
const typeDefs = "schema.graphql";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    prisma
  })
});

server.start({ port: process.env.PORT || 4000 }).then(e => {
  console.log(`🚀 Server ready at port: ${process.env.PORT || 4000}`);
});
