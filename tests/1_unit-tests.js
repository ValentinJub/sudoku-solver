const chai = require('chai');
const assert = chai.assert;

var Puzzle = require('../controllers/puzzle-strings.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

const puzzleWithBadChar = 'BADCHARACTER3.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37P'
const puzzleWithEightyChar = '.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
const solution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
const badSolution = '568913724342687519197254386685479231219538467534162895926345178473891652851726943'

/* 
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378'

    # To create an invalid row we can simply
 */

let solver = new SudokuSolver(Puzzle.puzzlesAndSolutions[0][0]);

suite('Unit Tests', () => {
  suite('Logical tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
      assert.isString(Puzzle.puzzlesAndSolutions[0][0], 'Input should be string')
    })
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
      assert.strictEqual(solver.puzzleHasOnlyValidInputs(puzzleWithBadChar), false)
      assert.strictEqual(solver.puzzleHasOnlyValidInputs(Puzzle.puzzlesAndSolutions[0][0]), true)
    }) 
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
      assert.strictEqual(solver.puzzleIsEightyOneCharLong(Puzzle.puzzlesAndSolutions[0][0]), true)
      assert.strictEqual(solver.puzzleIsEightyOneCharLong(puzzleWithEightyChar), false)
    }) 
    test('Logic handles a valid row placement', () => {
      solver.updateRow(8, 8, '8');
      assert.strictEqual(solver.validateRow(8), true)
      solver.resetLogicGrid();
    }) 
    test('Logic handles an invalid row placement', () => {
      solver.updateRow(8, 8, '6');
      assert.strictEqual(solver.validateRow(8), false)
      solver.resetLogicGrid();
    }) 
    test('Logic handles valid column placement', () => {
      solver.updateRow(8, 8, '8');
      assert.strictEqual(solver.validateColumn(8), true)
      solver.resetLogicGrid();
    }) 
    test('Logic handles an invalid column placement', () => {
      solver.updateRow(8, 8, '1');
      assert.strictEqual(solver.validateColumn(8), false)
      solver.resetLogicGrid();
    }) 
    test('Logic handles valid region (3x3) placement', () => {
      solver.updateRow(8, 8, '2');
      assert.strictEqual(solver.validateRegion(8), true)
      solver.resetLogicGrid();
    }) 
    test('Logic handles an invalid region (3x3) placement', () => {
      solver.updateRow(8, 8, '1');
      assert.strictEqual(solver.validateRegion(8), false)
      solver.resetLogicGrid();
    }) 
    test('Valid puzzle string passes the solver', () => {
      solver = new SudokuSolver(solution)
      assert.strictEqual(solver.puzzleIsSolved(), true)
    }) 
    test('Invalid puzzle string fails the solver', () => {
      solver = new SudokuSolver(badSolution)
      assert.strictEqual(solver.puzzleIsSolved(), false)
    }) 
    test('Solver returns the expected solution for an incomplete puzzle', () => {
      solver = new SudokuSolver(puzzle)
      assert.strictEqual(solver.solve().solution, solution)
    }) 
  });
});
