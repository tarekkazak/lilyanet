var path = require('path');
var dest = `${__dirname}`;
var source = path.resolve(`${require('os').homedir()}/Google Drive/lilyanet`);
let GoogleSync = require('./googleSyncPlugin');
new GoogleSync().sync(source, dest, {clobber : true});
