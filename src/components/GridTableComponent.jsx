/* I learnt to listen to different mouse buttons at: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button */
import { useState } from "react";
import "./GridTableComponent.css";

const GridTableComponent = () => {

  const [gameStarted, setGameStarted] = useState(false)
  const gridBoxesArr = [];
  const mineLocationsArr = []; 
  
  const createGrid = () => {
    let i = 1;
    while(i <= 64){
      gridBoxesArr.push(i);
      i++;
    }
  };

  const startGame = (divNum, eventTarget) => {
    setGameStarted(true);
    generateMineNumbers(eventTarget);
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
    let noneMineBoxes = [];
    for(const mineLocation of mineLocationsArr){
      noneMineBoxes.length === 0 ? noneMineBoxes = gridBoxesArr.filter(gridBoxNum => gridBoxNum !== mineLocation) : noneMineBoxes = noneMineBoxes.filter(gridBoxNum => gridBoxNum !== mineLocation);
    }
    // setAdjacentMineCount()
  };

  const setAdjacentMineCount = () => {
    
  };

  createGrid();

  return(
    <section className="second-section">
      {gridBoxesArr.map((gridBoxNum, index) => {
        return <div className="un-clicked-div" custom_id={gridBoxNum} key={gridBoxNum} onClick={(event) => !gameStarted && startGame(gridBoxNum, event.target)}></div>
      })}
    </section>
  );

};

export default GridTableComponent;