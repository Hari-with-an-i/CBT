import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './LandingPage'
import ToDo from './Components/Div'
import Login from './Login';
import Dashboard from './Dashboard';

function App() {

    return (    
    <Router>
        <Routes>
            <Route path='/' element={<Landingpage />}/>
            <Route path='/ToDo' element={<ToDo />}/>
            <Route path='/Login' element={<Login />}/>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/communities/search" element={<div>Search Communities</div>} />
        </Routes>
    </Router>        

    );
}

export default App;
