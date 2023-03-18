const r = require('./region-index.js')

class SudokuSolver {

  //if we instanciate this class with a puzzle we put it in this.puzzle
  constructor(puzzle = '') {
    if(puzzle) this.puzzle = puzzle;
  }

  fillLogicGrid(puzzleString) {
    /*
    Define three arrays: rows, columns and regions 
    each containing 9 arrays of 9 values from 1 to 9 and dots 
    representing missing value in the grid
    */
    const puzzle = puzzleString;
    this.rows = this.fillRows2(puzzle);
    // this.columns = this.fillColumns(puzzle);
    // this.regions= this.fillRegions(puzzle);
  }

  testing(puzzle) {
    this.fillLogicGrid(puzzle)
    this.validate(puzzle)
    this.validateRow();
    this.validateColumn();
    this.validateRegion();

  }

  fillRows(puzzleString) {
    let arrayOfRows = [];
    const str = puzzleString;
    //we go through the array, 9 rows
    for(let i = 0; i < 9; i++) {
      arrayOfRows.push([]);
      //for each row we fill 9 values
      for(let y = 0; y < 9; y++) {
        if(i === 0) {
        arrayOfRows[i].push(str[y]) 
        }  
        else {
        let index = y + (i * 9); 
        arrayOfRows[i].push(str[index]) 
        }
      }
    }
    return arrayOfRows;
  }

  fillRows2(puzzleString) {
    return Array.from({ length: 9 }, (_, i) => {
      const startIndex = i * 9;
      const endIndex = startIndex + 9;
      const row = puzzleString.slice(startIndex, endIndex).split('');
      return row;
    });
  }

  fillRegions(puzzleString) {
    let arrayOfRegions = [];
    const str = puzzleString;
    //we go through the arrays, 9 egionsr
    const indexMaster = [0,1,2,9,10,11,18,19,20];
    let indexMasterCopy = [...indexMaster];

    const incrementIndex = 3;
    for(let i = 0; i < 9; i++) {
      arrayOfRegions.push([]);
      if(i === 3 || i === 6) {
        let multiple = i === 3 ? 1 : 2;
        indexMasterCopy.forEach((e,i,a) => {
          a[i] = indexMaster[i] + (27 * multiple);
        }) 
      }
      for (let y = 0; y < 9; y++) {
        if(i === 0 || i === 3 || i === 6) {
          arrayOfRegions[i].push(str[indexMasterCopy[y]])
        }
        else {
          indexMasterCopy[y] = indexMasterCopy[y] + incrementIndex; 
          arrayOfRegions[i].push(str[indexMasterCopy[y]])
        }
      }
    }
    return arrayOfRegions;
  }

  fillColumns(puzzleString) {
    let arrayOfColumns = [];
    const str = puzzleString;
    //we go through the array, 9 columns 
    for(let i = 0; i < 9; i++) {
      arrayOfColumns.push([]);
      //for each row we fill 9 values
      for(let y = 0; y < 9; y++) {
        //first col: 0 9 18 
        if(i === 0) {
        let index = y * 9;
        arrayOfColumns[i].push(str[index]) 
        }  
        else {
        let index = i + (y * 9); 
        arrayOfColumns[i].push(str[index]) 
        }
      }
    }
    return arrayOfColumns;
  }

  //validate a character input in the text area
  characterValidator(char) {
    const charValidator = /[1-9]|\./
    return charValidator.test(char);
  }

  //validate a number input 
  numberValidator(num) {
    const numValidator = /[1-9]/
    return numValidator.test(num);
  }

  //validate a row input
  rowValidator(row) {
    const rowValidator = /^[A-I][1-9]$/
    return rowValidator.test(row);
  }

  //return false on duplicate numbers
  checkForRepeatNumber(arr) {
    return arr.every((e,i,a) => {
      //The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present. 
      return e !== '.' ? a.indexOf(e) === i : true;
    }) 
  }

  //return false on duplicate numbers or on dots
  puzzleIsSolved() {
    let puzzleIsValid = true;
    for(let i = 0; i < 3; i++) {
      for(let y = 0; y < 9; y++) {
        switch(i) {
          case 0:
            puzzleIsValid = this.rows[y].every((e,index,a) => {
              //The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present. 
              return e === '.' ? false : a.indexOf(e) === index
            }) 
            break;
          case 1:
            puzzleIsValid = this.columns[y].every((e,index,a) => {
              //The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present. 
              return e === '.' ? false : a.indexOf(e) === index
            }) 
            break;
          case 2:
            puzzleIsValid = this.regions[y].every((e,index,a) => {
              //The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present. 
              return e === '.' ? false : a.indexOf(e) === index
            }) 
            break;
        }
        if(!puzzleIsValid) return false;
      }
    }
    return puzzleIsValid;
  }

  //return a string of the puzzle
  givePuzzleString() {
    let str = '';
    for(let i = 0; i < 9; i++) {
      for(let y = 0; y < 9; y++) {
        str += this.rows[i][y];
      }
    }
    return str;
  }

  //validate a puzzle length and content - [1-9] + . 
  //returns 81 on success, or error string on error
  validate(puzzleString) {
    if(!this.checkPuzzleLength(puzzleString)) {
      return "Expected puzzle to be 81 characters long"
    }
    if(!this.checkPuzzleInputs(puzzleString)) {
      return "Invalid characters in puzzle"
    }
    return true;
  }

  checkPuzzleLength(puzzleString) {
    return puzzleString.length === 81 ? true : false;
  }

