var _, alphabetizePaths, co, exists, fs, getRealPaths, path, realpath, setPaths, uniqueStringArray;

fs = require('fs');

path = require('path');

co = require('co');

_ = require('underscore-plus');

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

setPaths = function(newPaths) {
  var oldPaths;
  oldPaths = atom.project.getPaths();
  if (!_.isEqual(newPaths, oldPaths)) {
    return atom.project.setPaths(newPaths);
  }
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
                  setPaths(_this.multiRoot ? (roots = uniqueStringArray([directory].concat((yield getRealPaths()))), _this.alphabetizeRoots ? roots.sort(alphabetizePaths) : roots) : [directory]);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyZWUtdmlldy1naXQtcHJvamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztBQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7QUFFUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7QUFFSixNQUFBLEdBQVMsU0FBQyxRQUFEO1NBQ0gsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFEO1dBQ1YsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLFNBQUMsTUFBRDthQUNsQixPQUFBLENBQVEsTUFBUjtJQURrQixDQUFwQjtFQURVLENBQVI7QUFERzs7QUFNVCxRQUFBLEdBQVcsU0FBQyxRQUFEO1NBQ0wsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVjtXQUNWLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixTQUFDLEdBQUQsRUFBTSxJQUFOO01BQ3BCLElBQUcsR0FBSDtBQUFZLGVBQU8sTUFBQSxDQUFPLEdBQVAsRUFBbkI7O2FBQ0EsT0FBQSxDQUFRLElBQVI7SUFGb0IsQ0FBdEI7RUFEVSxDQUFSO0FBREs7O0FBTVgsaUJBQUEsR0FBb0IsU0FBQyxXQUFEO0FBQ2xCLE1BQUE7RUFBQSxNQUFBLEdBQVM7QUFDVCxPQUFBLDZDQUFBOztJQUNFLE1BQU8sQ0FBQSxNQUFBLENBQVAsR0FBaUI7QUFEbkI7U0FFQSxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVo7QUFKa0I7O0FBTXBCLFlBQUEsR0FBZSxTQUFBO1NBQUcsRUFBQSxDQUFHLFVBQUE7QUFDbkIsUUFBQTtBQUFBO0FBQUE7U0FBQSxxQ0FBQTs7bUJBQUEsYUFBYSxDQUFDLFFBQWQsSUFBMEIsQ0FBQyxPQUFNLFFBQUEsQ0FBUyxhQUFhLENBQUMsSUFBdkIsQ0FBTixDQUFEO0FBQTFCOztFQURtQixDQUFIO0FBQUg7O0FB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T0FBTSxNQUFBLENBQVUsU0FBRCxHQUFXLEdBQVgsR0FBYyxJQUF2QixDQUFOLENBQUg7QUFDRSxtQkFBTyxLQURUOztBQURGO2VBR0E7TUFKQztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSDtFQURhLENBdERmIiwiZmlsZSI6InRyZWUtdmlldy1naXQtcHJvamVjdHMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbmNvID0gcmVxdWlyZSAnY28nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG5leGlzdHMgPSAoZmlsZXBhdGgpIC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxuICAgIGZzLmV4aXN0cyBmaWxlcGF0aCwgKGV4aXN0cykgLT5cbiAgICAgIHJlc29sdmUgZXhpc3RzXG5cbiMgVE9ETzogdXNlIGNhY2hlIHBhcmFtZXRlclxucmVhbHBhdGggPSAoZmlsZXBhdGgpIC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgZnMucmVhbHBhdGggZmlsZXBhdGgsIChlcnIsIHJlYWwpIC0+XG4gICAgICBpZiBlcnIgdGhlbiByZXR1cm4gcmVqZWN0KGVycilcbiAgICAgIHJlc29sdmUgcmVhbFxuXG51bmlxdWVTdHJpbmdBcnJheSA9IChzdHJpbmdBcnJheSkgLT5cbiAgdW5pcXVlID0ge31cbiAgZm9yIHN0cmluZyBpbiBzdHJpbmdBcnJheVxuICAgIHVuaXF1ZVtzdHJpbmddID0geWVzXG4gIE9iamVjdC5rZXlzIHVuaXF1ZVxuXG5nZXRSZWFsUGF0aHMgPSAtPiBjbyAtPlxuICByb290RGlyZWN0b3J5LnJlYWxQYXRoIG9yICh5aWVsZCByZWFscGF0aChyb290RGlyZWN0b3J5LnBhdGgpKSBmb3Igcm9vdERpcmVjdG9yeSBpbiBhdG9tLnByb2plY3Qucm9vdERpcmVjdG9yaWVzXG5cbmFscGhhYmV0aXplUGF0aHMgPSAoYSwgYikgLT5cbiAgXCIje2F9XCIucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpLnRvTG93ZXJDYXNlKCkubG9jYWxlQ29tcGFyZShcIiN7Yn1cIi5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJykudG9Mb3dlckNhc2UoKSlcblxuc2V0UGF0aHMgPSAobmV3UGF0aHMpIC0+XG4gIG9sZFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgdW5sZXNzIF8uaXNFcXVhbCBuZXdQYXRocywgb2xkUGF0aHNcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMobmV3UGF0aHMpXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGZpbmRCeUxpc3Q6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgdGl0bGU6ICdGaW5kIHByb2plY3Qgcm9vdCBkaXJlY3RvcmllcyBieTonXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpc3Qgb2YgZmlsZSBwYXRocyBzZXBlcmF0ZWQgYnkgXCJ8XCIgXFxuVGhlIGV4aXN0YW5jZSBvZiBvbmUgb2YgdGhlc2UgaW5kaWNhdGVzIHRoZSByb290IG9mIGEgcHJvamVjdC4nXG4gICAgICBkZWZhdWx0OiAnLmdpdHxwYWNrYWdlLmpzb24nXG4gICAgYXV0b1JldmVhbDpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IFJldmVhbCBhY3RpdmUgdGFiIGluIFRyZWUgVmlldydcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBhbHBoYWJldGl6ZVJvb3RzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgU29ydCBwcm9qZWN0cyBhbHBoYWJldGljYWxseSBpbiBUcmVlIFZpZXcnXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgbXVsdGlSb290OlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB0aXRsZTogJ0tlZXAgbXVsdGlwbGUgcHJvamVjdCByb290cyBpbiB0aGUgVHJlZSBWaWV3LidcbiAgICAgIGRlc2NyaXB0aW9uOiAnRGlzYWJsZSB0aGlzIGlmIHlvdSBsaWtlIHRoZSBvbGQgYmVoYXZpb3Igb2Ygb25seSBrZWVwaW5nIGEgc2luZ2xlIHJvb3QgZGlyZWN0b3J5LidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgYWN0aXZhdGU6IC0+XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1wcm9qZWN0cy5maW5kQnlMaXN0JywgKGZpbmRCeUxpc3QpID0+XG4gICAgICBAZmluZEJ5TGlzdCA9IFwiI3tmaW5kQnlMaXN0fVwiLnNwbGl0ICd8J1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuYXV0b1JldmVhbCcsIChAYXV0b1JldmVhbCkgPT5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXByb2plY3RzLm11bHRpUm9vdCcsIChAbXVsdGlSb290KSA9PlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuYWxwaGFiZXRpemVSb290cycsIChAYWxwaGFiZXRpemVSb290cykgPT5cbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZSAocGFuZSkgPT5cbiAgICAgIHBhbmUub2JzZXJ2ZUFjdGl2ZUl0ZW0gKGl0ZW0pID0+XG4gICAgICAgIGNvID0+XG4gICAgICAgICAgaWYgaXRlbT8uZ2V0UGF0aFxuICAgICAgICAgICAgZGlyZWN0b3J5ID0geWllbGQgQGZpbmRQcm9qZWN0Um9vdCBpdGVtLmdldFBhdGgoKVxuICAgICAgICAgICAgaWYgZGlyZWN0b3J5XG4gICAgICAgICAgICAgIGRpcmVjdG9yeSA9IHBhdGgucmVzb2x2ZSBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgaWYgZGlyZWN0b3J5IGlzbnQgcGF0aC5yZXNvbHZlIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gICAgICAgICAgICAgICAgc2V0UGF0aHMgaWYgQG11bHRpUm9vdFxuICAgICAgICAgICAgICAgICAgICByb290cyA9IHVuaXF1ZVN0cmluZ0FycmF5IFtkaXJlY3RvcnldLmNvbmNhdCh5aWVsZCBnZXRSZWFsUGF0aHMoKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgQGFscGhhYmV0aXplUm9vdHNcbiAgICAgICAgICAgICAgICAgICAgICByb290cy5zb3J0IGFscGhhYmV0aXplUGF0aHNcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgIHJvb3RzXG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIFtkaXJlY3RvcnldXG4gICAgICAgICAgICBpZiBAYXV0b1JldmVhbFxuICAgICAgICAgICAgICB0cmVlVmlldyA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3Jyk/Lm1haW5Nb2R1bGU/LnRyZWVWaWV3XG4gICAgICAgICAgICAgIHRyZWVWaWV3Py5yZXZlYWxBY3RpdmVGaWxlPygpXG4gICAgICAgICAgICAgIHRyZWVWaWV3Py51bmZvY3VzPygpXG4gIGZpbmRQcm9qZWN0Um9vdDogKGRpcmVjdG9yeSkgLT5cbiAgICBjbyA9PlxuICAgICAgZGlyZWN0b3J5ID0gXCIje2RpcmVjdG9yeX1cIi5yZXBsYWNlIC9bXlxcXFxcXC9dKltcXFxcXFwvXSokLywgJydcbiAgICAgIGlmIGRpcmVjdG9yeVxuICAgICAgICBpZiB5aWVsZCBAaXNQcm9qZWN0Um9vdCBkaXJlY3RvcnlcbiAgICAgICAgICBkaXJlY3RvcnlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBmaW5kUHJvamVjdFJvb3QgZGlyZWN0b3J5XG4gICAgICBlbHNlICcnXG4gIGlzUHJvamVjdFJvb3Q6IChkaXJlY3RvcnkpIC0+XG4gICAgY28gPT5cbiAgICAgIGZvciB0eXBlIGluIEBmaW5kQnlMaXN0XG4gICAgICAgIGlmIHlpZWxkIGV4aXN0cyBcIiN7ZGlyZWN0b3J5fS8je3R5cGV9XCJcbiAgICAgICAgICByZXR1cm4geWVzXG4gICAgICBub1xuIl19