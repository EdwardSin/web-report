import React, {Component} from 'react';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/font-awesome/all.css';
import './App.scss';
import Nav from './partial/Nav';


class App extends Component {
    render() {
        return (
            <div>
                <Nav/>
            </div>
        );
    }
}

export default App;
