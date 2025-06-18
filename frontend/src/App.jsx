import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landingpage from './LandingPage'
import ToDo from './Components/Div'
import Login from './Login';
import Dashboard from './Dashboard';
import Community from './Community';
import Navbar from './Navbar.jsx'
import CommunityCreate from './CommunityCreate.jsx';
import CommunitySearch from './CommunitySearch.jsx';
import CommunityDashboard from './CommunityDashboard.jsx';

function App() {

    return (    
    <Router>
        <Routes>
            <Route path='/' element={<Landingpage />}/>
            <Route path='/ToDo' element={<ToDo />}/>
            <Route path='/Login' element={<Login />}/>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/communities/search" element={<CommunitySearch />} />
            <Route path='/Community' element={<Community />}/>
            <Route path='/Navbar' element={<Navbar />}/>
            <Route path='/communities/create' element={<CommunityCreate />} />
            <Route path='/communities/dashboard' element={<CommunityDashboard />} />
            <Route path='/tasks' element={<div>View All Tasks</div>} />
            <Route path='/profile' element={<div>Profile</div>} />
            
        </Routes>
    </Router>        

    );
}

export default App;
