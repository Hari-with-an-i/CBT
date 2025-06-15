import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './LandingPage'
import ToDo from './Components/Div'
import Login from './Login';
import Community from './Community';

function App() {

    return (    
    <Router>
        <Routes>
            <Route path='/' element={<Landingpage />}/>
            <Route path='/ToDo' element={<ToDo />}/>
            <Route path='/Login' element={<Login />}/>
            <Route path='/Community' element={<Community />}/>
        </Routes>
    </Router>        

    );
}

export default App;
