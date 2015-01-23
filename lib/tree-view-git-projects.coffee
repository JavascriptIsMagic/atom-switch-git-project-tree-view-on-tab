fs = require 'fs'
module.exports =
  activate: (state) ->
    atom.workspace.observePanes (pane) =>
      pane.observeActiveItem (item) =>
        if item?.getPath
          @gitPath '' + item.getPath?(), (path) =>
            console.log 'PATH FOUND: ', path
  gitPath: (path, callback) ->
    path = path.replace /[^\\\/]*[\\\/]?$/i, ''
    unless path.length
      callback ''
    else
      fs.exists path + '.git', (exists) =>
        unless exists
          @gitPath path, callback
        else
          callback path
