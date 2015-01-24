fs = require 'fs'
path = require 'path'

module.exports =
  activate: ->
    atom.workspace.observePanes (pane) =>
      pane.observeActiveItem (item) =>
        if item?.getPath
          @gitDirectory '' + item.getPath?(), (directory) =>
            if directory and directory isnt atom.project.getPaths()[0]
              atom.project.setPaths [directory]
            atom.packages.getActivePackage('tree-view')?.mainModule?.treeView?.revealActiveFile?()
  gitDirectory: (directory, callback) ->
    directory = directory.replace /[^\\\/]*[\\\/]?$/i, ''
    if directory
      fs.exists directory + '.git', (exists) =>
        if exists
          callback path.resolve directory
        else
          @gitDirectory directory, callback
    else
      callback ''
