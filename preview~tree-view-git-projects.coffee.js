var fs;

fs = require('fs');

module.exports = {
  activate: function(state) {
    return atom.workspace.observePanes((function(_this) {
      return function(pane) {
        return pane.observeActiveItem(function(item) {
          if (item != null ? item.getPath : void 0) {
            return _this.gitPath('' + (typeof item.getPath === "function" ? item.getPath() : void 0), function(path) {
              return console.log(path);
            });
          }
        });
      };
    })(this));
  },
  gitPath: function(path, callback) {
    path = path.replace(/[^\\\/]*[\\\/]?$/i, '');
    if (!path.length) {
      return callback('');
    } else {
      return fs.exists(path + '.git', (function(_this) {
        return function(exists) {
          if (!exists) {
            return _this.gitPath(path, callback);
          } else {
            return callback(path);
          }
        };
      })(this));
    }
  }
};
