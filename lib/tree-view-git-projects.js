var alphabetizePaths, co, exists, fs, path, uniqueStringArray;

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
                  atom.project.setPaths(_this.multiRoot ? (roots = uniqueStringArray([directory].concat(atom.project.getPaths())), _this.alphabetizeRoots ? roots.sort(alphabetizePaths) : roots) : [directory]);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyZWUtdmlldy1naXQtcHJvamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEseURBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxJQUNBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsTUFLQSxHQUFTLFNBQUMsUUFBRCxHQUFBO1NBQ0gsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEdBQUE7V0FDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsU0FBQyxNQUFELEdBQUE7YUFDbEIsT0FBQSxDQUFRLE1BQVIsRUFEa0I7SUFBQSxDQUFwQixFQURVO0VBQUEsQ0FBUixFQURHO0FBQUEsQ0FMVCxDQUFBOztBQUFBLGlCQVVBLEdBQW9CLFNBQUMsV0FBRCxHQUFBO0FBQ2xCLE1BQUEsc0JBQUE7QUFBQSxFQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFDQSxPQUFBLDZDQUFBOzRCQUFBO0FBQ0UsSUFBQSxNQUFPLENBQUEsTUFBQSxDQUFQLEdBQWlCLElBQWpCLENBREY7QUFBQSxHQURBO1NBR0EsTUFBTSxDQUFDLElBQVAsQ0FBWSxNQUFaLEVBSmtCO0FBQUEsQ0FWcEIsQ0FBQTs7QUFBQSxnQkFnQkEsR0FBbUIsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO1NBQ2pCLENBQUEsRUFBQSxHQUFHLENBQUgsQ0FBTSxDQUFDLE9BQVAsQ0FBZSxXQUFmLEVBQTRCLEVBQTVCLENBQStCLENBQUMsV0FBaEMsQ0FBQSxDQUE2QyxDQUFDLGFBQTlDLENBQTRELENBQUEsRUFBQSxHQUFHLENBQUgsQ0FBTSxDQUFDLE9BQVAsQ0FBZSxXQUFmLEVBQTRCLEVBQTVCLENBQStCLENBQUMsV0FBaEMsQ0FBQSxDQUE1RCxFQURpQjtBQUFBLENBaEJuQixDQUFBOztBQUFBLE1BbUJNLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLFVBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxNQUNBLEtBQUEsRUFBTyxtQ0FEUDtBQUFBLE1BRUEsV0FBQSxFQUFhLHNHQUZiO0FBQUEsTUFHQSxTQUFBLEVBQVMsbUJBSFQ7S0FERjtBQUFBLElBS0EsVUFBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsS0FBQSxFQUFPLDhDQURQO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtLQU5GO0FBQUEsSUFTQSxnQkFBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsS0FBQSxFQUFPLHlEQURQO0FBQUEsTUFFQSxTQUFBLEVBQVMsSUFGVDtLQVZGO0FBQUEsSUFhQSxTQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxLQUFBLEVBQU8sK0NBRFA7QUFBQSxNQUVBLFdBQUEsRUFBYSxvRkFGYjtBQUFBLE1BR0EsU0FBQSxFQUFTLElBSFQ7S0FkRjtHQURGO0FBQUEsRUFtQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLElBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1DQUFwQixFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxVQUFELEdBQUE7ZUFDdkQsS0FBQyxDQUFBLFVBQUQsR0FBYyxDQUFBLEVBQUEsR0FBRyxVQUFILENBQWUsQ0FBQyxLQUFoQixDQUFzQixHQUF0QixFQUR5QztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELENBQUEsQ0FBQTtBQUFBLElBRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1DQUFwQixFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxVQUFELEdBQUE7QUFBZSxRQUFkLEtBQUMsQ0FBQSxhQUFELFVBQWMsQ0FBZjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELENBRkEsQ0FBQTtBQUFBLElBR0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGtDQUFwQixFQUF3RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxTQUFELEdBQUE7QUFBYyxRQUFiLEtBQUMsQ0FBQSxZQUFELFNBQWEsQ0FBZDtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhELENBSEEsQ0FBQTtBQUFBLElBSUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHlDQUFwQixFQUErRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxnQkFBRCxHQUFBO0FBQXFCLFFBQXBCLEtBQUMsQ0FBQSxtQkFBRCxnQkFBb0IsQ0FBckI7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvRCxDQUpBLENBQUE7V0FLQSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtlQUMvQixJQUFJLENBQUMsaUJBQUwsQ0FBdUIsU0FBQyxJQUFELEdBQUE7aUJBQ3JCLEVBQUEsQ0FBRyxVQUFBLEdBQUE7QUFDRCxnQkFBQSxxQ0FBQTtBQUFBLFlBQUEsbUJBQUcsSUFBSSxDQUFFLGdCQUFUO0FBQ0UsY0FBQSxTQUFBLEdBQVksT0FBQSxLQUFPLENBQUEsZUFBRCxDQUFpQixJQUFJLENBQUMsT0FBTCxDQUFBLENBQWpCLENBQU4sQ0FBWixDQUFBO0FBQ0EsY0FBQSxJQUFHLFNBQUg7QUFDRSxnQkFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLENBQVosQ0FBQTtBQUNBLGdCQUFBLElBQUcsU0FBQSxLQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXJDLENBQWxCO0FBQ0Usa0JBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXlCLEtBQUMsQ0FBQSxTQUFKLEdBQ2xCLENBQUEsS0FBQSxHQUFRLGlCQUFBLENBQWtCLENBQUMsU0FBRCxDQUFXLENBQUMsTUFBWixDQUFtQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUFuQixDQUFsQixDQUFSLEVBQ0csS0FBQyxDQUFBLGdCQUFKLEdBQ0UsS0FBSyxDQUFDLElBQU4sQ0FBVyxnQkFBWCxDQURGLEdBR0UsS0FKRixDQURrQixHQU9sQixDQUFDLFNBQUQsQ0FQSixDQUFBLENBREY7aUJBRkY7ZUFEQTtBQVlBLGNBQUEsSUFBRyxLQUFDLENBQUEsVUFBSjtBQUNFLGdCQUFBLFFBQUEsdUdBQWtFLENBQUUsMEJBQXBFLENBQUE7OztvQkFDQSxRQUFRLENBQUU7O2lCQURWO21GQUVBLFFBQVEsQ0FBRSw0QkFIWjtlQWJGO2FBREM7VUFBQSxDQUFILEVBRHFCO1FBQUEsQ0FBdkIsRUFEK0I7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQU5RO0VBQUEsQ0FuQlY7QUFBQSxFQTZDQSxlQUFBLEVBQWlCLFNBQUMsU0FBRCxHQUFBO1dBQ2YsRUFBQSxDQUFHLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxVQUFBLEdBQUE7QUFDRCxRQUFBLFNBQUEsR0FBWSxDQUFBLEVBQUEsR0FBRyxTQUFILENBQWMsQ0FBQyxPQUFmLENBQXVCLGtCQUF2QixFQUEyQyxFQUEzQyxDQUFaLENBQUE7QUFDQSxRQUFBLElBQUcsU0FBSDtBQUNFLFVBQUEsSUFBRyxPQUFBLEtBQU8sQ0FBQSxhQUFELENBQWUsU0FBZixDQUFOLENBQUg7bUJBQ0UsVUFERjtXQUFBLE1BQUE7bUJBR0UsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsU0FBakIsRUFIRjtXQURGO1NBQUEsTUFBQTtpQkFLSyxHQUxMO1NBRkM7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFILEVBRGU7RUFBQSxDQTdDakI7QUFBQSxFQXNEQSxhQUFBLEVBQWUsU0FBQyxTQUFELEdBQUE7V0FDYixFQUFBLENBQUcsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFVBQUEsR0FBQTtBQUNELFlBQUEsaUJBQUE7QUFBQTtBQUFBLGFBQUEscUNBQUE7d0JBQUE7QUFDRSxVQUFBLElBQUcsT0FBQSxNQUFNLENBQVUsU0FBRCxHQUFXLEdBQVgsR0FBYyxJQUF2QixDQUFOLENBQUg7QUFDRSxtQkFBTyxJQUFQLENBREY7V0FERjtBQUFBLFNBQUE7ZUFHQSxNQUpDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSCxFQURhO0VBQUEsQ0F0RGY7Q0FwQkYsQ0FBQSIsImZpbGUiOiJ0cmVlLXZpZXctZ2l0LXByb2plY3RzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcclxucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXHJcblxyXG5jbyA9IHJlcXVpcmUgJ2NvJ1xyXG5cclxuZXhpc3RzID0gKGZpbGVwYXRoKSAtPlxyXG4gIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxyXG4gICAgZnMuZXhpc3RzIGZpbGVwYXRoLCAoZXhpc3RzKSAtPlxyXG4gICAgICByZXNvbHZlIGV4aXN0c1xyXG5cclxudW5pcXVlU3RyaW5nQXJyYXkgPSAoc3RyaW5nQXJyYXkpIC0+XHJcbiAgdW5pcXVlID0ge31cclxuICBmb3Igc3RyaW5nIGluIHN0cmluZ0FycmF5XHJcbiAgICB1bmlxdWVbc3RyaW5nXSA9IHllc1xyXG4gIE9iamVjdC5rZXlzIHVuaXF1ZVxyXG5cclxuYWxwaGFiZXRpemVQYXRocyA9IChhLCBiKSAtPlxyXG4gIFwiI3thfVwiLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKS50b0xvd2VyQ2FzZSgpLmxvY2FsZUNvbXBhcmUoXCIje2J9XCIucmVwbGFjZSgvXi4qW1xcXFxcXC9dLywgJycpLnRvTG93ZXJDYXNlKCkpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgY29uZmlnOlxyXG4gICAgZmluZEJ5TGlzdDpcclxuICAgICAgdHlwZTogJ3N0cmluZydcclxuICAgICAgdGl0bGU6ICdGaW5kIHByb2plY3Qgcm9vdCBkaXJlY3RvcmllcyBieTonXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGlzdCBvZiBmaWxlIHBhdGhzIHNlcGVyYXRlZCBieSBcInxcIiBcXG5UaGUgZXhpc3RhbmNlIG9mIG9uZSBvZiB0aGVzZSBpbmRpY2F0ZXMgdGhlIHJvb3Qgb2YgYSBwcm9qZWN0LidcclxuICAgICAgZGVmYXVsdDogJy5naXR8cGFja2FnZS5qc29uJ1xyXG4gICAgYXV0b1JldmVhbDpcclxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgIHRpdGxlOiAnQXV0b21hdGljYWxseSBSZXZlYWwgYWN0aXZlIHRhYiBpbiBUcmVlIFZpZXcnXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIGFscGhhYmV0aXplUm9vdHM6XHJcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgU29ydCBwcm9qZWN0cyBhbHBoYWJldGljYWxseSBpbiBUcmVlIFZpZXcnXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICAgIG11bHRpUm9vdDpcclxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXHJcbiAgICAgIHRpdGxlOiAnS2VlcCBtdWx0aXBsZSBwcm9qZWN0IHJvb3RzIGluIHRoZSBUcmVlIFZpZXcuJ1xyXG4gICAgICBkZXNjcmlwdGlvbjogJ0Rpc2FibGUgdGhpcyBpZiB5b3UgbGlrZSB0aGUgb2xkIGJlaGF2aW9yIG9mIG9ubHkga2VlcGluZyBhIHNpbmdsZSByb290IGRpcmVjdG9yeS4nXHJcbiAgICAgIGRlZmF1bHQ6IHRydWVcclxuICBhY3RpdmF0ZTogLT5cclxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuZmluZEJ5TGlzdCcsIChmaW5kQnlMaXN0KSA9PlxyXG4gICAgICBAZmluZEJ5TGlzdCA9IFwiI3tmaW5kQnlMaXN0fVwiLnNwbGl0ICd8J1xyXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1wcm9qZWN0cy5hdXRvUmV2ZWFsJywgKEBhdXRvUmV2ZWFsKSA9PlxyXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWdpdC1wcm9qZWN0cy5tdWx0aVJvb3QnLCAoQG11bHRpUm9vdCkgPT5cclxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuYWxwaGFiZXRpemVSb290cycsIChAYWxwaGFiZXRpemVSb290cykgPT5cclxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lIChwYW5lKSA9PlxyXG4gICAgICBwYW5lLm9ic2VydmVBY3RpdmVJdGVtIChpdGVtKSA9PlxyXG4gICAgICAgIGNvID0+XHJcbiAgICAgICAgICBpZiBpdGVtPy5nZXRQYXRoXHJcbiAgICAgICAgICAgIGRpcmVjdG9yeSA9IHlpZWxkIEBmaW5kUHJvamVjdFJvb3QgaXRlbS5nZXRQYXRoKClcclxuICAgICAgICAgICAgaWYgZGlyZWN0b3J5XHJcbiAgICAgICAgICAgICAgZGlyZWN0b3J5ID0gcGF0aC5yZXNvbHZlIGRpcmVjdG9yeVxyXG4gICAgICAgICAgICAgIGlmIGRpcmVjdG9yeSBpc250IHBhdGgucmVzb2x2ZSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxyXG4gICAgICAgICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIGlmIEBtdWx0aVJvb3RcclxuICAgICAgICAgICAgICAgICAgICByb290cyA9IHVuaXF1ZVN0cmluZ0FycmF5IFtkaXJlY3RvcnldLmNvbmNhdCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIEBhbHBoYWJldGl6ZVJvb3RzXHJcbiAgICAgICAgICAgICAgICAgICAgICByb290cy5zb3J0IGFscGhhYmV0aXplUGF0aHNcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICByb290c1xyXG4gICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgW2RpcmVjdG9yeV1cclxuICAgICAgICAgICAgaWYgQGF1dG9SZXZlYWxcclxuICAgICAgICAgICAgICB0cmVlVmlldyA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgndHJlZS12aWV3Jyk/Lm1haW5Nb2R1bGU/LnRyZWVWaWV3XHJcbiAgICAgICAgICAgICAgdHJlZVZpZXc/LnJldmVhbEFjdGl2ZUZpbGU/KClcclxuICAgICAgICAgICAgICB0cmVlVmlldz8udW5mb2N1cz8oKVxyXG4gIGZpbmRQcm9qZWN0Um9vdDogKGRpcmVjdG9yeSkgLT5cclxuICAgIGNvID0+XHJcbiAgICAgIGRpcmVjdG9yeSA9IFwiI3tkaXJlY3Rvcnl9XCIucmVwbGFjZSAvW15cXFxcXFwvXSpbXFxcXFxcL10qJC8sICcnXHJcbiAgICAgIGlmIGRpcmVjdG9yeVxyXG4gICAgICAgIGlmIHlpZWxkIEBpc1Byb2plY3RSb290IGRpcmVjdG9yeVxyXG4gICAgICAgICAgZGlyZWN0b3J5XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgQGZpbmRQcm9qZWN0Um9vdCBkaXJlY3RvcnlcclxuICAgICAgZWxzZSAnJ1xyXG4gIGlzUHJvamVjdFJvb3Q6IChkaXJlY3RvcnkpIC0+XHJcbiAgICBjbyA9PlxyXG4gICAgICBmb3IgdHlwZSBpbiBAZmluZEJ5TGlzdFxyXG4gICAgICAgIGlmIHlpZWxkIGV4aXN0cyBcIiN7ZGlyZWN0b3J5fS8je3R5cGV9XCJcclxuICAgICAgICAgIHJldHVybiB5ZXNcclxuICAgICAgbm9cclxuIl19