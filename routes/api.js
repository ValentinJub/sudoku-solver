'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  

  app.route('/api/check')
    .post((req, res) => {

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      //If the object submitted to /api/solve is missing puzzle, the returned value will be { error: 'Required field missing' }
      if(!puzzle) {
        return res.send({error: 'Required field missing'})
      }
      let solver = new SudokuSolver(puzzle);
      let missingNumbers = solver.returnMissingNumbers([1,2,3,4,5,6,7,8,9])
      solver.testing(puzzle)
      const isValid = solver.validate(puzzle)
      //If the puzzle submitted to /api/solve contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
      if(isValid === "Invalid characters in puzzle") {
        return res.send({error: 'Invalid characters in puzzle'})
      }
      //If the puzzle submitted to /api/solve is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
      else if(isValid === "Expected puzzle to be 81 characters long") {
        return res.send({error: "Expected puzzle to be 81 characters long"})
      }
    });
};
