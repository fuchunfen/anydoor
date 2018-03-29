const http = require('http');
const conf = require('./config/defaultConfig.js');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route.js');

const server = http.createServer((req,res) => {
  const filePath = path.join(conf.root, req.url);
  route(req, res, filePath);
});

server.listen(conf.port,conf.hostname,() => {
  const addr = `http://${conf.hostname}:${conf.port}`;
  console.info(`server start at ${chalk.green(addr)}`);
});