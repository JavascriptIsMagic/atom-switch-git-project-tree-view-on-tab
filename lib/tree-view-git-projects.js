var co, exists, fs, path, uniqueStringArray;

fs = require('fs');

path = require('path');

co = require('co');

exists = function(filepath) {
  return new Promise(function(resolve) {
    return fs.exists(filepath, function(exists) {
      return resolve(exists);
    });
  });
};

uniqueStringArray = function(stringArray) {
  var i, len, string, unique;
  unique = {};
  for (i = 0, len = stringArray.length; i < len; i++) {
    string = stringArray[i];
    unique[string] = true;
  }
  return Object.keys(unique);
};

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
    },
    multiRoot: {
      type: 'boolean',
      title: 'Keep multiple project roots in the Tree View.',
      description: 'Disable this if you like the old behavior of only keeping a single root directory.',
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
        _this.autoReveal = autoReveal;
      };
    })(this));
    atom.config.observe('tree-view-git-projects.multiRoot', (function(_this) {
      return function(multiRoot) {
        _this.multiRoot = multiRoot;
      };
    })(this));
    return atom.workspace.observeActivePane((function(_this) {
      return function(pane) {
        return pane.observeActiveItem(function(item) {
          return co(function*() {
            var directory, ref, ref1, treeView;
            if (item != null ? item.getPath : void 0) {
              directory = (yield _this.findProjectRoot(item.getPath()));
              if (directory) {
                directory = path.resolve(directory);
                if (directory !== path.resolve(atom.project.getPaths()[0])) {
                  atom.project.setPaths(_this.multiRoot ? uniqueStringArray([directory].concat(atom.project.getPaths())) : [directory]);
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
            }
          });
        });
      };
    })(this));
  },
  findProjectRoot: function(directory) {
    return co((function(_this) {
      return function*() {
        directory = ("" + directory).replace(/[^\\\/]*[\\\/]*$/, '');
        if (directory) {
          if ((yield _this.isProjectRoot(directory))) {
            return directory;
          } else {
            return _this.findProjectRoot(directory);
          }
        } else {
          return '';
        }
      };
    })(this));
  },
  isProjectRoot: function(directory) {
    return co((function(_this) {
      return function*() {
        var i, len, ref, type;
        ref = _this.findByList;
        for (i = 0, len = ref.length; i < len; i++) {
          type = ref[i];
          if ((yield exists(directory + "/" + type))) {
            return true;
          }
        }
        return false;
      };
    })(this));
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyZWUtdmlldy1naXQtcHJvamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsdUNBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxJQUNBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsTUFLQSxHQUFTLFNBQUMsUUFBRCxHQUFBO1NBQ0gsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEdBQUE7V0FDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsU0FBQyxNQUFELEdBQUE7YUFDbEIsT0FBQSxDQUFRLE1BQVIsRUFEa0I7SUFBQSxDQUFwQixFQURVO0VBQUEsQ0FBUixFQURHO0FBQUEsQ0FMVCxDQUFBOztBQUFBLGlCQVVBLEdBQW9CLFNBQUMsV0FBRCxHQUFBO0FBQ2xCLE1BQUEsc0JBQUE7QUFBQSxFQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFDQSxPQUFBLDZDQUFBOzRCQUFBO0FBQ0UsSUFBQSxNQUFPLENBQUEsTUFBQSxDQUFQLEdBQWlCLElBQWpCLENBREY7QUFBQSxHQURBO1NBR0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBSmtCO0FBQUEsQ0FWcEIsQ0FBQTs7QUFBQSxNQWdCTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsTUFBQSxFQUNFO0FBQUEsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxLQUFBLEVBQU8sbUNBRFA7QUFBQSxNQUVBLFdBQUEsRUFBYSxzR0FGYjtBQUFBLE1BR0EsU0FBQSxFQUFTLG1CQUhUO0tBREY7QUFBQSxJQUtBLFVBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLEtBQUEsRUFBTyw4Q0FEUDtBQUFBLE1BRUEsU0FBQSxFQUFTLElBRlQ7S0FORjtBQUFB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UUFBQSxJQUFHLFNBQUg7QUFDRSxVQUFBLElBQUcsT0FBQSxLQUFPLENBQUEsYUFBRCxDQUFlLFNBQWYsQ0FBTixDQUFIO21CQUNFLFVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQWpCLEVBSEY7V0FERjtTQUFBLE1BQUE7aUJBS0ssR0FMTDtTQUZDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSCxFQURlO0VBQUEsQ0FwQ2pCO0FBQUEsRUE2Q0EsYUFBQSxFQUFlLFNBQUMsU0FBRCxHQUFBO1dBQ2IsRUFBQSxDQUFHLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxVQUFBLEdBQUE7QUFDRCxZQUFBLGlCQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBO3dCQUFBO0FBQ0UsVUFBQSxJQUFHLE9BQUEsTUFBTSxDQUFVLFNBQUQsR0FBVyxHQUFYLEdBQWMsSUFBdkIsQ0FBTixDQUFIO0FBQ0UsbUJBQU8sSUFBUCxDQURGO1dBREY7QUFBQSxTQUFBO2VBR0EsTUFKQztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUgsRUFEYTtFQUFBLENBN0NmO0NBakJGLENBQUEiLCJmaWxlIjoidHJlZS12aWV3LWdpdC1wcm9qZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXHJcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xyXG5cclxuY28gPSByZXF1aXJlICdjbydcclxuXHJcbmV4aXN0cyA9IChmaWxlcGF0aCkgLT5cclxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cclxuICAgIGZzLmV4aXN0cyBmaWxlcGF0aCwgKGV4aXN0cykgLT5cclxuICAgICAgcmVzb2x2ZSBleGlzdHNcclxuXHJcbnVuaXF1ZVN0cmluZ0FycmF5ID0gKHN0cmluZ0FycmF5KSAtPlxyXG4gIHVuaXF1ZSA9IHt9XHJcbiAgZm9yIHN0cmluZyBpbiBzdHJpbmdBcnJheVxyXG4gICAgdW5pcXVlW3N0cmluZ10gPSB5ZXNcclxuICBPYmplY3Qua2V5cyB1bmlxdWVcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBjb25maWc6XHJcbiAgICBmaW5kQnlMaXN0OlxyXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xyXG4gICAgICB0aXRsZTogJ0ZpbmQgcHJvamVjdCByb290IGRpcmVjdG9yaWVzIGJ5OidcclxuICAgICAgZGVzY3JpcHRpb246ICdMaXN0IG9mIGZpbGUgcGF0aHMgc2VwZXJhdGVkIGJ5IFwifFwiIFxcblRoZSBleGlzdGFuY2Ugb2Ygb25lIG9mIHRoZXNlIGluZGljYXRlcyB0aGUgcm9vdCBvZiBhIHByb2plY3QuJ1xyXG4gICAgICBkZWZhdWx0OiAnLmdpdHxwYWNrYWdlLmpzb24nXHJcbiAgICBhdXRvUmV2ZWFsOlxyXG4gICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IFJldmVhbCBhY3RpdmUgdGFiIGluIFRyZWUgVmlldydcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgbXVsdGlSb290OlxyXG4gICAgICB0eXBlOiAnYm9vbGVhbidcclxuICAgICAgdGl0bGU6ICdLZWVwIG11bHRpcGxlIHByb2plY3Qgcm9vdHMgaW4gdGhlIFRyZWUgVmlldy4nXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSB0aGlzIGlmIHlvdSBsaWtlIHRoZSBvbGQgYmVoYXZpb3Igb2Ygb25seSBrZWVwaW5nIGEgc2luZ2xlIHJvb3QgZGlyZWN0b3J5LidcclxuICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gIGFjdGl2YXRlOiAtPlxyXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1wcm9qZWN0cy5maW5kQnlMaXN0JywgKGZpbmRCeUxpc3QpID0+XHJcbiAgICAgIEBmaW5kQnlMaXN0ID0gXCIje2ZpbmRCeUxpc3R9XCIuc3BsaXQgJ3wnXHJcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXByb2plY3RzLmF1dG9SZXZlYWwnLCAoQGF1dG9SZXZlYWwpID0+XHJcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXByb2plY3RzLm11bHRpUm9vdCcsIChAbXVsdGlSb290KSA9PlxyXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmUgKHBhbmUpID0+XHJcbiAgICAgIHBhbmUub2JzZXJ2ZUFjdGl2ZUl0ZW0gKGl0ZW0pID0+XHJcbiAgICAgICAgY28gPT5cclxuICAgICAgICAgIGlmIGl0ZW0/LmdldFBhdGhcclxuICAgICAgICAgICAgZGlyZWN0b3J5ID0geWllbGQgQGZpbmRQcm9qZWN0Um9vdCBpdGVtLmdldFBhdGgoKVxyXG4gICAgICAgICAgICBpZiBkaXJlY3RvcnlcclxuICAgICAgICAgICAgICBkaXJlY3RvcnkgPSBwYXRoLnJlc29sdmUgZGlyZWN0b3J5XHJcbiAgICAgICAgICAgICAgaWYgZGlyZWN0b3J5IGlzbnQgcGF0aC5yZXNvbHZlIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXHJcbiAgICAgICAgICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMgaWYgQG11bHRpUm9vdFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXF1ZVN0cmluZ0FycmF5IFtkaXJlY3RvcnldLmNvbmNhdCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxyXG4gICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgW2RpcmVjdG9yeV1cclxuICAgICAgICAgICAgaWYgQGF1dG9SZXZlYWxcclxuICAgICAgICAgICAgICB0cmVlVmlldyA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3Jyk/Lm1haW5Nb2R1bGU/LnRyZWVWaWV3XHJcbiAgICAgICAgICAgICAgdHJlZVZpZXc/LnJldmVhbEFjdGl2ZUZpbGU/KClcclxuICAgICAgICAgICAgICB0cmVlVmlldz8udW5mb2N1cz8oKVxyXG4gIGZpbmRQcm9qZWN0Um9vdDogKGRpcmVjdG9yeSkgLT5cclxuICAgIGNvID0+XHJcbiAgICAgIGRpcmVjdG9yeSA9IFwiI3tkaXJlY3Rvcnl9XCIucmVwbGFjZSAvW15cXFxcXFwvXSpbXFxcXFxcL10qJC8sICcnXHJcbiAgICAgIGlmIGRpcmVjdG9yeVxyXG4gICAgICAgIGlmIHlpZWxkIEBpc1Byb2plY3RSb290IGRpcmVjdG9yeVxyXG4gICAgICAgICAgZGlyZWN0b3J5XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGZpbmRQcm9qZWN0Um9vdCBkaXJlY3RvcnlcclxuICAgICAgZWxzZSAnJ1xyXG4gIGlzUHJvamVjdFJvb3Q6IChkaXJlY3RvcnkpIC0+XHJcbiAgICBjbyA9PlxyXG4gICAgICBmb3IgdHlwZSBpbiBAZmluZEJ5TGlzdFxyXG4gICAgICAgIGlmIHlpZWxkIGV4aXN0cyBcIiN7ZGlyZWN0b3J5fS8je3R5cGV9XCJcclxuICAgICAgICAgIHJldHVybiB5ZXNcclxuICAgICAgbm9cclxuIl19