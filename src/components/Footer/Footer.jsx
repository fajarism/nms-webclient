import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <nav className="pull-left">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              {/* <li>
                <a href="#pablo">Company</a>
              </li>
              <li>
                <a href="#pablo">Portfolio</a>
              </li>
              <li>
                <a href="#pablo">Blog</a>
              </li> */}
            </ul>
          </nav>
          <p className="copyright pull-right">
            created by devteam@B201crew. powered by <a href="https://www.creative-tim.com/">creative-tim</a>{" "}
            &copy; {new Date().getFullYear()}
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
