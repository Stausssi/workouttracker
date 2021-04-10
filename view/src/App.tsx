import {Route,BrowserRouter} from 'react-router-dom'
import Homepage from './Homepage';
import Second from './Second';
import Login from './Login';
import Profil from './Profil'
import Charts from './Charts'
import Calendar from './FullCalendar'
import './css/App.css';
import "bulma"
import 'bulma-extensions/dist/css/bulma-extensions.min.css'

//Define all paths for pages inside of the React App and display components depending on URL

export const App = () =>
<BrowserRouter>         
<div className="App"> 
    <div className="children">
        <Route exact path="/" component={Homepage} />
        <Route exact path="/Second" component={Second} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Profil" component={Profil} />
        <Route exact path="/Demo" component={Calendar} />
        <Route exact path="/Charts" component={Charts} />
    </div>
</div>
</BrowserRouter>;

export default App;

