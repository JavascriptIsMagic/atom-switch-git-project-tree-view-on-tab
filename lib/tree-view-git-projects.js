var fs, path;

fs = require('fs');

path = require('path');

module.exports = {
  config: {
    findByList: {
      type: 'string',
      title: 'Find project root directories by:',
      description: 'List of file paths seperated by "|" \nThe existance of one of these indicates the root of a project.',
      "default": '.git|package.json'
    },
    autoReveal: {
      type: 'boolean',
      title: 'Automatically Reveal active tab in Tree View',
      "default": true
    }
  },
  activate: function() {
    atom.config.observe('tree-view-git-projects.findByList', (function(_this) {
      return function(findByList) {
        return _this.findByList = ("" + findByList).split('|');
      };
    })(this));
    atom.config.observe('tree-view-git-projects.autoReveal', (function(_this) {
      return function(autoReveal) {
        return _this.autoReveal = autoReveal;
      };
    })(this));
    return atom.workspace.observeActivePane((function(_this) {
      return function(pane) {
        return pane.observeActiveItem(function(item) {
          if (item != null ? item.getPath : void 0) {
            return _this.findProjectRoot(typeof item.getPath === "function" ? item.getPath() : void 0, function(directory) {
              var ref, ref1, treeView;
              if (directory) {
                directory = path.resolve(directory);
                if (directory !== path.resolve(atom.project.getPaths()[0])) {
                  atom.project.setPaths([directory]);
                }
              }
              if (_this.autoReveal) {
                treeView = (ref = atom.packages.getActivePackage('tree-view')) != null ? (ref1 = ref.mainModule) != null ? ref1.treeView : void 0 : void 0;
                if (treeView != null) {
                  if (typeof treeView.revealActiveFile === "function") {
                    treeView.revealActiveFile();
                  }
                }
                return treeView != null ? typeof treeView.unfocus === "function" ? treeView.unfocus() : void 0 : void 0;
              }
            });
          }
        });
      };
    })(this));
  },
  findProjectRoot: function(directory, callback) {
    directory = ("" + directory).replace(/[^\\\/]*[\\\/]*$/, '');
    if (directory) {
      return this.isProjectRoot(directory, (function(_this) {
        return function(isRoot) {
          if (isRoot) {
            return callback(directory);
          } else {
            return _this.findProjectRoot(directory, callback);
          }
        };
      })(this));
    } else {
      return callback('');
    }
  },
  isProjectRoot: function(directory, callback) {
    var completed, done, i, len, length, ref, results, type;
    completed = 0;
    done = false;
    length = this.findByList.length;
    ref = this.findByList;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      type = ref[i];
      results.push(fs.exists(directory + '/' + type, (function(_this) {
        return function(exists) {
          if (!done) {
            completed += 1;
            if (exists) {
              done = true;
              return callback(true);
            } else if (completed === length) {
              done = true;
              return callback(false);
            }
          }
        };
      })(this)));
    }
    return results;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyZWUtdmlldy1naXQtcHJvamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsUUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLElBQ0EsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsTUFHTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsTUFBQSxFQUNFO0FBQUEsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxLQUFBLEVBQU8sbUNBRFA7QUFBQSxNQUVBLFdBQUEsRUFBYSxzR0FGYjtBQUFBLE1BR0EsU0FBQSxFQUFTLG1CQUhUO0tBREY7QUFBQSxJQUtBLFVBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLEtBQUEsRUFBTyw4Q0FEUDtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7S0FORjtHQURGO0FBQUEsRUFVQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsSUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsbUNBQXBCLEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLFVBQUQsR0FBQTtlQUN2RCxLQUFDLENBQUEsVUFBRCxHQUFjLENBQUEsRUFBQSxHQUFHLFVBQUgsQ0FBZSxDQUFDLEtBQWhCLENBQXNCLEdBQXRCLEVBRHlDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekQsQ0FBQSxDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsbUNBQXBCLEVBQXlELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLFVBQUQsR0FBQTtlQUN2RCxLQUFDLENBQUEsVUFBRCxHQUFjLFdBRHlDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekQsQ0FGQSxDQUFBO1dBSUEsSUFBSSxD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InNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXHJcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG4gIGNvbmZpZzpcclxuICAgIGZpbmRCeUxpc3Q6XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgIHRpdGxlOiAnRmluZCBwcm9qZWN0IHJvb3QgZGlyZWN0b3JpZXMgYnk6J1xyXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpc3Qgb2YgZmlsZSBwYXRocyBzZXBlcmF0ZWQgYnkgXCJ8XCIgXFxuVGhlIGV4aXN0YW5jZSBvZiBvbmUgb2YgdGhlc2UgaW5kaWNhdGVzIHRoZSByb290IG9mIGEgcHJvamVjdC4nXHJcbiAgICAgIGRlZmF1bHQ6ICcuZ2l0fHBhY2thZ2UuanNvbidcclxuICAgIGF1dG9SZXZlYWw6XHJcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgUmV2ZWFsIGFjdGl2ZSB0YWIgaW4gVHJlZSBWaWV3J1xyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgYWN0aXZhdGU6IC0+XHJcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXByb2plY3RzLmZpbmRCeUxpc3QnLCAoZmluZEJ5TGlzdCkgPT5cclxuICAgICAgQGZpbmRCeUxpc3QgPSBcIiN7ZmluZEJ5TGlzdH1cIi5zcGxpdCAnfCdcclxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuYXV0b1JldmVhbCcsIChhdXRvUmV2ZWFsKSA9PlxyXG4gICAgICBAYXV0b1JldmVhbCA9IGF1dG9SZXZlYWxcclxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lIChwYW5lKSA9PlxyXG4gICAgICBwYW5lLm9ic2VydmVBY3RpdmVJdGVtIChpdGVtKSA9PlxyXG4gICAgICAgIGlmIGl0ZW0/LmdldFBhdGhcclxuICAgICAgICAgIEBmaW5kUHJvamVjdFJvb3QgaXRlbS5nZXRQYXRoPygpLCAoZGlyZWN0b3J5KSA9PlxyXG4gICAgICAgICAgICBpZiBkaXJlY3RvcnlcclxuICAgICAgICAgICAgICBkaXJlY3RvcnkgPSBwYXRoLnJlc29sdmUgZGlyZWN0b3J5XHJcbiAgICAgICAgICAgICAgaWYgZGlyZWN0b3J5IGlzbnQgcGF0aC5yZXNvbHZlIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXHJcbiAgICAgICAgICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMgW2RpcmVjdG9yeV1cclxuICAgICAgICAgICAgaWYgQGF1dG9SZXZlYWxcclxuICAgICAgICAgICAgICB0cmVlVmlldyA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3Jyk/Lm1haW5Nb2R1bGU/LnRyZWVWaWV3XHJcbiAgICAgICAgICAgICAgdHJlZVZpZXc/LnJldmVhbEFjdGl2ZUZpbGU/KClcclxuICAgICAgICAgICAgICB0cmVlVmlldz8udW5mb2N1cz8oKVxyXG4gIGZpbmRQcm9qZWN0Um9vdDogKGRpcmVjdG9yeSwgY2FsbGJhY2spIC0+XHJcbiAgICBkaXJlY3RvcnkgPSBcIiN7ZGlyZWN0b3J5fVwiLnJlcGxhY2UgL1teXFxcXFxcL10qW1xcXFxcXC9dKiQvLCAnJ1xyXG4gICAgaWYgZGlyZWN0b3J5XHJcbiAgICAgIEBpc1Byb2plY3RSb290IGRpcmVjdG9yeSwgKGlzUm9vdCkgPT5cclxuICAgICAgICBpZiBpc1Jvb3RcclxuICAgICAgICAgIGNhbGxiYWNrIGRpcmVjdG9yeVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBmaW5kUHJvamVjdFJvb3QgZGlyZWN0b3J5LCBjYWxsYmFja1xyXG4gICAgZWxzZVxyXG4gICAgICBjYWxsYmFjayAnJ1xyXG4gIGlzUHJvamVjdFJvb3Q6IChkaXJlY3RvcnksIGNhbGxiYWNrKSAtPlxyXG4gICAgY29tcGxldGVkID0gMFxyXG4gICAgZG9uZSA9IG5vXHJcbiAgICBsZW5ndGggPSBAZmluZEJ5TGlzdC5sZW5ndGhcclxuICAgIGZvciB0eXBlIGluIEBmaW5kQnlMaXN0XHJcbiAgICAgIGZzLmV4aXN0cyBkaXJlY3RvcnkgKyAnLycgKyB0eXBlLCAoZXhpc3RzKSA9PlxyXG4gICAgICAgIHVubGVzcyBkb25lXHJcbiAgICAgICAgICBjb21wbGV0ZWQgKz0gMVxyXG4gICAgICAgICAgaWYgZXhpc3RzXHJcbiAgICAgICAgICAgIGRvbmUgPSB5ZXNcclxuICAgICAgICAgICAgY2FsbGJhY2sgeWVzXHJcbiAgICAgICAgICBlbHNlIGlmIGNvbXBsZXRlZCBpcyBsZW5ndGhcclxuICAgICAgICAgICAgZG9uZSA9IHllc1xyXG4gICAgICAgICAgICBjYWxsYmFjayBub1xyXG4iXX0=