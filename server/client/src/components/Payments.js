import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";

class Payments extends Component {
   render() {
      return (
         <StripeCheckout
            // Ammount of money that we want to request from the user
            amount={}
         />
      );
   }
}

export default Payments;
