'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  

  app.route('/api/check')
    .post((req, res) => {

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      console.log(req.body)
      console.log(req.body.puzzle)

      let puzzle = req.body.puzzle
      // let validCode = solver.validate(puzzle);
      // if( validCode === 2) {
      //   res.json({error: "Expected puzzle to be 81 characters long"});
      // }
      // else if(validCode === 3) {
      //   res.json({error: "Invalid characters in puzzle"});
      // }
      // else if(validCode === 1) {
      // }
      let solver = new SudokuSolver(puzzle);
    });
};
