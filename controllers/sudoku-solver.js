class SudokuSolver {

  constructor(puzzle = '') {
    if(puzzle) this.fillLogicGrid(puzzle);
  }

  fillLogicGrid(puzzleString) {
    /*
    Define three arrays: rows, columns and regions 
    each containing 9 arrays of 9 values from 1 to 9 and dots 
    representing missing value in the grid
    */
    const puzzle = puzzleString;
    this.rows = this.fillRows2(puzzle);
    this.columns = this.fillColumns(puzzle);
    this.regions= this.fillRegions(puzzle);
    this.validate();
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

  //validate a puzzle length and content - [1-9] + . 
  //returns 81 on success, or error string on error
  validate(puzzleString) {
    if(!this.checkPuzzleLength(puzzleString)) {
      return "Expected puzzle to be 81 characters long"
    }
    else if(!this.checkPuzzleInputs(puzzleString)) {
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
  validateRow(row = 1, arr = []) {
    const rowIndex = row - 1;
    if(arr.length < 9) {
      arr = [...this.rows[rowIndex]];
    }
    if(this.checkForRepeatNumber(arr)) {
      console.log('ValidateRow() returned true')
      return true;
    }
    else {
      console.log('ValidateRow() returned false')
      return false;
    }
  }

  //return false on repeat number found in column 
  //you can specify the  columnor provide your own set
  //does not return false on repeat dot '.'
  validateColumn(column = 1, arr = []) {
    const columnIndex = column - 1;
    if(arr.length < 9) {
      arr = [...this.columns[columnIndex]];
    }
    if(this.checkForRepeatNumber(arr)) {
      console.log('ValidateColumn() returned true')
      return true;
    }
    else {
      console.log('ValidateColumn() returned false')
      return false;
    }
  }

  //return false on repeat number found in region
  //you can specify the region or provide your own set
  //does not return false on repeat dot '.'
  validateRegion(region = 1, arr = []) {
    const regionIndex= region - 1;
    if(arr.length < 9) {
      arr = [...this.regions[regionIndex]];
    }
    if(this.checkForRepeatNumber(arr)) {
      console.log('ValidateRegion() returned true')
      return true;
    }
    else {
      console.log('ValidateRegion() returned false')
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
    /*
    we need to manage errors in inputs of value and position
    the row will stay the same but the column has to be incremented until column < 10
    we want to check that:
      -the whole row contains 9 values from 1 to 9 that are never repeated
       ex: 123456789
    puzzleString has to contain 81 chars we need to check that 
    row needs to be checked
    column needs to be checked
    value needs to be checked
    */
    

    //we have a column and row so we can validate a single value 
    //however we need to solve the whole row before that.
    
    //we need to determine the position we begin with and the position we end in 
    //the puzzleString, that'll give us the actual row 
    //A = 0-8, B = 9-17 etc.. I = 72-80

    let char = row
    const charCode = char.charCodeAt(0);
    //here we declare the starting position
    let pos = (charCode - "A".charCodeAt(0)) * 9
    //here we extract the row to analyse 
    let line = puzzleString.substring(pos, pos + 9)
    console.log(line)

    //check that the row doesn't contain repeat values
    if(this.checkForRepeatNumber(line)) {
      return {
        valid: false,
        conflict: "row"
      }
    }
    //if the row doesn't contain repeat value we assume it is correct
    //this doesn't account for the row above/under and the column it crosses
    //nor the region is in, it just validates a row as being valid in itself
    else return {valid: true}    
  }


  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {
    
  }
}

module.exports = SudokuSolver;

