/* I imported the Modal component from the react-bootstrap library
  I imported the styling of this component.
  I imported the useState hook from the react library.
  I created the GameOptionsComponent functional component.
*/
import Modal from "react-bootstrap/Modal";
import "./GameOptionsComponent.css";
import { useState } from "react";

const GameOptionsComponent = () => {

  /* I created a showModal state variable that enable the revealing and hiding of the react-bootstrap modal */
  const [showModal, setShowModal] = useState(false);

  /* Below is the JSX for the GameOptionsComponent. It uses react-bootstrap for it's modal. */
  return (
    <section className="first-section">
      <ul>
        <li><a href="#newgame" onClick={() => window.location.reload()}>New Game</a></li>
        <li><a href="#rules" onClick={() => setShowModal(true)}>Rules</a></li>
        <Modal show={showModal} scrollable={true} animation={false} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title >
              <h2 className="text-center">Minesweeper Rules</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5 className="text-center">Objective and basic concepts</h5>
            <p>The objective in Minesweeper is to find and mark all the mines hidden under the grey squares, in the shortest time possible. This is done by clicking on the squares to open them. Each square will have one of the following:</p>
            <p>1. A mine, and if you click on it you'll lose the game.</p>
            <p>2. A number, which tells you how many of its adjacent squares have mines in them.</p>
            <p>3. Nothing. In this case you know that none of the adjacent squares have mines, and they will be automatically opened as well.</p>
            <p>It is guaranteed that the first square you open won't contain a mine, so you can start by clicking any square. Often you'll hit on an empty square on the first try and then you'll open up a few adjacent squares as well, which makes it easier to continue. Then it's basically just looking at the numbers shown, and figuring out where the mines are.</p>
            <h5 className="text-center">Gameplay</h5>
            <p>There are essentially two actions you can take in Minesweeper:</p>
            <p>1. Open a square. This is done simply by left clicking on a square.</p>
            <p>2. Marking a square as a mine. This is done by right clicking on a square. The square will turn to color yellow.</p>
            <h5 className="text-center">Winning</h5>
            <p>You've won the game when you've opened all squares that don't contain a mine meaning the mines left will show zero, the game status will show a smiling emoji with sunglasses (😎) you will also be alerted.</p>
            <h5 className="text-center">Losing</h5>
            <p>You've lost the game when you click on a square with a mine and all mine boxes turn red. The game status will show a smiling emoji with a downcast sweaty face (😓).</p>
            <p className="text-center"><small>From <a href="https://cardgames.io/minesweeper/#rules">CARDGAMES.io</a></small></p>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
          </Modal.Footer>
        </Modal>
      </ul>
    </section>
  )
}

export default GameOptionsComponent

/* 
  REFERENCES
  ===========>
  * I got the minesweeper rules from: https://cardgames.io/minesweeper/#rules 
*/