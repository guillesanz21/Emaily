import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";

// To test this, we need to provide the number 4242 4242 4242 4242 as card number

class Payments extends Component {
   render() {
      return (
         <StripeCheckout
            // Ammount of money that we want to request from the user. The default currency is US Dollars.
            amount={500} // Give me 5 Dollar (500 cents)
            // Once we sent details from the form to Stripe, Stripe sends back a token representing the charge. Then, this prop
            // represents the callback function that will take care of the token
            token={(token) => console.log(token)}
            // The publishable key of the Stripe API
            stripeKey={process.env.REACT_APP_STRIPE_KEY}
         />
      );
   }
}

export default Payments;
