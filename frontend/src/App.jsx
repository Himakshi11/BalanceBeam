import React from 'react'
import './App.css'
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"
import Home from "./pages/Dashboard/Home"
import Income from "./pages/Dashboard/Income"
import Expense from "./pages/Dashboard/Expense"
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom"
import UserProvider from './context/UserContext'
import {Toaster} from 'react-hot-toast'
import AllTransactions  from './pages/Dashboard/AllTransactions'
function App() {
  const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};
  return (
    <div className=''>
      <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Root/>}/>
        <Route path="/login" exact element={<Login/>}/>
        <Route path="/signUp" exact element={<SignUp/>}/>
        <Route path="/dashboard" exact element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/income" exact element={<ProtectedRoute><Income/></ProtectedRoute>}/>
        <Route path="/expense" exact element={<ProtectedRoute><Expense/></ProtectedRoute>}/>
        <Route path="/transactions" exact element={<ProtectedRoute><AllTransactions/></ProtectedRoute>}/>
      </Routes>
    </Router>
    <Toaster toastOptions={{
      className:"",
      style:{fontSize:'13px'},
    }}/>
    </UserProvider>
    </div>
  )
}

export default App

const Root=()=>{
  const isAuthentication=!!localStorage.getItem("token")
  return isAuthentication?(
  <Navigate to="/dashboard"/>
  ):(<Navigate to="/login"/>);
}
