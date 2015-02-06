fs = require 'fs'
path = require 'path'

module.exports =
  config:
    findByList:
      type: 'string'
      title: "Find project root directories by:"
      description: 'List of file paths seperated by "|" \nThe existance of one of these indicates the root of a project.'
      default: '.git|package.json'
  activate: ->
    atom.config.observe 'tree-view-git-projects.findByList', (findByList) =>
      @findByList = "#{findByList}".split '|'
    atom.workspace.observeActivePane (pane) =>
      pane.observeActiveItem (item) =>
        if item?.getPath
          @findProjectRoot item.getPath?(), (directory) =>
            if directory and directory isnt atom.project.getPaths()[0]
              atom.project.setPaths [directory]
            atom.packages.getActivePackage('tree-view')?.mainModule?.treeView?.revealActiveFile?()
  findProjectRoot: (directory, callback) ->
    directory = path.resolve "#{directory}".replace /[^\\\/]*[\\\/]*$/, ''
    if directory
      @isProjectRoot directory, (isRoot) =>
        if isRoot
          callback directory
        else
          @findProjectRoot directory, callback
  isProjectRoot: (directory, callback) ->
    completed = 0
    done = no
    length = @findByList.length
    for type in @findByList
      fs.exists directory + '/' + type, (exists) =>
        unless done
          completed += 1
          if exists
            done = yes
            callback yes
          else if completed is length
            done = yes
            callback no
