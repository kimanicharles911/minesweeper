/* I imported the GridTableComponent */
import './App.css';
import GridTableComponent from "./components/GridTableComponent.jsx";

function App() {
  /* Below is the JSX og the App component.
  The GridTableComponent is wrapped inside the main HTML tag */
  return (
    <main className="container-fluid">
      <GridTableComponent />      
    </main>
  );
}

export default App;
