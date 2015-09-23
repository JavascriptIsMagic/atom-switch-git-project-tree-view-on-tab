var _, alphabetizePaths, co, exists, fs, getRealPaths, path, realpath, setPaths, uniqueStringArray,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
                if (indexOf.call(_.map(atom.project.getPaths(), function(p) {
                  return path.resolve(p);
                }), directory) < 0) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyZWUtdmlldy1naXQtcHJvamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsOEZBQUE7RUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0FBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztBQUVQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztBQUVKLE1BQUEsR0FBUyxTQUFDLFFBQUQ7U0FDSCxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQ7V0FDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsU0FBQyxNQUFEO2FBQ2xCLE9BQUEsQ0FBUSxNQUFSO0lBRGtCLENBQXBCO0VBRFUsQ0FBUjtBQURHOztBQU1ULFFBQUEsR0FBVyxTQUFDLFFBQUQ7U0FDTCxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWO1dBQ1YsRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLEVBQXNCLFNBQUMsR0FBRCxFQUFNLElBQU47TUFDcEIsSUFBRyxHQUFIO0FBQVksZUFBTyxNQUFBLENBQU8sR0FBUCxFQUFuQjs7YUFDQSxPQUFBLENBQVEsSUFBUjtJQUZvQixDQUF0QjtFQURVLENBQVI7QUFESzs7QUFNWCxpQkFBQSxHQUFvQixTQUFDLFdBQUQ7QUFDbEIsTUFBQTtFQUFBLE1BQUEsR0FBUztBQUNULE9BQUEsNkNBQUE7O0lBQ0UsTUFBTyxDQUFBLE1BQUEsQ0FBUCxHQUFpQjtBQURuQjtTQUVBLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWjtBQUprQjs7QUFNcEIsWUFBQSxHQUFlLFNBQUE7U0FBRyxFQUFBLENBQUcsVUFBQTtBQUNuQixRQUFBO0FBQUE7QUFBQTtTQUFBLHFDQUFBOzttQkFBQSxhQUFhLENBQUMsUUFBZCxJQUEwQixDQUFDLE9BQU0sUUFBQSxDQUFTLGFBQWEsQ0FBQyxJQUF2QixDQUFOLENBQUQ7QUFBMUI7O0VBRG1CLENB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U0FBQSxLQUFBO2FBQUEsVUFBQTtBQUNELFlBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7O1VBQ0UsSUFBRyxPQUFNLE1BQUEsQ0FBVSxTQUFELEdBQVcsR0FBWCxHQUFjLElBQXZCLENBQU4sQ0FBSDtBQUNFLG1CQUFPLEtBRFQ7O0FBREY7ZUFHQTtNQUpDO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFIO0VBRGEsQ0F0RGYiLCJmaWxlIjoidHJlZS12aWV3LWdpdC1wcm9qZWN0cy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuY28gPSByZXF1aXJlICdjbydcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbmV4aXN0cyA9IChmaWxlcGF0aCkgLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUpIC0+XG4gICAgZnMuZXhpc3RzIGZpbGVwYXRoLCAoZXhpc3RzKSAtPlxuICAgICAgcmVzb2x2ZSBleGlzdHNcblxuIyBUT0RPOiB1c2UgY2FjaGUgcGFyYW1ldGVyXG5yZWFscGF0aCA9IChmaWxlcGF0aCkgLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICBmcy5yZWFscGF0aCBmaWxlcGF0aCwgKGVyciwgcmVhbCkgLT5cbiAgICAgIGlmIGVyciB0aGVuIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgcmVzb2x2ZSByZWFsXG5cbnVuaXF1ZVN0cmluZ0FycmF5ID0gKHN0cmluZ0FycmF5KSAtPlxuICB1bmlxdWUgPSB7fVxuICBmb3Igc3RyaW5nIGluIHN0cmluZ0FycmF5XG4gICAgdW5pcXVlW3N0cmluZ10gPSB5ZXNcbiAgT2JqZWN0LmtleXMgdW5pcXVlXG5cbmdldFJlYWxQYXRocyA9IC0+IGNvIC0+XG4gIHJvb3REaXJlY3RvcnkucmVhbFBhdGggb3IgKHlpZWxkIHJlYWxwYXRoKHJvb3REaXJlY3RvcnkucGF0aCkpIGZvciByb290RGlyZWN0b3J5IGluIGF0b20ucHJvamVjdC5yb290RGlyZWN0b3JpZXNcblxuYWxwaGFiZXRpemVQYXRocyA9IChhLCBiKSAtPlxuICBcIiN7YX1cIi5yZXBsYWNlKC9eLipbXFxcXFxcL10vLCAnJykudG9Mb3dlckNhc2UoKS5sb2NhbGVDb21wYXJlKFwiI3tifVwiLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKS50b0xvd2VyQ2FzZSgpKVxuXG5zZXRQYXRocyA9IChuZXdQYXRocykgLT5cbiAgb2xkUGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuICB1bmxlc3MgXy5pc0VxdWFsIG5ld1BhdGhzLCBvbGRQYXRoc1xuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhuZXdQYXRocylcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgZmluZEJ5TGlzdDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB0aXRsZTogJ0ZpbmQgcHJvamVjdCByb290IGRpcmVjdG9yaWVzIGJ5OidcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGlzdCBvZiBmaWxlIHBhdGhzIHNlcGVyYXRlZCBieSBcInxcIiBcXG5UaGUgZXhpc3RhbmNlIG9mIG9uZSBvZiB0aGVzZSBpbmRpY2F0ZXMgdGhlIHJvb3Qgb2YgYSBwcm9qZWN0LidcbiAgICAgIGRlZmF1bHQ6ICcuZ2l0fHBhY2thZ2UuanNvbidcbiAgICBhdXRvUmV2ZWFsOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgUmV2ZWFsIGFjdGl2ZSB0YWIgaW4gVHJlZSBWaWV3J1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGFscGhhYmV0aXplUm9vdHM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIHRpdGxlOiAnQXV0b21hdGljYWxseSBTb3J0IHByb2plY3RzIGFscGhhYmV0aWNhbGx5IGluIFRyZWUgVmlldydcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBtdWx0aVJvb3Q6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIHRpdGxlOiAnS2VlcCBtdWx0aXBsZSBwcm9qZWN0IHJvb3RzIGluIHRoZSBUcmVlIFZpZXcuJ1xuICAgICAgZGVzY3JpcHRpb246ICdEaXNhYmxlIHRoaXMgaWYgeW91IGxpa2UgdGhlIG9sZCBiZWhhdmlvciBvZiBvbmx5IGtlZXBpbmcgYSBzaW5nbGUgcm9vdCBkaXJlY3RvcnkuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICBhY3RpdmF0ZTogLT5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXByb2plY3RzLmZpbmRCeUxpc3QnLCAoZmluZEJ5TGlzdCkgPT5cbiAgICAgIEBmaW5kQnlMaXN0ID0gXCIje2ZpbmRCeUxpc3R9XCIuc3BsaXQgJ3wnXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1wcm9qZWN0cy5hdXRvUmV2ZWFsJywgKEBhdXRvUmV2ZWFsKSA9PlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMubXVsdGlSb290JywgKEBtdWx0aVJvb3QpID0+XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1wcm9qZWN0cy5hbHBoYWJldGl6ZVJvb3RzJywgKEBhbHBoYWJldGl6ZVJvb3RzKSA9PlxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lIChwYW5lKSA9PlxuICAgICAgcGFuZS5vYnNlcnZlQWN0aXZlSXRlbSAoaXRlbSkgPT5cbiAgICAgICAgY28gPT5cbiAgICAgICAgICBpZiBpdGVtPy5nZXRQYXRoXG4gICAgICAgICAgICBkaXJlY3RvcnkgPSB5aWVsZCBAZmluZFByb2plY3RSb290IGl0ZW0uZ2V0UGF0aCgpXG4gICAgICAgICAgICBpZiBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgZGlyZWN0b3J5ID0gcGF0aC5yZXNvbHZlIGRpcmVjdG9yeVxuICAgICAgICAgICAgICB1bmxlc3MgZGlyZWN0b3J5IGluIF8ubWFwKGF0b20ucHJvamVjdC5nZXRQYXRocygpLCAocCkgLT4gcGF0aC5yZXNvbHZlIHApXG4gICAgICAgICAgICAgICAgc2V0UGF0aHMgaWYgQG11bHRpUm9vdFxuICAgICAgICAgICAgICAgICAgICByb290cyA9IHVuaXF1ZVN0cmluZ0FycmF5IFtkaXJlY3RvcnldLmNvbmNhdCh5aWVsZCBnZXRSZWFsUGF0aHMoKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgQGFscGhhYmV0aXplUm9vdHNcbiAgICAgICAgICAgICAgICAgICAgICByb290cy5zb3J0IGFscGhhYmV0aXplUGF0aHNcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgIHJvb3RzXG4gICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIFtkaXJlY3RvcnldXG4gICAgICAgICAgICBpZiBAYXV0b1JldmVhbFxuICAgICAgICAgICAgICB0cmVlVmlldyA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3Jyk/Lm1haW5Nb2R1bGU/LnRyZWVWaWV3XG4gICAgICAgICAgICAgIHRyZWVWaWV3Py5yZXZlYWxBY3RpdmVGaWxlPygpXG4gICAgICAgICAgICAgIHRyZWVWaWV3Py51bmZvY3VzPygpXG4gIGZpbmRQcm9qZWN0Um9vdDogKGRpcmVjdG9yeSkgLT5cbiAgICBjbyA9PlxuICAgICAgZGlyZWN0b3J5ID0gXCIje2RpcmVjdG9yeX1cIi5yZXBsYWNlIC9bXlxcXFxcXC9dKltcXFxcXFwvXSokLywgJydcbiAgICAgIGlmIGRpcmVjdG9yeVxuICAgICAgICBpZiB5aWVsZCBAaXNQcm9qZWN0Um9vdCBkaXJlY3RvcnlcbiAgICAgICAgICBkaXJlY3RvcnlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBmaW5kUHJvamVjdFJvb3QgZGlyZWN0b3J5XG4gICAgICBlbHNlICcnXG4gIGlzUHJvamVjdFJvb3Q6IChkaXJlY3RvcnkpIC0+XG4gICAgY28gPT5cbiAgICAgIGZvciB0eXBlIGluIEBmaW5kQnlMaXN0XG4gICAgICAgIGlmIHlpZWxkIGV4aXN0cyBcIiN7ZGlyZWN0b3J5fS8je3R5cGV9XCJcbiAgICAgICAgICByZXR1cm4geWVzXG4gICAgICBub1xuIl19