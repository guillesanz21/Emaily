import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Payments from "./Payments";

class Header extends Component {
   renderContent() {
      switch (this.props.auth) {
         // When the page is rendering and still don't know if the user is logged in
         case null:
            return;
         // When the user isn't logged in
         case false:
            return (
               <li>
                  <a href="/auth/google">Login With Google</a>
               </li>
            );
         // When the user is logged in
         default:
            return (
               <React.Fragment>
                  <li key="1">
                     <Payments />
                  </li>
                  <li key="2" style={{ margin: "0 10px" }}>
                     Credits: {this.props.auth.credits}
                  </li>
                  <li key="3">
                     <a href="/api/logout">Logout</a>
                  </li>
               </React.Fragment>
            );
      }
   }

   render() {
      return (
         <nav>
            <div className="nav-wrapper">
               <Link
                  to={this.props.auth ? "/surveys" : "/"}
                  className="left brand-logo"
               >
                  Emaily
               </Link>
               <ul className="right">{this.renderContent()}</ul>
            </div>
         </nav>
      );
   }
}

/* function mapStateToProps (state) {
    return { auth: state.auth };
} */
// Refactoring the previous function
function mapStateToProps({ auth }) {
   return { auth };
}

export default connect(mapStateToProps)(Header);
