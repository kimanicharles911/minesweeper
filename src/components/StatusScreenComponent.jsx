/* I imported the StatusScreenComponent style */
import "./StatusScreenComponent.css";

/* I created the StatusScreenComponent functional component */
const StatusScreenComponent = () => {

  /* The first section holds the JSX of the mine count, emoji and timer. */
  return (
    <section className="second-section text-center">
      <div className="mineCountDisplay">Mines left: <span>010</span></div>
      <div className="second-section-center-div">Game Status: <span>🙂</span></div>
      <div><span>Time: </span><span>00</span>:<span>00</span></div>
    </section>
  )
}

export default StatusScreenComponent
