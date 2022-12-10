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
import Transactions from './components/Dashboard/Transactions';
import User from './components/Dashboard/User';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="fiuber-backoffice-ui/" element={<Login />} />
          <Route exact path="fiuber-backoffice-ui/logout" element={<Logout />} />
          <Route exact path="fiuber-backoffice-ui/register" element={<Register />} />
          <Route exact path="fiuber-backoffice-ui/reset" element={<Reset />} />
          <Route exact path="fiuber-backoffice-ui/profile" element={<Profile />} />
          <Route exact path='fiuber-backoffice-ui/dashboard' element={<Dashboard/>}/>
          <Route exact path='fiuber-backoffice-ui/admins' element={<Admins/>}/>
          <Route exact path='fiuber-backoffice-ui/rules' element={<Rules/>}/>
          <Route exact path='fiuber-backoffice-ui/transactions' element={<Transactions/>}/>
          <Route exact path='fiuber-backoffice-ui/users/:userId' element={<User/>}/>
          <Route exact path='fiuber-backoffice-ui/unauthorized' element={<Unauthorized/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
