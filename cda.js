#!/usr/bin/env node
let chalk = require('chalk');
let sh = require('shelljs');
let { basename, resolve } = require('path');
let { execSync } = require('child_process');

let args = process.argv.slice(2);

if (args.length !== 1) {
  console.error(`${chalk.red('ERROR')}: Wrong number of arguments.`);
  console.log(`Usage: npm init dominant-app ${chalk.magenta('your-app-name')}`);
  console.log('');

  process.exit(-1);
}

let targetPath = args[0];
let fullPath = resolve(__dirname, targetPath);
let pkgName = basename(targetPath);

sh.set('-e');

console.log('');
console.log(`Creating a new Dominant app in ${chalk.green(fullPath)}.`);

if (sh.test('-e', targetPath)) {
  console.error(`${chalk.red('ERROR')}: Directory exists.`);
  console.error('');
  process.exit(-1);
}

console.log('');

sh.cp('-r', `${__dirname}/template`, targetPath);
sh.cd(targetPath);

for (let path of ['README.md', 'package.json', 'public/index.html']) {
  sh.sed('-i', 'PKG_NAME', pkgName, path);
}

console.log('Installing packages. This may take a while...');
execSync('npm install', { stdio: 'inherit' });
console.log('');

if (sh.which('git')) {
  console.log('Initializing git repository...');
  sh.exec('git init --quiet && git commit --quiet --allow-empty -m "Root commit"');
  sh.exec('git add . && git commit --quiet -m "Init package"');
  console.log('');
} else {
  console.log(`${chalk.yellow('WARNING')}: git could not be found; skipping git init.`);
  console.log('Make sure to install git and add it to your project later if you want version control.');
  console.log('');
}

console.log(`Success! Created ${chalk.magenta(pkgName)} at ${chalk.green(fullPath)}.`);
console.log('Inside that directory, you can run a few useful commands:');
console.log('');

console.log(`  ${chalk.cyan('npm start')}`);
console.log('    Starts the development server.');
console.log('');

console.log(`  ${chalk.cyan('npm run build')}`);
console.log('    Bundles the app for production.');
console.log('');

console.log(chalk.underline('We suggest that you begin by typing:'));
console.log('');

console.log(`  ${chalk.cyan('cd')} ${targetPath}`);
console.log(`  npm start`);
console.log('');

console.log('Happy hacking!');
console.log('');