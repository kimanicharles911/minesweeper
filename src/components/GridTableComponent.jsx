
/* 
  * I imported the useState & useRef hook
  * I imported my custom CSS stylesheet
  * I then created my functional component.
  * I created state variables that help in initialization of the game.
  * I then created an array variable that will store the "ID" of each minesweeper box.
  * I then created an array variable that will store the mine locations of a game.
  * I then created an array variable that will store the minesweeper boxes without a mine.
  * I created state variables that stores the position of a none-mine box and the number of mines surrounding it.
  * I used the useRef hook to get the most recent state variable from the adjacentMinesData state variable. useRef is an object and it stores the value in the current property.
  * I created the mineCountArr state variable to store the real time mineCounts whenever the player starts planting flags.
  * I created the globalFlaggedBoxesArr to store the realtime position of all flagged boxes in the game.
  * I created a boolean toggle named timerToggle to act as switch that allows the timer to run only once when the game starts.
*/
import { useState, useRef } from "react";
import "./GridTableComponent.css";

const GridTableComponent = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const gridBoxesArr = [];
  const [mineLocationsArr] = useState([]);
  let noneMineBoxesArr = [];
  const [adjacentMinesData, setAdjacentMinesData] = useState([]);
  const adjacentMinesDataRef = useRef();
  adjacentMinesDataRef.current = adjacentMinesData;
  const [mineCountArr] = useState([]);
  let globalFlaggedBoxesArr;
  let timerToggle = false;
  
  /* The createGrid function helps in assigning IDs to each minesweeper box. */
  const createGrid = () => {
    let i = 1;
    while(i <= 64){
      gridBoxesArr.push(i);
      i++;
    }
  };

  /* The leftClickHandler function listens to the left mouse button clicks.
    * It assigns a smiling face emoji if the user has made a safe move.
    * It also prevents clicking errors using the if conditions.
    * It also calls the safeMove, triggerMines, setStartBoxesMineCount, setSafeMoveMineCount functions.
    * If the timerToggle is false it calls the startTimer function and then set the timerToggle to true.
  */
  const leftClickHandler = () => {
    document.addEventListener("click", (event) => {
      event.preventDefault();
      happyEmoji(event);

      if(event.target.className !== "container-fluid" && event.target.className !== "second-section" && event.target.nodeName !== "HTML" && !event.target.attributes.id){
        safeMove(event.target);
        triggerMines(mineLocationsArr, event);
        setStartBoxesMineCount(event.target);
        setSafeMoveMineCount(adjacentMinesDataRef, event.target);
      }

      !timerToggle && startTimer(event.target);
      timerToggle = true;
    });
  };

