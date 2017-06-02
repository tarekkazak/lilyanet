var path = require('path');
var ncp = require('ncp').ncp;
var source = `${__dirname}`;
var dest = path.resolve(`${require('os').homedir()}/Google Drive/lilyanet`);
var options = {
    filter : function(filename) {
        return filename.indexOf("node_modules") === -1;
    },
    clobber : true
}

function GoogleSyncPlugin() {}
GoogleSyncPlugin.prototype.sync = (source, dest, options) => {
        ncp(source, dest, options, function(err) {
            if(err) {
                return console.error(err);
            }
            console.log('files copied');
        })
};
GoogleSyncPlugin.prototype.apply = function(compiler) {
    var _that = this;
    compiler.plugin('compile', function(params) {
        _that.sync(source, dest, options);
    });
}

module.exports = GoogleSyncPlugin;
