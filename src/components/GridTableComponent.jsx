/* I learnt to listen to different mouse buttons at: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button */
import { useState } from "react";
import "./GridTableComponent.css";

const GridTableComponent = () => {

  const [gameStarted, setGameStarted] = useState(false)
  const gridBoxesArr = [];
  const mineLocationsArr = [];
  let noneMineBoxesArr = [];
  const adjacentMinesData = [];
  
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
    for(const mineLocation of mineLocationsArr){
      noneMineBoxesArr.length === 0 ? noneMineBoxesArr = gridBoxesArr.filter(gridBoxNum => gridBoxNum !== mineLocation) : noneMineBoxesArr = noneMineBoxesArr.filter(gridBoxNum => gridBoxNum !== mineLocation);
    }
    setAdjacentMineCount()
  };

  const setAdjacentMineCount = () => {
    console.log(`😜64`, noneMineBoxesArr);
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
        
        if(noneMineBox !== 9 && noneMineBox !== 17 && noneMineBox !== 25 && noneMineBox !== 33 && noneMineBox !== 41 && noneMineBox !== 49 && noneMineBox !== 57 && noneMineBox + 7 === mineLocation) minesData.get(noneMineBox).objVal++;

        if(noneMineBox !== 8 && noneMineBox !== 16 && noneMineBox !== 24 && noneMineBox !== 32 && noneMineBox !== 40 && noneMineBox !== 48 && noneMineBox !== 56 && noneMineBox !== 64 && noneMineBox - 7 === mineLocation) minesData.get(noneMineBox).objVal++;
      }
      adjacentMinesData.push(minesData);
    }
    renderMineCount();
  };

  const renderMineCount = () => {
    for(const gridBoxNum of gridBoxesArr){
      for(const data of adjacentMinesData){
        if(data.get(gridBoxNum) && data.get(gridBoxNum).objVal !== 0) console.log(gridBoxNum + " => " + data.get(gridBoxNum).objVal);
      }
    }
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