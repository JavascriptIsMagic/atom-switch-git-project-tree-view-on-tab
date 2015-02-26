# This cakefile should not be nessasary when atom.io updates to coffee-script 1.9+ for the yield keyword and generator support.
require 'cake-gulp'

option '-w', '--watch', 'Watch for file changes and auto-build.'

task 'build:coffee', 'Handles *.coffee files.', ->
  src "#{__dirname}/lib/**/*.coffee"
    .pipe debug title: 'coffee'
    .pipe sourcemaps.init()
    .pipe coffee(bare: yes).on 'error', log
    .pipe sourcemaps.write()
    .pipe dest "#{__dirname}/lib"

task 'build', 'Build *.coffee files using coffee-script 1.9+ to *.js', ['build:coffee'], (options) ->
  if options.watch then watch "#{__dirname}/lib/**/*.coffee", ['build:coffee']
