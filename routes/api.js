'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle: puzzle, coordinate: coordinate, value: value } = req.body;
      console.log(`The puzzle string is: ${puzzle}`)
      console.log(`The coordinate are: ${coordinate}`)
      console.log(`The value is: ${value}`)

      if(!puzzle || !coordinate || !value) return res.send({error: 'Required field(s) missing'})

      let solver = new SudokuSolver(puzzle);

      const isValid = solver.validatePuzzleLengthAndInputs(puzzle)
      //If the puzzle submitted to /api/solve contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
      if(isValid === "Invalid characters in puzzle") {
        return res.send({error: 'Invalid characters in puzzle'})
      }
      //If the puzzle submitted to /api/solve is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
      else if(isValid === "Expected puzzle to be 81 characters long") {
        return res.send({error: "Expected puzzle to be 81 characters long"})
      }
      //If the puzzle submitted to /api/solve is invalid or cannot be solved, the returned value will be { error: 'Puzzle cannot be solved' }
      else if(isValid === "Puzzle cannot be solved") {
        return res.send({error: "Puzzle cannot be solved"})
      }

      const valueIsCorrect = solver.numberValidator(value);
      const coordinateIsCorrect = solver.rowValidator(coordinate)

      if(!coordinateIsCorrect) {
        return res.send({error: 'Invalid coordinate'})
      }
      else if(!valueIsCorrect) {
        return res.send({error: 'Invalid value'})
      }
      else {
          //check if the input value is already in the puzzle
          if(solver.alreadyInTheGrid(coordinate, value)) {
            return res.send({valid: true})
          }
          else {
            const check = solver.checkPlacement(coordinate, value)
            return res.send(check);
          }
      }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      //If the object submitted to /api/solve is missing puzzle, the returned value will be { error: 'Required field missing' }
      if(!puzzle) {
        return res.send({error: 'Required field missing'})
      }
      let solver = new SudokuSolver(puzzle);
      solver.testing(puzzle)
      const isValid = solver.validatePuzzleLengthAndInputs(puzzle)
      //If the puzzle submitted to /api/solve contains values which are not numbers or periods, the returned value will be { error: 'Invalid characters in puzzle' }
      if(isValid === "Invalid characters in puzzle") {
        return res.send({error: 'Invalid characters in puzzle'})
      }
      //If the puzzle submitted to /api/solve is greater or less than 81 characters, the returned value will be { error: 'Expected puzzle to be 81 characters long' }
      else if(isValid === "Expected puzzle to be 81 characters long") {
        return res.send({error: "Expected puzzle to be 81 characters long"})
      }
      //If the puzzle submitted to /api/solve is invalid or cannot be solved, the returned value will be { error: 'Puzzle cannot be solved' }
      else if(isValid === "Puzzle cannot be solved") {
        return res.send({error: "Puzzle cannot be solved"})
      }
      else if(isValid) {
        let result = solver.solve(puzzle)
        if(result.solved) {
          return res.send({solution: result.solution, solved: true})
        }
        else {
          return res.send({error: "Puzzle cannot be solved", solved: false})
        }
      }
    });
};
