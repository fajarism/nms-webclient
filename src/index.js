// import 'babel-polyfill'
import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import {register} from "serviceWorker"

import indexRoutes from "routes/index.jsx";
import "assets/css/custom.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard.css?v=1.2.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import Dashboard from "layouts/Dashboard/Dashboard.jsx";
import Login from "views/Login/Login.jsx"
import LoginAdmin from "views/LoginAdmin/LoginAdmin.jsx"

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/admin"} component={LoginAdmin} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/"} component={Dashboard} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
register();
