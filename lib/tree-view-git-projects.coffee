fs = require 'fs'
path = require 'path'

co = require 'co'

exists = (filepath) ->
  new Promise (resolve) ->
    fs.exists filepath, (exists) ->
      resolve exists

# TODO: use cache parameter
realpath = (filepath) ->
  new Promise (resolve, reject) ->
    fs.realpath filepath, (err, real) ->
      if err then return reject(err)
      resolve real

uniqueStringArray = (stringArray) ->
  unique = {}
  for string in stringArray
    unique[string] = yes
  Object.keys unique

getRealPaths = -> co ->
  rootDirectory.realPath or (yield realpath(rootDirectory.path)) for rootDirectory in atom.project.rootDirectories

alphabetizePaths = (a, b) ->
  "#{a}".replace(/^.*[\\\/]/, '').toLowerCase().localeCompare("#{b}".replace(/^.*[\\\/]/, '').toLowerCase())

module.exports =
  config:
    findByList:
      type: 'string'
      title: 'Find project root directories by:'
      description: 'List of file paths seperated by "|" \nThe existance of one of these indicates the root of a project.'
      default: '.git|package.json'
    autoReveal:
      type: 'boolean'
      title: 'Automatically Reveal active tab in Tree View'
      default: true
    alphabetizeRoots:
      type: 'boolean'
      title: 'Automatically Sort projects alphabetically in Tree View'
      default: true
    multiRoot:
      type: 'boolean'
      title: 'Keep multiple project roots in the Tree View.'
      description: 'Disable this if you like the old behavior of only keeping a single root directory.'
      default: true
  activate: ->
    atom.config.observe 'tree-view-git-projects.findByList', (findByList) =>
      @findByList = "#{findByList}".split '|'
    atom.config.observe 'tree-view-git-projects.autoReveal', (@autoReveal) =>
    atom.config.observe 'tree-view-git-projects.multiRoot', (@multiRoot) =>
    atom.config.observe 'tree-view-git-projects.alphabetizeRoots', (@alphabetizeRoots) =>
    atom.workspace.observeActivePane (pane) =>
      pane.observeActiveItem (item) =>
        co =>
          if item?.getPath
            directory = yield @findProjectRoot item.getPath()
            if directory
              directory = path.resolve directory
              if directory isnt path.resolve atom.project.getPaths()[0]
                atom.project.setPaths if @multiRoot
                    roots = uniqueStringArray [directory].concat(yield getRealPaths())
                    if @alphabetizeRoots
                      roots.sort alphabetizePaths
                    else
                      roots
                  else
                    [directory]
            if @autoReveal
              treeView = atom.packages.getActivePackage('tree-view')?.mainModule?.treeView
              treeView?.revealActiveFile?()
              treeView?.unfocus?()
  findProjectRoot: (directory) ->
    co =>
      directory = "#{directory}".replace /[^\\\/]*[\\\/]*$/, ''
      if directory
        if yield @isProjectRoot directory
          directory
        else
          @findProjectRoot directory
      else ''
  isProjectRoot: (directory) ->
    co =>
      for type in @findByList
        if yield exists "#{directory}/#{type}"
          return yes
      no
