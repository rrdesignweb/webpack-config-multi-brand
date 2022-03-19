const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const jsonServer = require("json-server");
const server = jsonServer.create();

const apiPath = "../_api";
const port = 3004;

let objPaths = {};
let apiEndPoints = fs.readdirSync(path.resolve(__dirname, apiPath + "/"));

apiEndPoints.forEach((file) => {
  if (file.indexOf(".json") > -1) {
    _.extend(objPaths, require(path.resolve(__dirname, apiPath + "/", file)));
  }
});

const router = jsonServer.router(objPaths);
const middlewares = jsonServer.defaults();

server.use(jsonServer.defaults());
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  const incomingRequest = require(`${apiPath + req.path}`);
  if (req.method === "POST" || req.method === "PUT") {
    let urlName = req.originalUrl.split("/").join("");
    res.json(incomingRequest[urlName]);
  } else {
    // NOT a POST or PUT request, continue to JSON Server router
    next();
  }
});

// Use default router
server.use(router);
server.listen(port, () => {
  console.log(`JSON Server is running on ${port}`);
});
