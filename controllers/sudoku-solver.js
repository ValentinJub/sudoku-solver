const r = require('./region-index.js')

class SudokuSolver {

  //if we instanciate this class with a puzzle we put it in this.puzzle
  constructor(puzzle = '') {
    if(puzzle) {
      this.puzzle = puzzle;
      this.fillLogicGrid(puzzle);
    }
  }

  //fill this.rows array with the provided puzzle
  fillLogicGrid(puzzle) {
    /*
    Define one arrays: rows 
    containing 9 arrays of 9 values from 1 to 9 and dots 
    representing missing value in the grid
    */
    this.rows = this.fillRows2(puzzle);
  }

  testing(puzzle) {
    this.fillLogicGrid(puzzle)
    this.validatePuzzleLengthAndInputs(puzzle)
    this.validateRow();
    this.validateColumn();
    this.validateRegion();
    let array = this.findOrderOfResolution()
    // console.log(array)
    let win = this.puzzleIsSolved()
    // console.log(win)
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
        let arr;
        switch(i) {
          case 0:
            puzzleIsValid = this.rows[y].every((e,index,a) => {
              //The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present. 
              return e === '.' ? false : a.indexOf(e) === index
            }) 
            break;
          case 1:
            arr = [...this.rows[y].map((e,ind) => {
              return this.rows[ind][y]
            })]
            puzzleIsValid = arr.every((e,index,a) => {
              //The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present. 
              return e === '.' ? false : a.indexOf(e) === index
            }) 
            break;
          case 2:
            arr = [...this.rows[y].map((e,ind) => {
              return this.rows[r.region[y][ind][0]][r.region[y][ind][1]]
            })];
            puzzleIsValid = arr.every((e,index,a) => {
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
  validatePuzzleLengthAndInputs(puzzleString) {
    if(!this.puzzleIsEightyOneCharLong(puzzleString)) {
      return "Expected puzzle to be 81 characters long"
    }
    if(!this.puzzleHasOnlyValidInputs(puzzleString)) {
      return "Invalid characters in puzzle"
    }
    if(this.puzzleHasDuplicateNumbers()) {
      return "Puzzle cannot be solved"
    }
    return true;
  }

  puzzleIsEightyOneCharLong(puzzleString) {
    return puzzleString.length === 81;
  }

  //return false on inputs other than N or dots
  puzzleHasOnlyValidInputs(puzzleString) {
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

  copyRows() {
    this.rowsCopy = [...this.rows];
  }

  returnRegion(rowIndex, positionIndex) {
    if(rowIndex <= 2) {
      if(positionIndex <= 2) return 0;
      else if(positionIndex > 2 && positionIndex <= 5) return 1;
      else if(positionIndex > 5) return 2;
    }
    else if(rowIndex > 2 && rowIndex <= 5) {
      if(positionIndex <= 2) return 3;
      else if(positionIndex > 2 && positionIndex <= 5) return 4;
      else if(positionIndex > 5) return 5;
    }
    else if(rowIndex > 5) {
      if(positionIndex <= 2) return 6;
      else if(positionIndex > 2 && positionIndex <= 5) return 7;
      else if(positionIndex > 5) return 8;
    }
  }

  puzzleHasDuplicateNumbers() {
    for(let i = 0; i < 9; i++) {
      if(!this.validateRow(i)) {
        return true;
      }
      if(!this.validateColumn(i)) {
        return true;
      }
      if(!this.validateRegion(i)) {
        return true;
      }
    }
    return false;
  }

  initResolutionGrid(puzzleString) {
    this.resolutionGrid = [...Array.from({ length: 9 }, (_, i) => {
      const startIndex = i * 9;
      const endIndex = startIndex + 9;
      const row = puzzleString.slice(startIndex, endIndex).split('');
      return row.map(e => {return e !== '.' ? 1 : '.'});
    })];
  }

  initResolutionHistory() {
    this.resolutionHistory = [
      {
        initialPuzzle: this.puzzle,
        initialRows: [...this.rows],
        initialResolutionGrid: [...this.resolutionGrid]
      }
    ]
  }



  solve(puzzleString) {
    //loop condition
    let puzzleSolved = false;
    let unsolvable = false;
    let potentialValue = [];
    do {
      this.fillObviousSquares(potentialValue);
      //check if the loop condition has changed 
      puzzleSolved = this.puzzleIsSolved();
    }
    while(!puzzleSolved)
    let solvedPuzzle = this.givePuzzleString()
    return {
      solved: true,
      solution: solvedPuzzle
    }
  }

  sortPotentialValues(potentialValue, type, rowIndex, valuesToPop) {
    potentialValue.forEach((e,i,a) => {
      //rows
      if(e.type === 'row' && e.rowIndex === rowIndex) {
        for(let i = 0, len = valuesToPop.length; i < len; i++) {
          e.value = [...e.value.map(e => { if(e !== valuesToPop[i]) return e; }).filter(e => {return e !== undefined})]
        }
        if(e.value.length === 1) {
          this.rows[rowIndex][e.valueIndex] = e.value[0];
          e.value.pop();
        }
      }
      //columns
      else if(e.type === 'column' && e.columnIndex === rowIndex) {
        for(let i = 0, len = valuesToPop.length; i < len; i++) {
          e.value = [...e.value.map(e => { if(e !== valuesToPop[i]) return e; }).filter(e => {return e !== undefined})]
        }
        if(e.value.length === 1) {
          this.rows[e.valueIndex][rowIndex] = e.value[0];
          e.value.pop();
        }
      }
      //regions
      else if(e.type === 'region' && e.regionIndex === rowIndex) {
        let [ rI, pI ] = this.returnRowAndPosition(rowIndex, e.valueIndex) 
        for(let i = 0, len = valuesToPop.length; i < len; i++) {
          e.value = [...e.value.map(e => { if(e !== valuesToPop[i]) return e; }).filter(e => {return e !== undefined})]
        }
        if(e.value.length === 1) {
          this.rows[rI][pI] = e.value[0];
          e.value.pop();
        }
      }
    })
  }

  fillObviousSquares(potentialValue) {
    const orderHistory = [];
    let order = this.findOrderOfResolution();

    for(let i = 0, len = order.length; i < len; i++) {
      //missing values
      let missing = order[i].values;
      let currentMissing = 0;
      let valuesToPop = [];
      //index of the row in this.rows
      let rowIndex = order[i].index;
      let potentialObjectToShift = 0;
      //the index of the missing N in the row
      let missingIndex = [];
      //we do not evaluate row|col|reg the same way
      switch(order[i].type) {
        case 'row':
          missingIndex = [...this.rows[rowIndex].map((e,i) => { return e === '.' ? i : -1}).filter(e => e !== -1)]
          potentialObjectToShift = missingIndex.length;
          for(let a = 0, len = missingIndex.length; a < len; a++) {
            potentialValue.unshift({
              type: 'row',
              rowIndex: rowIndex,
              valueIndex: missingIndex[a],
              value: [],
            })
            for(let b = 0; b < missing.length; b++) {
              //I fill an empty square with a possible value
              currentMissing = missing[b];
              this.rows[rowIndex][missingIndex[a]] = currentMissing;
              //we need to check if the C or Reg conflicts
              //(if conflict)
              if(this.validateColumn(missingIndex[a])) {
                if(this.validateRegion(this.returnRegion(rowIndex, missingIndex[a]))) {
                  if(this.validateRow(0, this.rows[rowIndex])) {
                    //potential valid -> fill with a dot
                    potentialValue[0].value.push(missing[b])
                  }
                }
              }
            }
            if(potentialValue[0].value.length === 1) {
              this.rows[rowIndex][missingIndex[a]] = potentialValue[0].value[0];
              valuesToPop.push(potentialValue[0].value[0]);
              potentialValue.shift()
              potentialObjectToShift--;
            }
            else {
              this.rows[rowIndex][missingIndex[a]] = '.'
            }
          }
          this.sortPotentialValues(potentialValue, 'row', rowIndex, valuesToPop);
          for(let v = 0; v < potentialObjectToShift; v++) {
            potentialValue.shift();
          }
          orderHistory.push(order[i]);
          break;
        case 'column':
          missingIndex = [...this.rows[rowIndex].map((e,i) => {
            return this.rows[i][rowIndex];
          }).map((e,i) => { return e === '.' ? i : -1}).filter(e => e !== -1)];
          potentialObjectToShift = missingIndex.length;
          for(let a = 0, len = missingIndex.length; a < len; a++) {
            potentialValue.unshift({
              type: 'column',
              columnIndex: rowIndex,
              valueIndex: missingIndex[a],
              value: []
            })
            for(let b = 0; b < missing.length; b++) {
              //I fill an empty square with a possible value
              currentMissing = missing[b];
              this.rows[missingIndex[a]][rowIndex] = currentMissing;
              if(this.validateColumn(rowIndex)) {
                if(this.validateRegion(this.returnRegion(missingIndex[a], rowIndex))) {
                  if(this.validateRow(0, this.rows[missingIndex[a]])) {
                    //potential valid -> fill with a dot
                    potentialValue[0].value.push(currentMissing)
                  }
                }
              }
            }
            if(potentialValue[0].value.length === 1) {
              this.rows[missingIndex[a]][rowIndex] = potentialValue[0].value[0];
              valuesToPop.push(potentialValue[0].value[0]);
              potentialValue.shift()
              potentialObjectToShift--;
            }
            else {
              this.rows[missingIndex[a]][rowIndex] = '.'
            }
          }
          this.sortPotentialValues(potentialValue, 'column', rowIndex, valuesToPop);
          for(let v = 0; v < potentialObjectToShift; v++) {
            potentialValue.shift();
          }
          orderHistory.push(order[i]);
          break;
        case 'region':
          missingIndex = [...this.rows[rowIndex].map((e,i) => {
            return this.rows[r.region[rowIndex][i][0]][r.region[rowIndex][i][1]]
          }).map((e,i) => { return e === '.' ? i : -1}).filter(e => e !== -1)]
          potentialObjectToShift = missingIndex.length;
          for(let a = 0, len = missingIndex.length; a < len; a++) {
            potentialValue.unshift({
              type: 'region',
              regionIndex: rowIndex,
              valueIndex: missingIndex[a],
              value: []
            })
            //rowIndex = regionIndex
              //missingIndex is region top left to bottom right
              //0|1|2
              //3|4|5
              //6|7|8
            let [ rI, pI ] = this.returnRowAndPosition(rowIndex, missingIndex[a]) 
            for(let b = 0; b < missing.length; b++) {
              currentMissing = missing[b];
              this.rows[rI][pI] = currentMissing;
              //we need to check if the C or Reg conflicts
              //(if conflict)
              if(this.validateColumn(pI)) {
                if(this.validateRegion(rowIndex)) {
                  if(this.validateRow(0, this.rows[rI])) {
                    //potential valid -> fill with a dot
                    potentialValue[0].value.push(missing[b])
                  }
                }
              }
            }
            if(potentialValue[0].value.length === 1) {
              this.rows[rI][pI] = potentialValue[0].value[0];
              valuesToPop.push(potentialValue[0].value[0]);
              potentialValue.shift()
              potentialObjectToShift--;
            }
            else {
              this.rows[rI][pI] = '.'
            } 
          }
          this.sortPotentialValues(potentialValue, 'region', rowIndex, valuesToPop);
          for(let v = 0; v < potentialObjectToShift; v++) {
            potentialValue.shift();
          }
          orderHistory.push(order[i]);
          break;
      } 
    }
  }

  returnRowAndPosition(regionIndex, positionIndex) {
    //0|1|2
    //3|4|5
    //6|7|8
    if (regionIndex === 0) {
      switch(positionIndex) {
        case 0:
          return [0, 0];
        case 1:
          return [0, 1];
        case 2:
          return [0, 2];
        case 3:
          return [1, 0];
        case 4:
          return [1, 1];
        case 5:
          return [1, 2];
        case 6:
          return [2, 0];
        case 7:
          return [2, 1];
        case 8:
          return [2, 2];
      }
  } else if (regionIndex === 1) {
      switch(positionIndex) {
        case 0:
          return [0, 3];
        case 1:
          return [0, 4];
        case 2:
          return [0, 5];
        case 3:
          return [1, 3];
        case 4:
          return [1, 4];
        case 5:
          return [1, 5];
        case 6:
          return [2, 3];
        case 7:
          return [2, 4];
        case 8:
          return [2, 5];
      }
  } else if (regionIndex === 2) {
      switch(positionIndex) {
        case 0:
          return [0, 6];
        case 1:
          return [0, 7];
        case 2:
          return [0, 8];
        case 3:
          return [1, 6];
        case 4:
          return [1, 7];
        case 5:
          return [1, 8];
        case 6:
          return [2, 6];
        case 7:
          return [2, 7];
        case 8:
          return [2, 8];
      }
  } else if (regionIndex === 3) {
      switch(positionIndex) {
        case 0:
          return [3, 0];
        case 1:
          return [3, 1];
        case 2:
          return [3, 2];
        case 3:
          return [4, 0];
        case 4:
          return [4, 1];
        case 5:
          return [4, 2];
        case 6:
          return [5, 0];
        case 7:
          return [5, 1];
        case 8:
          return [5, 2];
      }
  } else if (regionIndex === 4) {
      switch(positionIndex) {
        case 0:
          return [3, 3];
        case 1:
          return [3, 4];
        case 2:
          return [3, 5];
        case 3:
          return [4, 3];
        case 4:
          return [4, 4];
        case 5:
          return [4, 5];
        case 6:
          return [5, 3];
        case 7:
          return [5, 4];
        case 8:
          return [5, 5];
      }
  } else if (regionIndex === 5) {
      switch(positionIndex) {
        case 0:
          return [3, 6];
        case 1:
          return [3, 7];
        case 2:
          return [3, 8];
        case 3:
          return [4, 6];
        case 4:
          return [4, 7];
        case 5:
          return [4, 8];
        case 6:
          return [5, 6];
        case 7:
          return [5, 7];
        case 8:
          return [5, 8];
      }
  } else if (regionIndex === 6) {
      switch(positionIndex) {
        case 0:
          return [6, 0];
        case 1:
          return [6, 1];
        case 2:
          return [6, 2];
        case 3:
          return [7, 0];
        case 4:
          return [7, 1];
        case 5:
          return [7, 2];
        case 6:
          return [8, 0];
        case 7:
          return [8, 1];
        case 8:
          return [8, 2];
      }
  } else if (regionIndex === 7) {
      switch(positionIndex) {
        case 0:
          return [6, 3];
        case 1:
          return [6, 4];
        case 2:
          return [6, 5];
        case 3:
          return [7, 3];
        case 4:
          return [7, 4];
        case 5:
          return [7, 5];
        case 6:
          return [8, 3];
        case 7:
          return [8, 4];
        case 8:
          return [8, 5];
      }
  } else if (regionIndex === 8) {
      switch(positionIndex) {
        case 0:
          return [6, 6];
        case 1:
          return [6, 7];
        case 2:
          return [6, 8];
        case 3:
          return [7, 6];
        case 4:
          return [7, 7];
        case 5:
          return [7, 8];
        case 6:
          return [8, 6];
        case 7:
          return [8, 7];
        case 8:
          return [8, 8];
    }
    }
  }

  //determine which col row reg has the least missing number
  // return an array of objects listing least to most missing N
  findOrderOfResolution() {
    let arr = [];
    for(let i = 0; i < 3; i++) {
      for(let y = 0; y < 9; y++) {
        let missing;
        let tempArray;
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
            tempArray = [...this.rows[y].map((e,ind) => {
              return this.rows[ind][y]
            })]
            missing = this.returnMissingNumbers(tempArray)
            arr.push({
              type: 'column',
              missing: missing.length,
              values: missing,
              index: y
            }) 
            break;
          case 2:
            tempArray = [...this.rows[y].map((e,ind) => {
              return this.rows[r.region[y][ind][0]][r.region[y][ind][1]]
            })];
            missing = this.returnMissingNumbers(tempArray)
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
    return arr.filter(e => { return e.missing > 0})
              .sort((a,b) => { return a.missing - b.missing});
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

