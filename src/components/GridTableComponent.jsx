/* I learnt to listen to different mouse buttons at: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button */
import { useState, useRef } from "react";
import "./GridTableComponent.css";

const GridTableComponent = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const gridBoxesArr = [];
  const [mineLocationsArr] = useState([]);
  let noneMineBoxesArr = [];
  const [adjacentMinesData, setAdjacentMinesData] = useState([]);
  /* Learnt to use the useRef hook from https://stackoverflow.com/a/60643670/9497346 */
  const adjacentMinesDataRef = useRef();
  adjacentMinesDataRef.current = adjacentMinesData;
  const [mineCountArr] = useState([]);
  let globalFlaggedBoxesArr;
  let timerToggle = false;
  
  const createGrid = () => {
    let i = 1;
    while(i <= 64){
      gridBoxesArr.push(i);
      i++;
    }
  };

  const leftClickHandler = () => {
    document.addEventListener("click", (event) => {
      event.preventDefault();
      if(event.target.className !== "container-fluid" && event.target.className !== "second-section" && event.target.nodeName !== "HTML" && !event.target.attributes.id){
        safeMove(event.target);
        console.log(`😜35`, event);
        triggerMines(mineLocationsArr, event);
        setStartBoxesMineCount(event.target);
        setSafeMoveMineCount(adjacentMinesDataRef, event.target);
      }
      !timerToggle && startTimer(event.target);
      timerToggle = true;
    });
  };

  const rightClickHandler = (event) => {
    event.preventDefault();
    if(event.target.className === "un-clicked-div" ){
      plantFlag(event.target);
    }else if(event.target.className === "flag-square"){
      removeFlag(event.target);
    }
    identifyFlaggedBoxes(event.target);
  };

  const startGame = (divNum, eventTarget) => {
    setGameStarted(true);
    generateMineNumbers(eventTarget);
    setGameStartBoxes(divNum, eventTarget);
  };

  const generateMineNumbers = (eventTarget) => {
    let i = 0;    
    while(i < 11){
      let randomNum = Math.floor(Math.random() * 64) + 1;
    
      if(mineLocationsArr.length === 0){
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

  const findNoneMineBoxes = () => {
    for(const mineLocation of mineLocationsArr){
      noneMineBoxesArr.length === 0 ? noneMineBoxesArr = gridBoxesArr.filter(gridBoxNum => gridBoxNum !== mineLocation) : noneMineBoxesArr = noneMineBoxesArr.filter(gridBoxNum => gridBoxNum !== mineLocation);
    }
    setAdjacentMineCount()
  };

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
      setAdjacentMinesData(oldArray => [...oldArray, minesData]);
    }
  };

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

  const triggerMines = (mineLocationsArr, event) => {
    for(const mineLocation of mineLocationsArr){
      if(parseInt(event.target.attributes.custom_id.value) === mineLocation){
        for(const arrItem of mineLocationsArr){
          let sibling = event.target.parentNode.firstChild;
          while(sibling !== null){
            if(parseInt(sibling.attributes.custom_id.value) === arrItem ){
              if(sibling.className !== "flag-square"){
                sibling.className = "second-landmine-div";
              }
            }
            sibling = sibling.nextSibling;
          }      
        }
      }
    }
  };

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

  const plantFlag = (eventTarget) => {
    plantFlagOnMineBoxes(eventTarget);
    plantFlagOnUnClickedBoxes(eventTarget);
    mineCountArr.pop();
    changeDisplayedMineCount(eventTarget);
  };

  const plantFlagOnMineBoxes = (eventTarget) => {
    for(const mineLocation of mineLocationsArr){
      if(parseInt(eventTarget.attributes.custom_id.value) === mineLocation ){
        eventTarget.className = "flag-square";
      }
    }
  };

  const plantFlagOnUnClickedBoxes = (eventTarget) => {
    eventTarget.className = "flag-square";
  };

  const removeFlag = (eventTarget) => {
    eventTarget.className = "un-clicked-div";
    if(mineLocationsArr.length > 0){
      mineCountArr.push(1);
    }
    changeDisplayedMineCount(eventTarget);
  };

  const changeDisplayedMineCount = (eventTarget) => {
    eventTarget.parentNode.parentNode.firstChild.firstChild.innerHTML = mineCountArr.length;
  };

  const safeMove = (eventTarget) => {
    for(const noneMineBox of noneMineBoxesArr){
      if(parseInt(eventTarget.attributes.custom_id.value) === noneMineBox ){
        eventTarget.className = "safe-div";
      }  
    }
  };

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
    console.log(`😜278`, globalFlaggedBoxesArr);
    console.log(`😜279`, mineLocationsArr);
    notifyGameWon(eventTarget);
  };

  const notifyGameWon = (eventTarget) => {
    /* Learnt to use every from https://stackoverflow.com/a/60407793/9497346 and https://sebhastian.com/javascript-array-equality/*/
    if(mineLocationsArr.length === globalFlaggedBoxesArr.length && mineLocationsArr.every(arrItem => globalFlaggedBoxesArr.includes(arrItem))){
      eventTarget.parentNode.parentNode.firstChild.firstChild.nextSibling.innerHTML = "😎";
      alert("You won!🥳 🙌🎉🥂🎈🎊");
    }
  };

  const startTimer = (eventTarget) => {
    /* Learnt to make countUp timer at: https://stackoverflow.com/a/5517836/9497346 */
    let seconds = 0;

    const setTime = () => {
      ++seconds;
      eventTarget.parentNode.parentNode.firstChild.firstChild.nextSibling.nextSibling.firstChild.nextSibling.nextSibling.innerHTML = addPrefix(seconds % 60);
      eventTarget.parentNode.parentNode.firstChild.firstChild.nextSibling.nextSibling.firstChild.innerHTML = addPrefix(parseInt(seconds / 60));
    };

    const addPrefix = (val) => {
      let valString = val + "";
      return valString.length < 2 ? "0" + valString : valString;
      
    };

    setInterval(setTime, 1000);
  };

  createGrid();

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