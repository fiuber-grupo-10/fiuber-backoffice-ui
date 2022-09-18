import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://fi.uba.ar"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fiuber's Backoffice UI
        </a>
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <Button variant="text">Material Text</Button>
          <br></br>
          <Button variant="contained">Material Contained</Button>
          <br></br>
          <Button variant="outlined">Material Outlined</Button>
        </div>
      </header>
    </div>
  );
}

export default App;
