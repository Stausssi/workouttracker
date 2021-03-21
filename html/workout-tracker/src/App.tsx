import {Route,BrowserRouter} from 'react-router-dom'
import Homepage from './Homepage';
import Second from './Second';
import Login from './Login';
import Profil from './Profil'
import './css/App.css';
import "bulma"



export const App = () =>
<BrowserRouter>
<div className="App"> 
    <div className="children">
        <Route exact path="/" component={Homepage} />
        <Route exact path="/Second" component={Second} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Profil" component={Profil} />
    </div>
</div>
</BrowserRouter>;

export default App;

