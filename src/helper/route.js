const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path');
const handlebars = require('handlebars');
const config = require('../config/defaultConfig');
const mime = require('../helper/mime');

const tplPath = path.join(__dirname, '../templates/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());


module.exports = async function (req, res, filePath) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contenType = mime(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', contenType);
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      const dir = path.relative(config.root, filePath);
      console.info(config.root);
      const data = {
        files: files.map(file => {
          return {
            file,
            icon: mime(file)
          };
        }),
        dir: dir ? `/${dir}` : '',
        title: path.basename(filePath)
      };

      res.end(template(data));
    }
  } catch (ex) {
    console.error(ex);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not directory or file`);
  }
};
