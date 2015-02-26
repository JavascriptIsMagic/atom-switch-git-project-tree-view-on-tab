var co, exists, fs, path;

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
          return co(function*() {
            var directory, ref, ref1, treeView;
            if (item != null ? item.getPath : void 0) {
              directory = (yield _this.findProjectRoot(item.getPath()));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRyZWUtdmlldy1naXQtcHJvamVjdHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsb0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxJQUNBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsR0FBSyxPQUFBLENBQVEsSUFBUixDQUhMLENBQUE7O0FBQUEsTUFLQSxHQUFTLFNBQUMsUUFBRCxHQUFBO1NBQ0gsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEdBQUE7V0FDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsU0FBQyxNQUFELEdBQUE7YUFDbEIsT0FBQSxDQUFRLE1BQVIsRUFEa0I7SUFBQSxDQUFwQixFQURVO0VBQUEsQ0FBUixFQURHO0FBQUEsQ0FMVCxDQUFBOztBQUFBLE1BVU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLE1BQUEsRUFDRTtBQUFBLElBQUEsVUFBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLE1BQ0EsS0FBQSxFQUFPLG1DQURQO0FBQUEsTUFFQSxXQUFBLEVBQWEsc0dBRmI7QUFBQSxNQUdBLFNBQUEsRUFBUyxtQkFIVDtLQURGO0FBQUEsSUFLQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxLQUFBLEVBQU8sOENBRFA7QUFBQSxNQUVBLFNBQUEsRUFBUyxJQUZUO0tBTkY7R0FERjtBQUFBLEVBVUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLElBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1DQUFwQixFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxVQUFELEdBQUE7ZUFDdkQsS0FBQyxDQUFBLFVBQUQsR0FBYyxDQUFBLEVBQUEsR0FBRyxVQUFILENBQWUsQ0FBQyxLQUFoQixDQUFzQixHQUF0QixFQUR5QztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELENBQUEsQ0FBQTtBQUFBLElBRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1DQUFwQixFQUF5RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxVQUFELEdBQUE7ZUFDdkQsS0FBQyxDQUFBLFVBQUQsR0FBYyxXQUR5QztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpELENBRkEsQ0FBQTtXQUlBLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBaUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsSUFBRCxHQUFBO2VBQy9CLElBQUksQ0FBQyxpQkFBTCxDQUF1QixTQUFDLElBQUQsR0FBQTtpQkFDckIsRUFBQSxDQUFHLFVBQUEsR0FBQTtBQUNELGdCQUFBLDhCQUFBO0FBQUEsWUFBQSxtQkFBRyxJQUFJLENBQUUsZ0JBQVQ7QUFDRSxjQUFBLFNBQUEsR0FBWSxPQUFBLEtBQU8sQ0FBQSxlQUFELENBQWlCLElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBakIsQ0FBTixDQUFaLENBQUE7QUFDQSxjQUFBLElBQUcsU0FBSDtBQUNFLGdCQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsQ0FBWixDQUFBO0FBQ0EsZ0JBQUEsSUFBRyxTQUFBLEtBQWUsSUFBSSxDQUFDLE9BQUwsQ0FBYSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBckMsQ0FBbEI7QUFDRSxrQkFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxTQUFELENBQXRCLENBQUEsQ0FERjtpQkFGRjtlQURBO0FBS0EsY0FBQSxJQUFHLEtBQUMsQ0FBQSxVQUFKO0FBQ0UsZ0JBQUEsUUFBQSx1R0FBa0UsQ0FBRSwwQkFBcEUsQ0FBQTs7O29CQUNBLFFBQVEsQ0FBRTs7aUJBRFY7bUZBRUEsUUFBUSxDQUFFLDRCQUhaO2VBTkY7YUFEQztVQUFBLENBQUgsRUFEcUI7UUFBQSxDQUF2QixFQUQrQjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDLEVBTFE7RUFBQSxDQVZWO0FBQUEsRUE0QkEsZUFBQSxFQUFpQixTQUFDLFNBQUQsR0FBQTtXQUNmLEVBQUEsQ0FBRyxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsVUFBQSxHQUFBO0FBQ0QsUUFBQSxTQUFBLEdBQVksQ0FBQSxFQUFBLEdBQUcsU0FBSCxDQUFjLENBQUMsT0FBZixDQUF1QixrQkFBdkIsRUFBMkMsRUFBM0MsQ0FBWixDQUFBO0FBQ0EsUUFBQSxJQUFHLFNBQUg7QUFDRSxVQUFBLElBQUcsT0FBQSxLQUFPLENBQUEsYUFBRCxDQUFlLFNBQWYsQ0FBTixDQUFIO21CQUNFLFVBREY7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxlQUFELENBQWlCLFNBQWpCLEVBSEY7V0FERjtTQUFBLE1BQUE7aUJBS0ssR0FMTDtTQUZDO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSCxFQURlO0VBQUEsQ0E1QmpCO0FBQUEsRUFxQ0EsYUFBQSxFQUFlLFNBQUMsU0FBRCxHQUFBO1dBQ2IsRUFBQSxDQUFHLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxVQUFBLEdBQUE7QUFDRCxZQUFBLGlCQUFBO0FBQUE7QUFBQSxhQUFBLHFDQUFBO3dCQUFBO0FBQ0UsVUFBQSxJQUFHLE9BQUEsTUFBTSxDQUFVLFNBQUQsR0FBVyxHQUFYLEdBQWMsSUFBdkIsQ0FBTixDQUFIO0FBQ0UsbUJBQU8sSUFBUCxDQURGO1dBREY7QUFBQSxTQUFBO2VBR0EsTUFKQztNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUgsRUFEYTtFQUFBLENBckNmO0NBWEYsQ0FBQSIsImZpbGUiOiJ0cmVlLXZpZXctZ2l0LXByb2plY3RzLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcclxucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXHJcblxyXG5jbyA9IHJlcXVpcmUgJ2NvJ1xyXG5cclxuZXhpc3RzID0gKGZpbGVwYXRoKSAtPlxyXG4gIG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxyXG4gICAgZnMuZXhpc3RzIGZpbGVwYXRoLCAoZXhpc3RzKSAtPlxyXG4gICAgICByZXNvbHZlIGV4aXN0c1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG4gIGNvbmZpZzpcclxuICAgIGZpbmRCeUxpc3Q6XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgIHRpdGxlOiAnRmluZCBwcm9qZWN0IHJvb3QgZGlyZWN0b3JpZXMgYnk6J1xyXG4gICAgICBkZXNjcmlwdGlvbjogJ0xpc3Qgb2YgZmlsZSBwYXRocyBzZXBlcmF0ZWQgYnkgXCJ8XCIgXFxuVGhlIGV4aXN0YW5jZSBvZiBvbmUgb2YgdGhlc2UgaW5kaWNhdGVzIHRoZSByb290IG9mIGEgcHJvamVjdC4nXHJcbiAgICAgIGRlZmF1bHQ6ICcuZ2l0fHBhY2thZ2UuanNvbidcclxuICAgIGF1dG9SZXZlYWw6XHJcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xyXG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgUmV2ZWFsIGFjdGl2ZSB0YWIgaW4gVHJlZSBWaWV3J1xyXG4gICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgYWN0aXZhdGU6IC0+XHJcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctZ2l0LXByb2plY3RzLmZpbmRCeUxpc3QnLCAoZmluZEJ5TGlzdCkgPT5cclxuICAgICAgQGZpbmRCeUxpc3QgPSBcIiN7ZmluZEJ5TGlzdH1cIi5zcGxpdCAnfCdcclxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1naXQtcHJvamVjdHMuYXV0b1JldmVhbCcsIChhdXRvUmV2ZWFsKSA9PlxyXG4gICAgICBAYXV0b1JldmVhbCA9IGF1dG9SZXZlYWxcclxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lIChwYW5lKSA9PlxyXG4gICAgICBwYW5lLm9ic2VydmVBY3RpdmVJdGVtIChpdGVtKSA9PlxyXG4gICAgICAgIGNvID0+XHJcbiAgICAgICAgICBpZiBpdGVtPy5nZXRQYXRoXHJcbiAgICAgICAgICAgIGRpcmVjdG9yeSA9IHlpZWxkIEBmaW5kUHJvamVjdFJvb3QgaXRlbS5nZXRQYXRoKClcclxuICAgICAgICAgICAgaWYgZGlyZWN0b3J5XHJcbiAgICAgICAgICAgICAgZGlyZWN0b3J5ID0gcGF0aC5yZXNvbHZlIGRpcmVjdG9yeVxyXG4gICAgICAgICAgICAgIGlmIGRpcmVjdG9yeSBpc250IHBhdGgucmVzb2x2ZSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXVxyXG4gICAgICAgICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtkaXJlY3RvcnldXHJcbiAgICAgICAgICAgIGlmIEBhdXRvUmV2ZWFsXHJcbiAgICAgICAgICAgICAgdHJlZVZpZXcgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ3RyZWUtdmlldycpPy5tYWluTW9kdWxlPy50cmVlVmlld1xyXG4gICAgICAgICAgICAgIHRyZWVWaWV3Py5yZXZlYWxBY3RpdmVGaWxlPygpXHJcbiAgICAgICAgICAgICAgdHJlZVZpZXc/LnVuZm9jdXM/KClcclxuICBmaW5kUHJvamVjdFJvb3Q6IChkaXJlY3RvcnkpIC0+XHJcbiAgICBjbyA9PlxyXG4gICAgICBkaXJlY3RvcnkgPSBcIiN7ZGlyZWN0b3J5fVwiLnJlcGxhY2UgL1teXFxcXFxcL10qW1xcXFxcXC9dKiQvLCAnJ1xyXG4gICAgICBpZiBkaXJlY3RvcnlcclxuICAgICAgICBpZiB5aWVsZCBAaXNQcm9qZWN0Um9vdCBkaXJlY3RvcnlcclxuICAgICAgICAgIGRpcmVjdG9yeVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIEBmaW5kUHJvamVjdFJvb3QgZGlyZWN0b3J5XHJcbiAgICAgIGVsc2UgJydcclxuICBpc1Byb2plY3RSb290OiAoZGlyZWN0b3J5KSAtPlxyXG4gICAgY28gPT5cclxuICAgICAgZm9yIHR5cGUgaW4gQGZpbmRCeUxpc3RcclxuICAgICAgICBpZiB5aWVsZCBleGlzdHMgXCIje2RpcmVjdG9yeX0vI3t0eXBlfVwiXHJcbiAgICAgICAgICByZXR1cm4geWVzXHJcbiAgICAgIG5vXHJcbiJdfQ==