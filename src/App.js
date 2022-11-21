import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Reset from "./components/Auth/Reset";
import Dashboard from './components/Dashboard/Dashboard';
import Admins from './components/Dashboard/Admins';
import Profile from './components/Dashboard/Profile';
import Logout from './components/Auth/Logout';
import Unauthorized from './components/Auth/Unauthorized';
import Rules from './components/Dashboard/Rules';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/logout" element={<Logout />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path='/dashboard' element={<Dashboard/>}/>
          <Route exact path='/admins' element={<Admins/>}/>
          <Route exact path='/rules' element={<Rules/>}/>
          <Route exact path='/unauthorized' element={<Unauthorized/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