/* The rightClickHandler function listens to the right mouse button clicks.
  * It assigns a smiling face emoji if the user plants a flag.
  * If the user right clicks on a div with the className un-clicked-div the plantFlag function is called.
  * If the user right clicks on  a div with the className the removeFlag function is called.
  * It also calls the identifyFlaggedBoxes function.
*/
  const rightClickHandler = (event) => {
    event.preventDefault();
    happyEmoji(event);
    if(event.target.className === "un-clicked-div" ){
      plantFlag(event.target);
    }else if(event.target.className === "flag-square"){
      removeFlag(event.target);
    }
    identifyFlaggedBoxes(event.target);
  };

  /* The happyEmoji function assigns a smiling face with sunglasses emoji to the game message bar as long as the user has not lost the game. */
  const happyEmoji = (event) => {
    if(event.target.parentNode.parentNode.firstChild.firstChild.nextSibling.innerHTML !== "😓"){
      event.target.parentNode.parentNode.firstChild.firstChild.nextSibling.innerHTML = "😎";
    }
  };

  /* The startGame function is called by the onClick function in the JSX.
    It receives the box position and event.target as parameters.
    It sets the gameStarted state to true and calls the generateMineNumbers and setGameStartBoxes functions.
  */
  const startGame = (divNum, eventTarget) => {
    setGameStarted(true);
    generateMineNumbers(eventTarget);
    setGameStartBoxes(divNum, eventTarget);
  };

  /* The generateMineNumbers function receives the event.target object as a parameter. 
    * It generates 10 unique random numbers that will be the positions of the mines in the game.
    * It adds the random number to the mineLocationsArr and mineCountArr. The random number is not usually equal to the position of the box clicked and it is never repeated.
    * It also calls the leftClickHandler and the findNoneMineBoxes function.
  */
  const generateMineNumbers = (eventTarget) => {
    let i = 0;    
    while(i < 11){
      let randomNum = Math.floor(Math.random() * 64) + 1;
    
      if(mineLocationsArr.length === 0 && parseInt(eventTarget.attributes.custom_id.value) !== randomNum){
        mineLocationsArr.push(randomNum);
        mineCountArr.push(randomNum);
      }else if(mineLocationsArr.length > 0 && mineLocationsArr.length < 10){
        if(!mineLocationsArr.includes(randomNum) && parseInt(eventTarget.attributes.custom_id.value) !== randomNum){
          mineLocationsArr.push(randomNum);
          mineCountArr.push(randomNum);
        }
      }
      i++;
    }
    leftClickHandler();
    findNoneMineBoxes();
  }

  /* The findNoneMineBoxes function pushes all box IDs that are not mine locations and stores them in the noneMineBoxesArr variable.
    * After it executes the setAdjacentMineCount function is called.
  */
  const findNoneMineBoxes = () => {
    for(const mineLocation of mineLocationsArr){
      noneMineBoxesArr.length === 0 ? noneMineBoxesArr = gridBoxesArr.filter(gridBoxNum => gridBoxNum !== mineLocation) : noneMineBoxesArr = noneMineBoxesArr.filter(gridBoxNum => gridBoxNum !== mineLocation);
    }
    setAdjacentMineCount()
  };

  /* The setAdjacentMineCount function loops through all safe boxes and does the following:
    For each safe box a new Map object is created with the safe box position as the key and a value known as objVal with an initial value of zero.
    The first if condition increments the objVal of the Map object by 1 if the next box after the safe box is a mine. It also prevents increments for edge cases where the safe box is located on the furthest right of the games playing box.

    The second if condition increments the objVal of the Map object by 1 if the previous box is a mine. It also prevents increments for edge cases where the safe box is located on the furthest left of the games playing box.

    The third if condition increments the objVal of the Map object by 1 if the box under it is a mine.

    The fourth if condition increments the objVal of the Map object by 1 if the box above it is a mine.

    The fifth if condition increments the objVal of the Map object by 1 if the box on it's bottom right is a mine. It also prevents increments for edge cases where the safe box is located on the furthest right of the games playing box.

    The sixth if condition increments the objVal of the Map object by 1 if the box on it's top left is a mine. It also prevents increments for edge cases where the safe box is located on the furthest left of the games playing box.

    The seventh if condition increments the objVal of the Map object by 1 if the box on it's bottom left is a mine. It also prevents increments for edge cases where the safe box is located on the furthest left of the games playing box or safe box is located on the first box.

    The eighth if condition increments the objVal of the Map object by 1 if the box on it's top right is a mine. It also prevents increments for edge cases where the safe box is located on the furthest right of the games playing box.
  */
  const setAdjacentMineCount = () => {
    for(const noneMineBox of noneMineBoxesArr){
      const minesData = new Map();
      minesData.set(noneMineBox, {objVal: 0});
      for(const mineLocation of mineLocationsArr){
        if(noneMineBox !== 8 && noneMineBox !== 16 && noneMineBox !== 24 && noneMineBox !== 32 && noneMineBox !== 40 && noneMineBox !== 48 && noneMineBox !== 56 && noneMineBox !== 64 && noneMineBox + 1 === mineLocation) minesData.get(noneMineBox).objVal++;

        if(noneMineBox !== 9 && noneMineBox !== 17 && noneMineBox !== 25 && noneMineBox !== 33 && noneMineBox !== 41 && noneMineBox !== 49 && noneMineBox !== 57 && noneMineBox - 1 === mineLocation) minesData.get(noneMineBox).objVal++;

        if(noneMineBox + 8 === mineLocation) minesData.get(noneMineBox).objVal++;
        if(noneMineBox - 8 === mineLocation) minesData.get(noneMineBox).objVal++;

        if(noneMineBox !== 8 && noneMineBox !== 16 && noneMineBox !== 24 && noneMineBox !== 32 && noneMineBox !== 40 && noneMineBox !== 48 && noneMineBox !== 56 && noneMineBox !== 64 && noneMineBox + 9 === mineLocation) minesData.get(noneMineBox).objVal++;

        if(noneMineBox !== 9 && noneMineBox !== 17 && noneMineBox !== 25 && noneMineBox !== 33 && noneMineBox !== 41 && noneMineBox !== 49 && noneMineBox !== 57 && noneMineBox - 9 === mineLocation) minesData.get(noneMineBox).objVal++;
        
        if(noneMineBox !== 1 && noneMineBox !== 9 && noneMineBox !== 17 && noneMineBox !== 25 && noneMineBox !== 33 && noneMineBox !== 41 && noneMineBox !== 49 && noneMineBox !== 57 && noneMineBox + 7 === mineLocation) minesData.get(noneMineBox).objVal++;

        if(noneMineBox !== 8 && noneMineBox !== 16 && noneMineBox !== 24 && noneMineBox !== 32 && noneMineBox !== 40 && noneMineBox !== 48 && noneMineBox !== 56 && noneMineBox !== 64 && noneMineBox - 7 === mineLocation) minesData.get(noneMineBox).objVal++;
      }
      /* The Map object is then pushed into the adjacentMinesData array */
      setAdjacentMinesData(oldArray => [...oldArray, minesData]);
    }
  };

  /* The setGameStartBoxes function receives the box position and event.target as parameters.
    * A loop of all safe boxes is initiated.
    * I then assign 20 increment numbers that will be used to select the boxes that are cleared in the game's initializing click. I utilize the four corners positions of minesweepers playing box.
    * The first corner is the box on position one and its 20 increment numbers are found in numOneStarterBoxesArr.
    * The second corner is the box on position eight and its 20 increment numbers are found in numEightGreaterStarterBoxesArr and numEightLessStarterBoxesArr.
    * The third corner is the box on position fifty seven and its 20 increment numbers are found in numFiftySevenGreaterStarterBoxesArr and numFiftySevenLessStarterBoxesArr.
    * The fourth corner is the box on position sixty four and its 20 increment numbers are found in numSixtyFourStarterBoxes.
    * I then created a DRY function called styleStarterBoxes that receives a boolean, two arrays and and the box position number where the click occurred.
    * The styleStarterBoxes function assigns the safe-div class to safe-boxes that are in the provided positions of either divNumParam + arrItem or divNumParam - arrItem
    * I then call the styleStarterBoxes function with the parameters it requires. Where a parameter does not apply in some instance I pass undefined.
    * I create arrays that store the box positions of the upper left side, upper right, bottom left and bottom right of the box which I then loop passing their array items while calling the styleStarterBoxes function.
  */
  const setGameStartBoxes = (divNum, eventTarget) => {
    for(const noneMineBox of noneMineBoxesArr){

      const numOneStarterBoxesArr = [0, 1, 2, 3, 4, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 24, 25, 26, 27, 28];
      const numEightGreaterStarterBoxesArr = [0, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 20, 21, 22, 23, 24];
      const numEightLessStarterBoxesArr = [1, 2, 3, 4];
      const numFiftySevenGreaterStarterBoxesArr = [0, 1, 2, 3, 4];
      const numFiftySevenLessStarterBoxesArr = [24, 23, 22, 21, 20, 16, 15, 14, 13, 12, 8, 7, 6, 5, 4];
      const numSixtyFourStarterBoxes = [0, 28, 27, 26, 25, 24, 20, 19, 18, 17, 16, 12, 11, 10, 9, 8, 4, 3, 2, 1];

      const styleStarterBoxes = (compareDivNum, numStarterBoxArr, extraNumStarterBoxArr, divNumParam) => {
        if(compareDivNum){
          if(numStarterBoxArr){
            for(const arrItem of numStarterBoxArr){
              if(divNumParam + arrItem === noneMineBox){
                let selectedBox = eventTarget.parentNode.firstChild;
                let selectedBoxCustomId = parseInt(selectedBox.attributes.custom_id.value);
                while(selectedBoxCustomId !== divNumParam + arrItem){
                  selectedBox = selectedBox.nextSibling;
                  selectedBoxCustomId = parseInt(selectedBox.attributes.custom_id.value);
                }
                selectedBox.className = "safe-div"; 
              }
            }
          }
          
          if(extraNumStarterBoxArr){
            for(const arrItem of extraNumStarterBoxArr){
              if(divNumParam - arrItem === noneMineBox){
                let selectedBox = eventTarget.parentNode.firstChild;
                let selectedBoxCustomId = parseInt(selectedBox.attributes.custom_id.value);
                while(selectedBoxCustomId !== divNumParam - arrItem){
                  selectedBox = selectedBox.nextSibling;
                  selectedBoxCustomId = parseInt(selectedBox.attributes.custom_id.value);
                }
                selectedBox.className = "safe-div"; 
              }
            }
          }
        }   
      };

      styleStarterBoxes(divNum === 1, numOneStarterBoxesArr, undefined, divNum);

      const upperLeftBoxNums = [2, 3, 4, 9, 10, 11, 12, 17, 18, 19, 20, 25, 26, 27, 28];
      for(const arrItem of upperLeftBoxNums){
        styleStarterBoxes(divNum === arrItem, numOneStarterBoxesArr, undefined, divNum);        
      }

      styleStarterBoxes(divNum === 8, numEightGreaterStarterBoxesArr, numEightLessStarterBoxesArr, divNum);

      const upperRightBoxNums = [5, 6, 7, 13, 14, 15, 16, 21, 22, 23, 24, 29, 30, 31, 32];
      for(const arrItem of upperRightBoxNums){
        styleStarterBoxes(divNum === arrItem, numEightGreaterStarterBoxesArr, numEightLessStarterBoxesArr, divNum);
      }
      
      styleStarterBoxes(divNum === 57, numFiftySevenGreaterStarterBoxesArr, numFiftySevenLessStarterBoxesArr, divNum);

      const bottomLeftBoxNums = [33, 34, 35, 36, 41, 42, 43, 44, 49, 50, 51, 52, 58, 59, 60];
      for(const arrItem of bottomLeftBoxNums){
        styleStarterBoxes(divNum === arrItem, numFiftySevenGreaterStarterBoxesArr, numFiftySevenLessStarterBoxesArr, divNum);
      }

      styleStarterBoxes(divNum === 64, undefined, numSixtyFourStarterBoxes, divNum);

      const bottomRightBoxNums = [37, 38, 39, 40, 45, 46, 47, 48, 53, 54, 55, 56, 61, 62, 63];
      for(const arrItem of bottomRightBoxNums){
        styleStarterBoxes(divNum === arrItem, undefined, numSixtyFourStarterBoxes, divNum);
      }

    }
  }

  /* The triggerMines function is used to assign the landmine-div class to mine boxes that are left-clicked.
    * The mineLocationsArr is looped and the box number of the clicked box is compared to every mine location if any are equal then all the mine boxes are assigned a landmine-div className. This is achieved by iterating over all 64 boxes using a while loop checking if it is a mine box that is not flag then assigning the className.
  */
  const triggerMines = (mineLocationsArr, event) => {
    for(const mineLocation of mineLocationsArr){
      if(parseInt(event.target.attributes.custom_id.value) === mineLocation){
        for(const arrItem of mineLocationsArr){
          let sibling = event.target.parentNode.firstChild;
          while(sibling !== null){
            if(parseInt(sibling.attributes.custom_id.value) === arrItem ){
              if(sibling.className !== "flag-square"){
                sibling.className = "landmine-div";
                event.target.parentNode.parentNode.firstChild.firstChild.nextSibling.innerHTML = "😓";
              }
            }
            sibling = sibling.nextSibling;
          }      
        }
      }
    }
  };

  /* The setStartBoxesMineCount function is used to set the number of mines that surround the safe boxes that are revealed only when the game is initialized. It receives the event.target as a parameter. 
    * I first store the first of the 64 boxes in a variable called sibling.
    * I then initiate a loop that runs 64 times while checking if the class of the box in sibling is safe-div. If the condition is true it's position is extracted and used to identify where it's data on mine counts is in the array item of the adjacentMinesDataRef that is a Map object.
    * Once the data is identified I set the innerHTML to the objVal which is the mine count.
  */
  const setStartBoxesMineCount = (eventTarget) => {
    let sibling = eventTarget.parentNode.firstChild;
    for(let i = 1; i < 65; i++){
      if(sibling.className === "safe-div"){
        const boxPosition = parseInt(sibling.attributes.custom_id.value);
        for(const arrData of adjacentMinesDataRef.current){
          if(arrData.get(boxPosition) && arrData.get(boxPosition).objVal !== 0){
            sibling.innerHTML = arrData.get(boxPosition).objVal;
          }
        }
      }
      sibling = sibling.nextSibling;
    }
  };

  /* The setSafeMoveMineCount function is used to set the number of mines that surround the safe box that was left-clicked. It receives the event.target and adjacentMinesDataRef as a parameter. 
    * I first store position of the safe box that was clicked in the boxPosition variable.
    * I then initiate a loop of all safe box positions and in check if any position is similar to boxPosition.
    * If true I check if the className is safe div.
    * If still true I identify where it's data on mine counts is in the array item of the adjacentMinesDataRef with a loop.
    * Once the data is identified I set the innerHTML to the objVal which is the mine count.
  */
  const setSafeMoveMineCount = (adjacentMinesDataRef, eventTarget) => {
    const boxPosition = parseInt(eventTarget.attributes.custom_id.value);
    for(const noneMineBox of noneMineBoxesArr){
      if(boxPosition === noneMineBox){
        if(eventTarget.className === "safe-div"){
          for(const arrData of adjacentMinesDataRef.current){
            if(arrData.get(boxPosition) && arrData.get(boxPosition).objVal !== 0){
              eventTarget.innerHTML = arrData.get(boxPosition).objVal;
            }
          }
        }
      }
    }
  };

  /* The plant flag function calls the plantFlagOnMineBoxes, plantFlagOnUnClickedBoxes and changeDisplayedMineCount function.
    It also removes an item from the mineCountArr to ensure control of remaining mine counts as displayed on the player's screen.. */
  const plantFlag = (eventTarget) => {
    plantFlagOnMineBoxes(eventTarget);
    plantFlagOnUnClickedBoxes(eventTarget);
    mineCountArr.pop();
    changeDisplayedMineCount(eventTarget);
  };

  /* The plantFlagOnMineBoxes function is used to enable changing of the className of a mine box to flag-square that gives it a yellow color. */
  const plantFlagOnMineBoxes = (eventTarget) => {
    for(const mineLocation of mineLocationsArr){
      if(parseInt(eventTarget.attributes.custom_id.value) === mineLocation ){
        eventTarget.className = "flag-square";
      }
    }
  };

  /* The plantFlagOnUnClickedBoxes function is used to enable changing of the className of an unclicked box to flag-square that gives it a yellow color. */
  const plantFlagOnUnClickedBoxes = (eventTarget) => {
    eventTarget.className = "flag-square";
  };

  /* The removeFlag function is used to enable changing of the className of a yellow colored box to un-clicked-div
    It also pushes one to to the mineCountArr to ensure control of remaining mine counts as displayed on the player's screen. 
    I also calls the changeDisplayedMineCount function. */
  const removeFlag = (eventTarget) => {
    eventTarget.className = "un-clicked-div";
    if(mineLocationsArr.length > 0){
      mineCountArr.push(1);
    }
    changeDisplayedMineCount(eventTarget);
  };

  /* The changeDisplayedMineCount function is used to change the remaining mine count show to the user. It uses the length of the mineCountArr to achieve this. */
  const changeDisplayedMineCount = (eventTarget) => {
    eventTarget.parentNode.parentNode.firstChild.firstChild.innerHTML = mineCountArr.length;
  };

  /* The safeMove function is used to assign a left-clicked safe box the the className safe-div */
  const safeMove = (eventTarget) => {
    for(const noneMineBox of noneMineBoxesArr){
      if(parseInt(eventTarget.attributes.custom_id.value) === noneMineBox ){
        eventTarget.className = "safe-div";
      }  
    }
  };

  /* The identifyFlaggedBoxes function is used to store all flagged boxes (yellow in color).
    * I create an array where arr flagged boxes will be stored after every right-click.
    * I then store the first box in the minesweeper game in the selectedBox variable.
    * I then check if it is a fllaged box, if true it's position is pushed to the flaggedBoxesArr.
    * I repeat this on all minesweeper boxes using a while loop.
    * After this is completed the flaggedBoxesArr is copied to the globalFlaggedBoxesArr.
    * The notifyGameWon function is then called.
  */
  const identifyFlaggedBoxes = (eventTarget) => {
    const flaggedBoxesArr = [];
    let selectedBox = eventTarget.parentNode.firstChild;
    if(selectedBox.className === "flag-square"){
      flaggedBoxesArr.push(parseInt(selectedBox.attributes.custom_id.value))
    }

    let i = 1;
    while(i < 64){
      selectedBox = selectedBox.nextSibling;
      if(selectedBox.className === "flag-square"){
        flaggedBoxesArr.push(parseInt(selectedBox.attributes.custom_id.value))
      }
      i++;
    }
    globalFlaggedBoxesArr = flaggedBoxesArr;
    notifyGameWon(eventTarget);
  };

  /* The notifyGameWon function is used to first ensure a user has flagged the correct mine boxes if true it alerts the user that they have won the game.
  * This is achieved by using the ES6 every and include function to ensure the array items of mineLocationsArr and globalFlaggedBoxesArr are similar.
*/
  const notifyGameWon = (eventTarget) => {
    if(mineLocationsArr.length === globalFlaggedBoxesArr.length && mineLocationsArr.every(arrItem => globalFlaggedBoxesArr.includes(arrItem))){
      eventTarget.parentNode.parentNode.firstChild.firstChild.nextSibling.innerHTML = "😎";
      alert("You won!🥳 🙌🎉🥂🎈🎊");
    }
  };

  /* The startTimer function is used to enable the timer functionality the user sees once the game starts.
    * I set the initial seconds to zero.
    * I then create the setTime function that:
        * Increments the seconds
        * Sets the time in seconds by finding the remainder of the seconds divided by 60.
        * Sets the time in minutes by dividing the seconds by 60. 
*/
  const startTimer = (eventTarget) => {
    let seconds = 0;

    const setTime = () => {
      ++seconds;
      eventTarget.parentNode.parentNode.firstChild.firstChild.nextSibling.nextSibling.firstChild.nextSibling.nextSibling.innerHTML = addPrefix(seconds % 60);
      eventTarget.parentNode.parentNode.firstChild.firstChild.nextSibling.nextSibling.firstChild.innerHTML = addPrefix(parseInt(seconds / 60));
    };

    /* The addPrefix function is used to add a number zero prefix to the minutes or seconds when their value is lees than 10. */
    const addPrefix = (val) => {
      let valString = val + "";
      return valString.length < 2 ? "0" + valString : valString;      
    };

    /* The setInterval function is used to call the setTime function after every one second. */
    setInterval(setTime, 1000);
  };

  /* The createGrid function is used to partly initiate the game as it assign IDs to the games boxes. */
  createGrid();

  /* Below is the JSX of the minesweeper game.
    * The first section holds the JSX of the mine count, emoji and timer.
    * The second section is where the 64 boxes are rendered, each  box has
        * A custom_id and key which are their positions.
        * An onContextMenu event listener that handles the right clicks of the user and calls the rightClickHandler.
        * An onClick function that calls the startGame function if the gameStarted is false.
*/
  return(
    <>
      <section className="first-section text-center">
        <div className="mineCountDisplay">010</div>
        <div className="first-section-center-div">🙂</div>
        <div><span>00</span>:<span>00</span></div>
      </section>
      <br></br>
      <section className="second-section">
        {gridBoxesArr.map((gridBoxNum, index) => {
          return <div className="un-clicked-div" custom_id={gridBoxNum} key={gridBoxNum} onContextMenu={(event) => rightClickHandler(event)} onClick={(event) => !gameStarted && startGame(gridBoxNum, event.target)}></div>
        })}
      </section>
    </>
  );

};

export default GridTableComponent;

/* 
  REFERENCES
  ===========>
  * I learnt to listen to different mouse buttons at: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button 
  * I Learnt to use the useRef hook from https://stackoverflow.com/a/60643670/9497346
  *  Learnt to use every from https://stackoverflow.com/a/60407793/9497346 and https://sebhastian.com/javascript-array-equality/
  * Learnt to make countUp timer at: https://stackoverflow.com/a/5517836/9497346
*/