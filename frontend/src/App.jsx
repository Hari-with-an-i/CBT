import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './LandingPage'
import ToDo from './Components/Div'



function App() {

    return (    
    <Router>
        <Routes>
            <Route path='/' element={<Landingpage />}/>
            <Route path='/ToDo' element={<ToDo />}/>
        </Routes>
    </Router>        

    );
}

export default App;