  checkPuzzleInputs(puzzleString) {
    // iterate over each data value
    for(let i = 0; i < puzzleString.length; i++) {
      //we check that we only have numbers or dots
      if(!this.characterValidator(puzzleString[i])) {
        //if not we return an error
        return false;
      }
    }
    return true;
  }



  //return false on repeat number found in row
  //you can specify the row or provide your own set
  //does not return false on repeat dot '.'
  validateRow(rowIndex = 8, arr = []) {
    if(arr.length < 9) {
      arr = [...this.rows[rowIndex]];
    }
    if(this.checkForRepeatNumber(arr)) {
      console.log('ValidateRow() returned true')
      return true;
    }
    else {
      console.log('ValidateRow() returned false at index: ' + rowIndex)
      return false;
    }
  }

  //return false on repeat number found in column 
  //you can specify the  columnor provide your own set
  //does not return false on repeat dot '.'
  validateColumn(columnIndex = 8, arr = []) {
    if(arr.length < 9) {
      arr = [...this.rows[columnIndex].map((e,i) => {
        return this.rows[i][columnIndex];
      })];
    }
    if(this.checkForRepeatNumber(arr)) {
      console.log('ValidateColumn() returned true')
      return true;
    }
    else {
      console.log('ValidateColumn() returned false at index: ' + columnIndex)
      return false;
    }
  }

  //return false on repeat number found in region
  //you can specify the region or provide your own set
  //does not return false on repeat dot '.'
  validateRegion(regionIndex = 8, arr = []) {
    if(arr.length < 9) {
      console.log(r.region[0])
      arr = [...this.rows[regionIndex].map((e,i) => {
        return this.rows[r.region[regionIndex][i][0]][r.region[regionIndex][i][1]]
      })];
    }
    if(this.checkForRepeatNumber(arr)) {
      console.log('ValidateRegion() returned true')
      return true;
    }
    else {
      console.log('ValidateRegion() returned false at index: ' + regionIndex)
      return false;
    }
  }



  // //validates puzzle length and char validity in the grid
  //     if(this.validate(puzzleString) !== 81) {
  //       return this.validate(puzzleString)
  //     }
  //     //validates coordinates
  //     if(!this.rowValidator(row) || !this.numberValidator(column)) {
  //       return {error: "Invalid coordinate"};
  //     }
  //     //validates a value
  //     if(!this.numberValidator(value)) {
  //       return {error: "Invalid value"}
  //     }

  //if the row doesn't contain repeat value we assume it is correct
  //this doesn't account for the row above/under and the column it crosses
  //nor the region is in, it just validates a row as being valid in itself
  checkRowPlacement(puzzleString, row, column, value) {

    //we need to determine the position we begin with and the position we end in 
    //the puzzleString, that'll give us the actual row 
    //A = 0-8, B = 9-17 etc.. I = 72-80

    // let char = row
    // const charCode = char.charCodeAt(0);
    // //here we declare the starting position
    // let pos = (charCode - "A".charCodeAt(0)) * 9
    // //here we extract the row to analyse 
    // let line = puzzleString.substring(pos, pos + 9)
    // console.log(line)

    // //check that the row doesn't contain repeat values
    // if(this.checkForRepeatNumber(line)) {
    //   return {
    //     valid: false,
    //     conflict: "row"
    //   }
    }



  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    //loop condition
    let puzzleSolved = false;
    let unsolvable = false;
    //indentify the previous zone worked on
    const previous = {
      type: '',
      index: 0
    }
    //contains the history of previous
    const orderHistory = [];
    //we start an alternate board called alternateBoard
    this.startAlternateBoard(puzzleString)

    //here we try to solve the puzzle 
    do {
      //we fill our rows columns and region
      this.fillLogicGrid(this.alternateBoard)  
      



      //check if the loop condition has changed 
      puzzleSolved = this.puzzleIsSolved();
    }
    while(!puzzleSolved)
    //

    if(unsolvable) {

    }

    return {
      solution: ''//return the solution
    }
  }

  //determine which col row reg has the least missing number
  findOrderOfResolution() {
    /* 
    {
      type: 'row'|'col'|'reg',
      missing: 3,
      values: [1,5,7]
      index: 1
    }
    return an array of objects listing least to most missing N
    */
    let arr = [];
    for(let i = 0; i < 3; i++) {
      for(let y = 0; y < 9; y++) {
        let missing;
        switch(i) {
          case 0:
            missing = this.returnMissingNumbers(this.rows[y])
            arr.push({
              type: 'row',
              missing: missing.length,
              values: missing,
              index: y
            }) 
            break;
          case 1:
            missing = this.returnMissingNumbers(this.columns[y])
            arr.push({
              type: 'column',
              missing: missing.length,
              values: missing,
              index: y
            }) 
            break;
          case 2:
            missing = this.returnMissingNumbers(this.regions[y])
            arr.push({
              type: 'region',
              missing: missing.length,
              values: missing,
              index: y
            }) 
            break;
        }
      }
    }
    return arr.sort((a,b) => { return a.missing - b.missing});
  }

  //initiate a board that we will fill along trying to solve it
  startAlternateBoard() {
    this.alternateBoard = this.puzzle;
  }

returnMissingNumbers(arr) {
    //given an arr, determine which integers are missing from that arrray
    const missing = [];
    for (let i = 1; i <= 9; i++) {
      if (!arr.includes(i.toString())) {
      missing.push(i.toString());
      }
    }
    //if we have identified missing numbers we return them otherwise we return false
    return missing.length > 0 ? missing : []; 
  }
}

module.exports = SudokuSolver;

