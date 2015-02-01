fs = require 'fs'
path = require 'path'

module.exports =
  activate: ->
    atom.workspace.observeActivePane (pane) =>
      pane.observeActiveItem (item) =>
        if item?.getPath
          @gitDirectory '' + item.getPath?(), (directory) =>
            if directory and directory isnt atom.project.getPaths()[0]
              atom.project.setPaths [directory]
            atom.packages.getActivePackage('tree-view')?.mainModule?.treeView?.revealActiveFile?()
    atom.commands.add 'atom-workspace', 'tree-view-git-projects:upper-directory', => @upperDirectory()
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
  upperDirectory: ->
    up = path.dirname atom.project.getPaths()[0]
    atom.project.setPaths [up]
