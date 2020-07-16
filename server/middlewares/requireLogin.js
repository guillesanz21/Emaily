module.exports = (req, res, next) => {
   if (!req.user) {
      return res.status(401).send({ error: "You must log in!" });
      // Doesn't pass to the next middleware, since there is an error with the authorization
   }
   // OK, you are logged in, therefore you can continue
   next();
};
