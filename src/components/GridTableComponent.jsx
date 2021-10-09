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
      /* console.log(`😜27`, event);
      console.log(`😜27`, event.target.innerHTML); */
      safeMove(event.target);
      triggerMines(mineLocationsArr, event);
      setSafeMoveMineCount(adjacentMinesDataRef, event.target);
    });
  };

  const rightClickHandler = (event) => {
    event.preventDefault();
    plantFlag(event.target);
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
      }else if(mineLocationsArr.length > 0 && mineLocationsArr.length < 10){
        if(!mineLocationsArr.includes(randomNum) && parseInt(eventTarget.attributes.custom_id.value) !== randomNum){
          mineLocationsArr.push(randomNum);
        }
      }
      i++;
    }
    leftClickHandler();
    setMineStyles(mineLocationsArr, eventTarget);
  }

  const setMineStyles = (mineLocationsArr, eventTarget) => {
    for(const mineLocation of mineLocationsArr){
      let sibling = eventTarget.parentNode.firstChild;
      while(sibling !== null){
        if(parseInt(sibling.attributes.custom_id.value) === mineLocation ){
          sibling.className = "landmine-div";
        }
        sibling = sibling.nextSibling;
      }      
    }
    findNoneMineBoxes();
  };

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
    for(const mineLocation of mineLocationsArr){
      if(parseInt(eventTarget.attributes.custom_id.value) === mineLocation ){
        eventTarget.className = "flag-square";
      }
    }
  };

  const safeMove = (eventTarget) => {
    for(const noneMineBox of noneMineBoxesArr){
      if(parseInt(eventTarget.attributes.custom_id.value) === noneMineBox ){
        eventTarget.className = "safe-div";
      }  
    }
  };

  createGrid();

  return(
    <section className="second-section">
      {gridBoxesArr.map((gridBoxNum, index) => {
        return <div className="un-clicked-div" custom_id={gridBoxNum} key={gridBoxNum} onContextMenu={(event) => rightClickHandler(event)} onClick={(event) => !gameStarted && startGame(gridBoxNum, event.target)}></div>
      })}
    </section>
  );

};

export default GridTableComponent;