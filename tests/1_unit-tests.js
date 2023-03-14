const chai = require('chai');
const assert = chai.assert;

var puzzle = require('../controllers/puzzle-strings.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

const puzzleWithBadChar = 'BADCHARACTER3.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37P'
const puzzleWithEightyChar = '.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

suite('Unit Tests', () => {
  suite('Logical tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
      assert.isString(puzzle.puzzlesAndSolutions[0][0], 'Input should be string')
      assert.strictEqual(solver.validate(puzzle.puzzlesAndSolutions[0][0]), 81)
    })
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
      assert.strictEqual(solver.validate(puzzleWithBadChar).error, "Invalid characters in puzzle")
    }) 
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
      assert.strictEqual(solver.validate(puzzleWithEightyChar).error, "Expected puzzle to be 81 characters long")
    }) 
    test('Logic handles a valid row placement', () => {
      assert.strictEqual(solver.validate(puzzleWithEightyChar).error, "Expected puzzle to be 81 characters long")
    }) 
  });
});
