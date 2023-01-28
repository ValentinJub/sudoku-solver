const textArea = document.getElementById("text-input");
const coordInput = document.getElementById("coord");
const valInput = document.getElementById("val");
const errorMsg = document.getElementById("error");

//fills the text area and sudoky grid on page start
document.addEventListener("DOMContentLoaded", () => {
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  fillpuzzle(textArea.value);
});

//listens to textArea inputs to fill the grid
textArea.addEventListener("input", () => {
  fillpuzzle(textArea.value);
});

//fills the grid with data found in textArea
//it used to initially fill and to fill/empty on inputs
function fillpuzzle(data) {
  //we can't have more than 9*9 (81) numbers, less is ok
  let len = data.length < 81 ? data.length : 81;
  //forEach data value
  //we sequentially walk in the grid from left to right, top to bottom
  for (let i = 0; i < len; i++) {
    //we need to know our x,y pos each iteration
    //rowLetter returns A when i ranges from 0 to 8, B from 9 to 17 etc...
    let rowLetter = String.fromCharCode('A'.charCodeAt(0) + Math.floor(i / 9));
    //col sequentially returns 1 to 9
    let col = (i % 9) + 1; 
    //if that position in the textArea is empty or . 
    if (!data[i] || data[i] === ".") {
      //we empty the box
      document.getElementsByClassName(rowLetter + col)[0].innerText = " ";
    } else {
      //else we fill the box with the value in the textArea at designated pos
      document.getElementsByClassName(rowLetter + col)[0].innerText = data[i];
    }
  }
  //we indicate the end of the function and that we do not want to return a value
  return;
}

//this is called when the solve button is clicked
async function getSolved() {
  //we grab the data in the textArea
  const stuff = {"puzzle": textArea.value}
  //we send a post to api/solve with the data as a string in the request
  const data = await fetch("/api/solve", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  //we then expect a response containing the solution 
  const parsed = await data.json();
  //if we returned an error
  if (parsed.error) {
    errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
    return
  }
  //if all went right we fill the grid with the solution
  fillpuzzle(parsed.solution)
}

//this is called when the check placement buttton is clicked
async function getChecked() {
  //we grab the data in textArea, value in coordinate (ex: B5) input and in value (ex: 1) input 
  const stuff = {"puzzle": textArea.value, "coordinate": coordInput.value, "value": valInput.value}
    //we send a post to api/check with our stuff
    const data = await fetch("/api/check", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },
    body: JSON.stringify(stuff)
  })
  //we expect a response  
  const parsed = await data.json();
  //we handle error
  errorMsg.innerHTML = `<code>${JSON.stringify(parsed, null, 2)}</code>`;
}


//link our functions and buttons
document.getElementById("solve-button").addEventListener("click", getSolved)
document.getElementById("check-button").addEventListener("click", getChecked)