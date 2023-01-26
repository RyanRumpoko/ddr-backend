const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const http = require("http");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const router = require("./routes/index");
require("dotenv").config();
mongoose.set("strictQuery", true);

const app = express();
const httpServer = http.createServer(app);

const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./graphql/**/resolvers.graphql.js"))
);
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, "./graphql/**/typeDefs.graphql.js"))
);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

const startServer = async () => {
  await apolloServer.start();
  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" }));
  app.use("/", router);
};
startServer();

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    return httpServer.listen({ port: process.env.PORT }, () => {
      console.log(`Server ready @: ${process.env.PORT}/graphql`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
