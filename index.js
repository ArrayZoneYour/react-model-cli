#!/usr/bin/env node
// @ts-ignore
const clear = require('clear')
const figlet = require('figlet')
const touch = require('touch')
const util = require('util')
const exec = require('child_process').exec
const {
  directoryExists,
  getCurrentDirectoryBase,
  fileExist
} = require('./util')
const chalk = require('chalk')
const { mkdir, writeFile, readdir, readdirSync } = require('fs')
const { compile } = require('handlebars')
const { indexTemplate, modelTemplate } = require('./template')
;(async () => {
  clear()
  // Print the logo
  console.log(
    chalk.yellow(
      figlet.textSync('react-model-cli', { horizontalLayout: 'full' })
    )
  )
  // Validate the command
  if (process.argv.length < 3) {
    console.log(chalk.red('bad input.'))
    process.exit()
  }
  if (['init', 'generate', 'g'].indexOf(process.argv[2]) === -1) {
    console.log(
      chalk.red('react-model-cli only support g, generate, init options')
    )
  }
  // Get the command line arguments
  const modelNames = process.argv.slice(3)

  // whether react-model is installed.
  try {
    const model = require('react-model')
  } catch (e) {
    const sh = util.promisify(exec)
    sh('npm install --save react-model')
  }

  // Create the models/ folder
  if (directoryExists('models')) {
    console.log(chalk.red('models repository exist...'))
  } else {
    mkdir('models', err => {
      err &&
        console.log(chalk.red(`Create models' folder failed: ${err.message}`))
    })
  }

  const option = process.argv[2]
  const paths = [...modelNames, 'index'].map(name => name + '.ts')
  let completeCount = 0
  const data =
    option === 'init'
      ? { models: [...modelNames].map(name => ({ name })) }
      : {
          models: [...readdirSync(`models/`), ...paths]
            .filter(file => !file.endsWith('index.ts'))
            .map(file => ({ name: file.split('.ts')[0] }))
        }
  paths.forEach(path => {
    if (!fileExist(`${getCurrentDirectoryBase()}/${path}`)) {
      console.log(`create ${path}`)
      touch(`models/${path}`)
      if (path === 'index.ts') {
        const template = compile(indexTemplate)
        const result = template(data)
        writeFile(`models/index.ts`, result, err => {
          err && console.log(chalk.red(`write ${path} failed: ${err.message}`))
          completeCount += 1
        })
      } else {
        writeFile(`models/${path}`, modelTemplate, err => {
          err && console.log(chalk.red(`write ${path} failed: ${err.message}`))
          completeCount += 1
        })
      }
    } else {
      console.log(`${path} already exist, skip`)
      completeCount += 1
    }
  })
  while (completeCount < paths.length) {
    await new Promise(resolve => setTimeout(() => resolve(), 300))
  }
  console.log(chalk.green(`Finish!`))
  process.exit()
})()
