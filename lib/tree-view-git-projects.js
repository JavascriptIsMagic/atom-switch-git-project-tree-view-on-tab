var alphabetizePaths, co, exists, fs, getRealPaths, path, realpath, uniqueStringArray;

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

realpath = function(filepath) {
  return new Promise(function(resolve, reject) {
    return fs.realpath(filepath, function(err, real) {
      if (err) {
        return reject(err);
      }
      return resolve(real);
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

getRealPaths = function() {
  return co(function*() {
    var i, len, ref, results, rootDirectory;
    ref = atom.project.rootDirectories;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      rootDirectory = ref[i];
      results.push(rootDirectory.realPath || ((yield realpath(rootDirectory.path))));
    }
    return results;
  });
};

alphabetizePaths = function(a, b) {
  return ("" + a).replace(/^.*[\\\/]/, '').toLowerCase().localeCompare(("" + b).replace(/^.*[\\\/]/, '').toLowerCase());
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
    alphabetizeRoots: {
      type: 'boolean',
      title: 'Automatically Sort projects alphabetically in Tree View',
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
    atom.config.observe('tree-view-git-projects.alphabetizeRoots', (function(_this) {
      return function(alphabetizeRoots) {
        _this.alphabetizeRoots = alphabetizeRoots;
      };
    })(this));
    return atom.workspace.observeActivePane((function(_this) {
      return function(pane) {
        return pane.observeActiveItem(function(item) {
          return co(function*() {
            var directory, ref, ref1, roots, treeView;
            if (item != null ? item.getPath : void 0) {
              directory = (yield _this.findProjectRoot(item.getPath()));
              if (directory) {
                directory = path.resolve(directory);
                if (directory !== path.resolve(atom.project.getPaths()[0])) {
                  atom.project.setPaths(_this.multiRoot ? (roots = uniqueStringArray([directory].concat((yield getRealPaths()))), _this.alphabetizeRoots ? roots.sort(alphabetizePaths) : roots) : [directory]);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyZWUtdmlldy1naXQtcHJvamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztBQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7QUFFUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0FBRUwsTUFBQSxHQUFTLFNBQUMsUUFBRDtTQUNILElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRDtXQUNWLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixTQUFDLE1BQUQ7YUFDbEIsT0FBQSxDQUFRLE1BQVI7SUFEa0IsQ0FBcEI7RUFEVSxDQUFSO0FBREc7O0FBTVQsUUFBQSxHQUFXLFNBQUMsUUFBRDtTQUNMLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVY7V0FDVixFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsU0FBQyxHQUFELEVBQU0sSUFBTjtNQUNwQixJQUFHLEdBQUg7QUFBWSxlQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQW5COzthQUNBLE9BQUEsQ0FBUSxJQUFSO0lBRm9CLENBQXRCO0VBRFUsQ0FBUjtBQURLOztBQU1YLGlCQUFBLEdBQW9CLFNBQUMsV0FBRDtBQUNsQixNQUFBO0VBQUEsTUFBQSxHQUFTO0FBQ1QsT0FBQSw2Q0FBQTs7SUFDRSxNQUFPLENBQUEsTUFBQSxDQUFQLEdBQWlCO0FBRG5CO1NBRUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaO0FBSmtCOztBQU1wQixZQUFBLEdBQWUsU0FBQTtTQUFHLEVBQUEsQ0FBRyxVQUFBO0FBQ25CLFFBQUE7QUFBQTtBQUFBO1NBQUEscUNBQUE7O21CQUFBLGFBQWEsQ0FBQyxRQUFkLElBQTBCLENBQUMsT0FBTSxRQUFBLENBQVMsYUFBYSxDQUFDLElBQXZCLENBQU4sQ0FBRDtBQUExQjs7RUFEbUIsQ0FBSDtBQUFIOztBQUdmLGdCQUFBLEdBQW1CLFNBQUMsQ0FBRCxFQUFJLENB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LEdBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxnQkFBWCxDQURGLEdBR0UsS0FKRixDQURrQixHQU9sQixDQUFDLFNBQUQsQ0FQSixFQURGO2lCQUZGOztjQVdBLElBQUcsS0FBQyxDQUFBLFVBQUo7Z0JBQ0UsUUFBQSx1R0FBa0UsQ0FBRTs7O29CQUNwRSxRQUFRLENBQUU7OzttRkFDVixRQUFRLENBQUUsNEJBSFo7ZUFiRjs7VUFEQyxDQUFIO1FBRHFCLENBQXZCO01BRCtCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQztFQU5RLENBbkJWO0VBNkNBLGVBQUEsRUFBaUIsU0FBQyxTQUFEO1dBQ2YsRUFBQSxDQUFHLENBQUEsU0FBQSxLQUFBO2FBQUEsVUFBQTtRQUNELFNBQUEsR0FBWSxDQUFBLEVBQUEsR0FBRyxTQUFILENBQWMsQ0FBQyxPQUFmLENBQXVCLGtCQUF2QixFQUEyQyxFQUEzQztRQUNaLElBQUcsU0FBSDtVQUNFLElBQUcsT0FBTSxLQUFDLENBQUEsYUFBRCxDQUFlLFNBQWYsQ0FBTixDQUFIO21CQUNFLFVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQWpCLEVBSEY7V0FERjtTQUFBLE1BQUE7aUJBS0ssR0FMTDs7TUFGQztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSDtFQURlLENBN0NqQjtFQXNEQSxhQUFBLEVBQWUsU0FBQyxTQUFEO1dBQ2IsRUFBQSxDQUFHLENBQUEsU0FBQSxLQUFBO2FBQUEsVUFBQTtBQUNELFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7O1VBQ0UsSUFBRyxPQUFNLE1BQUEsQ0FBVSxTQUFELEdBQVcsR0FBWCxHQUFjLElBQXZCLENBQU4sQ0FBSDtBQUNFLG1CQUFPLEtBRFQ7O0FBREY7ZUFHQTtNQUpDO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFIO0VBRGEsQ0F0RGYiLCJmaWxlIjoidHJlZS12aWV3LWdpdC1wcm9qZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuY28gPSByZXF1aXJlICdjbydcblxuZXhpc3RzID0gKGZpbGVwYXRoKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICBmcy5leGlzdHMgZmlsZXBhdGgsIChleGlzdHMpIC0+XG4gICAgICByZXNvbHZlIGV4aXN0c1xuXG4jIFRPRE86IHVzZSBjYWNoZSBwYXJhbWV0ZXJcbnJlYWxwYXRoID0gKGZpbGVwYXRoKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIGZzLnJlYWxwYXRoIGZpbGVwYXRoLCAoZXJyLCByZWFsKSAtPlxuICAgICAgaWYgZXJyIHRoZW4gcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICByZXNvbHZlIHJlYWxcblxudW5pcXVlU3RyaW5nQXJyYXkgPSAoc3RyaW5nQXJyYXkpIC0+XG4gIHVuaXF1ZSA9IHt9XG4gIGZvciBzdHJpbmcgaW4gc3RyaW5nQXJyYXlcbiAgICB1bmlxdWVbc3RyaW5nXSA9IHllc1xuICBPYmplY3Qua2V5cyB1bmlxdWVcblxuZ2V0UmVhbFBhdGhzID0gLT4gY28gLT5cbiAgcm9vdERpcmVjdG9yeS5yZWFsUGF0aCBvciAoeWllbGQgcmVhbHBhdGgocm9vdERpcmVjdG9yeS5wYXRoKSkgZm9yIHJvb3REaXJlY3RvcnkgaW4gYXRvbS5wcm9qZWN0LnJvb3REaXJlY3Rvcmllc1xuXG5hbHBoYWJldGl6ZVBhdGhzID0gKGEsIGIpIC0+XG4gIFwiI3thfVwiLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKS50b0xvd2VyQ2FzZSgpLmxvY2FsZUNvbXBhcmUoXCIje2J9XCIucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpLnRvTG93ZXJDYXNlKCkpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGZpbmRCeUxpc3Q6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgdGl0bGU6ICdGaW5kIHByb2plY3Qgcm9vdCBkaXJlY3RvcmllcyBieTonXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpc3Qgb2YgZmlsZSBwYXRocyBzZXBlcmF0ZWQgYnkgXCJ8XCIgXFxuVGhlIGV4aXN0YW5jZSBvZiBvbmUgb2YgdGhlc2UgaW5kaWNhdGVzIHRoZSByb290IG9mIGEgcHJvamVjdC4nXG4gICAgICBkZWZhdWx0OiAnLmdpdHxwYWNrYWdlLmpzb24nXG4gICAgYXV0b1JldmVhbDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IFJldmVhbCBhY3RpdmUgdGFiIGluIFRyZWUgVmlldydcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBhbHBoYWJldGl6ZVJvb3RzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgU29ydCBwcm9qZWN0cyBhbHBoYWJldGljYWxseSBpbiBUcmVlIFZpZXcnXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgbXVsdGlSb290OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB0aXRsZTogJ0tlZXAgbXVsdGlwbGUgcHJvamVjdCByb290cyBpbiB0aGUgVHJlZSBWaWV3LidcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSB0aGlzIGlmIHlvdSBsaWtlIHRoZSBvbGQgYmVoYXZpb3Igb2Ygb25seSBrZWVwaW5nIGEgc2luZ2xlIHJvb3QgZGlyZWN0b3J5LidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgYWN0aXZhdGU6IC0+XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1wcm9qZWN0cy5maW5kQnlMaXN0JywgKGZpbmRCeUxpc3QpID0+XG4gICAgICBAZmluZEJ5TGlzdCA9IFwiI3tmaW5kQnlMaXN0fVwiLnNwbGl0ICd8J1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuYXV0b1JldmVhbCcsIChAYXV0b1JldmVhbCkgPT5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXByb2plY3RzLm11bHRpUm9vdCcsIChAbXVsdGlSb290KSA9PlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuYWxwaGFiZXRpemVSb290cycsIChAYWxwaGFiZXRpemVSb290cykgPT5cbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZSAocGFuZSkgPT5cbiAgICAgIHBhbmUub2JzZXJ2ZUFjdGl2ZUl0ZW0gKGl0ZW0pID0+XG4gICAgICAgIGNvID0+XG4gICAgICAgICAgaWYgaXRlbT8uZ2V0UGF0aFxuICAgICAgICAgICAgZGlyZWN0b3J5ID0geWllbGQgQGZpbmRQcm9qZWN0Um9vdCBpdGVtLmdldFBhdGgoKVxuICAgICAgICAgICAgaWYgZGlyZWN0b3J5XG4gICAgICAgICAgICAgIGRpcmVjdG9yeSA9IHBhdGgucmVzb2x2ZSBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgaWYgZGlyZWN0b3J5IGlzbnQgcGF0aC5yZXNvbHZlIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgICAgICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIGlmIEBtdWx0aVJvb3RcbiAgICAgICAgICAgICAgICAgICAgcm9vdHMgPSB1bmlxdWVTdHJpbmdBcnJheSBbZGlyZWN0b3J5XS5jb25jYXQoeWllbGQgZ2V0UmVhbFBhdGhzKCkpXG4gICAgICAgICAgICAgICAgICAgIGlmIEBhbHBoYWJldGl6ZVJvb3RzXG4gICAgICAgICAgICAgICAgICAgICAgcm9vdHMuc29ydCBhbHBoYWJldGl6ZVBhdGhzXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICByb290c1xuICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBbZGlyZWN0b3J5XVxuICAgICAgICAgICAgaWYgQGF1dG9SZXZlYWxcbiAgICAgICAgICAgICAgdHJlZVZpZXcgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ3RyZWUtdmlldycpPy5tYWluTW9kdWxlPy50cmVlVmlld1xuICAgICAgICAgICAgICB0cmVlVmlldz8ucmV2ZWFsQWN0aXZlRmlsZT8oKVxuICAgICAgICAgICAgICB0cmVlVmlldz8udW5mb2N1cz8oKVxuICBmaW5kUHJvamVjdFJvb3Q6IChkaXJlY3RvcnkpIC0+XG4gICAgY28gPT5cbiAgICAgIGRpcmVjdG9yeSA9IFwiI3tkaXJlY3Rvcnl9XCIucmVwbGFjZSAvW15cXFxcXFwvXSpbXFxcXFxcL10qJC8sICcnXG4gICAgICBpZiBkaXJlY3RvcnlcbiAgICAgICAgaWYgeWllbGQgQGlzUHJvamVjdFJvb3QgZGlyZWN0b3J5XG4gICAgICAgICAgZGlyZWN0b3J5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAZmluZFByb2plY3RSb290IGRpcmVjdG9yeVxuICAgICAgZWxzZSAnJ1xuICBpc1Byb2plY3RSb290OiAoZGlyZWN0b3J5KSAtPlxuICAgIGNvID0+XG4gICAgICBmb3IgdHlwZSBpbiBAZmluZEJ5TGlzdFxuICAgICAgICBpZiB5aWVsZCBleGlzdHMgXCIje2RpcmVjdG9yeX0vI3t0eXBlfVwiXG4gICAgICAgICAgcmV0dXJuIHllc1xuICAgICAgbm9cbiJdfQ==