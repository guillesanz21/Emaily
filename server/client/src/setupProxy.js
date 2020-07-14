// This will create a proxy that redirects from localhost:3000/XXXX (client) to localhost:5000/XXXX (server) when we
// are in dev mode.
// When we are in production, the react app server doesn't exists, so this will ONLY work in DEV MODE. In production,
// before we deploy our app to Heroku, we are going to build the react project, so it will become into a common front-end
// application.
// That's why we only need to setup the proxy for the dev mode.
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
   app.use(
      createProxyMiddleware(["/api", "/auth/google"], {
         target: "http://localhost:5000",
      })
   );
};
