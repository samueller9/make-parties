
// Initialize express
const express = require('express');
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const models = require('./db/models');
const methodOverride = require('method-override')
const jwtExpress = require('express-jwt');
const cookieParser = require('cookie-parser');

const app = express();


// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');
// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: false }));
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))
app.use(cookieParser)

app.use(jwtExpress({
    secret:"AUTH-SECRET",
    algorithms: ['HS256'],
    credentialsRequired: true,
    getToken: function fromHeaderOrQuerystring (req) {
      if (req.cookies.mpJWT) {
        req.session.returnTo = null;
        return req.cookies.mpJWT;
      }
      return null;
    }
  }).unless({ path: ['/login', '/sign-up'] })
);

app.use(req, res, next => {
  console.log(req.user)
  // if a valid JWT token is present
  if (req.user) {
    // Look up the user's record
    models.User.findByPk(req.user.id, (currentUser) => {
      // make the user object available in all controllers and templates
      res.locals.currentUser = currentUser;
    });
  };
  // next()
});



require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App listening on port 3000!')
})
