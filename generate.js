var chalk = require('chalk');
var inquirer = require('inquirer');
var cmd = require('./shellInterface.js');

var selection = {
  seed: 0.1,
  projection: "Mercator",
  generator: "Yes",
  color: "Olsson",
  outline: "No",
  dimensions: "600x800",
  filename: 'map'
};

// DRIVER FUNCTION
function main(selection) {
  console.log(`Welcome to the World Generator!\n`);

  seed(selection);
}

// PROMPT 1 - SEED SELECTION
function seed(selection) {
  inquirer
    .prompt({
      type: 'input',
      name: 'seed',
      message: 'Enter a seed value (between 0.0 and 1.0).',
      default: function() {
        return 0.1;
      }
    })
    .then(answers => {
      selection.seed = answers.seed;
      projection(selection);
    })
}

// PROMPT 2 - PROJECTION SELECTION
function projection(selection) {
  inquirer
    .prompt({
      type: 'list',
      name: 'projection',
      message: `Select map projection:`,
      choices: [
        "Mercator",
        "Peters",
        "Square"
      ]
    })
    .then(answers => {
      selection.projection = answers.projection;
      scale(selection);
    })
}

// PROMPT 3 - GENERATOR OPTIONS
function scale(selection) {
  inquirer
    .prompt({
      type: 'list',
      name: 'scale',
      message: 'Apply non-linear scale to altitude?',
      choices: [
        "Yes", "No"
      ]
    })
    .then(answers => {
      selection.scale = answers.scale;
      style(selection);
    })
}

// PROMPT 4 - STYLE OPTIONS
function style(selection) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'color',
        message: 'Select a color palette.',
        choices: [
          "Olsson"
        ]
      },
      {
        type: 'list',
        name: 'outline',
        message: 'Outline map?',
        choices: [
          "Yes", "No"
        ]
      }
    ])
    .then(answers => {
        selection.color = answers.color;
        selection.outline = answers.outline;
        output(selection);
      })
}

// PROMPT 6 - OUTPUT OPTIONS
function output(selection) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'dimensions',
        message: 'Select an output height and width.',
        choices: [
          "600x800",
          "1200x1600"
        ]
      },
      {
        type: 'input',
        name: 'filename',
        message: 'Enter a file name.',
        default: function() {
          return "map";
        }
      }
    ])
    .then(answers => {
      selection.dimensions = answers.dimensions;
      selection.filename = answers.filename;
      configure(selection);
    })
}

function configure(selection) {
  var planet = ''
  var s, p, h, l, w, col, e, out;

  s = selection.seed;
  col = selection.color;
  out = selection.filename;

  // Logic for projection selection
  let projection = selection.projection;
  if (projection === "Mercator") {
    p = "m";
  } else if (projection === "Square") {
    p = "q";
  } else if (projection === "Peters") {
    p = "p";
  }

  // Logic for dimensions selection
  let dimensions = selection.dimensions;

  if (dimensions === "600x800") {
    h = 600;
    w = 800;
  } else if (dimensions === "1200x1600") {
    h = 1200;
    w = 1600;
  }

  // Logic for outline selection
  let outline = selection.outline;

  if (outline === "Yes") {
    e = " -E";
  } else {
    e = "";
  }

  // Logic for scale selection
  let linear = selection.scale;

  if (linear === "Yes") {
    l = " -n"
  } else {
    l = "";
  }

  var command = "./planet/planet" + ` -s ${s}` + ` -p${p}` + ` -L 0 -l 0` + ` -h ${h}` + ` -w ${w}` + ` -C ./planet/${col}.col` + `${l}` + `${e}` + ` -o ./output/${out}.bmp`
  exec(command);
}

function exec(command) {
  console.log("Generating...");
  cmd.exec(command);
  console.log("Done!");
}

// START THE APPLICATION
main(selection);
