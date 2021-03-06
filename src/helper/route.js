const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path');
const handlebars = require('handlebars');
const mime = require('../helper/mime');
const compress = require('./compress');
const range = require('./range');
const ifFresh = require('./cache');

const tplPath = path.join(__dirname, '../templates/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());


module.exports = async function (req, res, filePath,config) {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contenType = mime(filePath);

      res.setHeader('Content-Type', contenType);

      if(ifFresh(stats,req,res)){
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      const {code, start, end} = range(stats.size, req, res);
      if(code == 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      }else{
        res.statusCode = 206;
        rs = fs.createReadStream(filePath, {start, end});
      }
      if(filePath.match(config.compress)){
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
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
