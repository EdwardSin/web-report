import React, {Component} from 'react';
import '../css/Nav.css';
import {BrowserRouter as Router, Route, NavLink, Redirect, Switch} from "react-router-dom";
import TMS from '../template/TMS';
import Server from '../template/Server';
import Projector from "../template/Projector";

class Nav extends Component {

    render() {
        return (
            <Router>
                <div className={"header-nav"}>
                    <NavLink to="/tms" className={"btn btn-info mr-3"} activeClassName="selectedLink">
                        <span className={"fas fa-desktop mr-2"}></span>TMS</NavLink>
                    <NavLink to="/server" className={"btn btn-info ml-3 mr-3"}
                             activeClassName="selectedLink">
                        <span className={"fas fa-server mr-2"}></span>Server</NavLink>
                    <NavLink to="/projector" className={"btn btn-info ml-3 mr-3"}
                             activeClassName="selectedLink">
                        <span className={"fas fa-video mr-2"}></span>Projector</NavLink>
                </div>
                {/*<div style={{paddingTop: '61.5px'}}></div>*/}
                <Switch>
                    <Route path="/tms" component={TMS}/>
                    <Route path="/server" component={Server}/>
                    <Route path="/projector" component={Projector}/>
                    <Redirect to="/tms" />
                </Switch>
            </Router>
        );
    }

}

export default Nav;
