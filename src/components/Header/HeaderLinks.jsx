import React, { Component } from "react";
import { Image, NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import defaultAvatar from "assets/img/faces/face-0.jpg"
import {withRouter} from "react-router-dom"
import swal from "sweetalert"
import {storage} from "variables/Variables"
import { loadavg } from "os";

class HeaderLinks extends Component {
  constructor(props) {
    super(props)

    this.onSettingClicked = this.onSettingClicked.bind(this)
    this.onLogoutClicked = this.onLogoutClicked.bind(this)

    this.state = {
      username : "Lorem Ipsum Dolor Sit Amet"
    }
  }

  componentDidMount() {
    if(localStorage.getItem(storage.fullname)) {
      this.setState({
        username : localStorage.getItem(storage.fullname)
      })  
    }
  }

  onSettingClicked() {
    this.props.history.push("/setting")
  }

  onLogoutClicked() {
    swal({
      title : "Are you sure you want to logout?",
      text : "Any unsaved changes will not be applied. You have to log in again to use this website",
      icon : "warning",
      buttons : true,
      dangerMode : true,
    })
      .then((positiveButton) => {
        if(positiveButton) {
          localStorage.setItem(storage.session, "")
          localStorage.setItem(storage.profpic, "")
          localStorage.setItem(storage.level, "")
          localStorage.setItem(storage.fullname, "")
          localStorage.setItem(storage.id, "")
          localStorage.setItem(storage.created_at, "")
          localStorage.setItem(storage.updated_at, "")
          localStorage.setItem(storage.nik, "")
          localStorage.setItem("refreshtime", "")

          if(localStorage.getItem(storage.fromadmin)) {
            localStorage.setItem(storage.fromadmin, "")
            this.props.history.push({
              pathname : "/admin",
              state : {
                  from : this.props.location.pathname
              }
            }) 
          } else {
            localStorage.setItem(storage.fromadmin, "")
            this.props.history.push({
              pathname : "/login",
              state : {
                  from : this.props.location.pathname
              }
            }) 
          }
          
      }})
  }

  render() {
    let imageSrc = localStorage.getItem(storage.profpic) === "null" ? defaultAvatar : localStorage.getItem(storage.profpic)  
    const notification = (
      <div id="user-badge">
        {/* <i className="fa fa-globe" /> */}
        <Image src={imageSrc} circle style={{"width":"40px", "height":"40px"}}/>
        <b className="caret" />
        <p className="hidden-lg hidden-md" id="username">
        {this.state.username.length > 12 ? this.state.username.substring(0,15) + "..." : this.state.username}</p>
      </div>
    );
    return (
      <div>
        {/* <Nav>
          <NavItem eventKey={1} href="#">
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem>
          <NavDropdown
            eventKey={2}
            title={notification}
            noCaret
            id="basic-nav-dropdown"
          >
            <MenuItem eventKey={2.1}>Notification 1</MenuItem>
            <MenuItem eventKey={2.2}>Notification 2</MenuItem>
            <MenuItem eventKey={2.3}>Notification 3</MenuItem>
            <MenuItem eventKey={2.4}>Notification 4</MenuItem>
            <MenuItem eventKey={2.5}>Another notifications</MenuItem>
          </NavDropdown>
          <NavItem eventKey={3} href="#">
            <i className="fa fa-search" />
            <p className="hidden-lg hidden-md">Search</p>
          </NavItem>
        </Nav> */}
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            Hello <strong className="hidden-xs hidden-sm">{this.state.username}</strong>
          </NavItem>
          <NavDropdown
            eventKey={2}
            title={notification}
            noCaret
            id="basic-nav-dropdown"
          >
          
            <MenuItem onClick={this.onSettingClicked}><i className="marginright-10px pe-7s-tools" />Settings</MenuItem>
            
            <MenuItem onClick={this.onLogoutClicked}><i className="marginright-10px pe-7s-power" />Logout</MenuItem>
          </NavDropdown>
          {/* <NavDropdown
            eventKey={2}
            title="Dropdown"
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1}>Action</MenuItem>
            <MenuItem eventKey={2.2}>Another action</MenuItem>
            <MenuItem eventKey={2.3}>Something</MenuItem>
            <MenuItem eventKey={2.4}>Another action</MenuItem>
            <MenuItem eventKey={2.5}>Something</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={2.5}>Separated link</MenuItem>
          </NavDropdown> */}
        </Nav>
      </div>
    );
  }
}

export default withRouter(HeaderLinks);
