const directories = ['images', 'js', 'scss', 'template']
const files = ['scss/style.scss', 'template/index.php']
const fs = require('fs')
const sourceDir = 'src'

function createCss () {
  let package = readPackage()
  let content = `/*!
  Theme Name: ${package.name}
  Theme URI: ${package.url}
  Description: ${package.description}
  Version: ${package.version}
  Author: ${package.author}
  Author URI: ${package.authorUrl}

  License: ${package.license}
*/
  `
  return content
}

function readPackage () {
  return JSON.parse(fs.readFileSync('./package.json'))  
}

function createDirectories () {
  directories.forEach((dir) => {
    if (!fs.existsSync(sourceDir + '/' + dir)) {
      fs.mkdirSync(sourceDir + '/' + dir)
      console.log('Created directory ' + dir)
    } else {
      console.log('Directory ' + dir + ' exists. Skipping.')
    }
  })
}

function createRequiredFiles () {
  files.forEach((file) => {
    if (!fs.exists(sourceDir + '/' + file)) {
      if (file.slice(-4) === 'scss') {
        fs.writeFileSync(sourceDir + '/' + file, createCss(), 'utf8')
        console.log('Created Stylesheet')
      } else {
        fs.writeFileSync(sourceDir + '/' + file, '<?php', 'utf8')
        console.log('Created Index.php')
      }
    } else {
      console.log('File ' + file + ' exists. Skipping.')
    }
  })
}

createDirectories()
// createRequiredFiles()
