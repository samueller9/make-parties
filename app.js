
// Initialize express
const express = require('express');
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const models = require('./db/models');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const jwtExpress = require('express-jwt');
const jwt = require('jsonwebtoken');

const app = express();


// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');
// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: false }));
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))
app.use(cookieParser());

// app.use(jwtExpress({
//     secret:"AUTH-SECRET",
//     algorithms: ['HS256'],
//     credentialsRequired: true,
//     getToken: function fromHeaderOrQuerystring (req) {
//       if (req.cookies.mpJWT) {
//         // req.session.returnTo = null;
//         return req.cookies.mpJWT;
//       }
//       return null;
//     }
//   }).unless({ path: ['/', '/login', '/sign-up'] })
// );

app.use(function authenticateToken(req, res, next) {
  // Gather the jwt access token from the cookie
  const token = req.cookies.mpJWT;

  if (token) {
    jwt.verify(token, "AUTH-SECRET", (err, user) => {
      if (err) {
        console.log(err)
        // redirect to login if not logged in and trying to access a protected route
        res.redirect('/login')
      }
      req.user = user
      next(); // pass the execution off to whatever request the client intended
    })
  } else {
    next();
  }
});

app.use(function (req, res, next) {
  console.log("Req.User:", req.user);
  if (req.user) {
    models.User.findByPk(req.user.id).then(currentUser => {
      console.log("currentUser:",currentUser);
      res.locals.currentUser = currentUser;
      next();
    }).catch(err => {
      console.log(err);
    })
  } else {
    next();
  }
});

// app.use(cookieParser("ABCD"));
// const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 60) // 60 days
//
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   cookie: {expires: expiryDate },
//   store: sessionStore,
//   resave: false
// }));
// });

require('./controllers/events')(app, models);
require('./controllers/rsvps')(app, models);
require('./controllers/auth')(app, models);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App listening on port 3000!')
})
