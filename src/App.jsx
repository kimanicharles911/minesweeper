/* I imported the GridTableComponent */
import './App.css';
import HeaderComponent from './components/HeaderComponent.jsx';
import GameOptionsComponent from './components/GameOptionsComponent.jsx';
import StatusScreenComponent from './components/StatusScreenComponent.jsx';
import GridTableComponent from "./components/GridTableComponent.jsx";

function App() {
  /* Below is the JSX og the App component.
  The GridTableComponent is wrapped inside the main HTML tag */
  return (
    <main className="container-fluid text-center">
      <HeaderComponent />
      <GameOptionsComponent />
      <br></br>
      <StatusScreenComponent/>
      <br></br>
      <GridTableComponent />      
    </main>
  );
}

export default App;
