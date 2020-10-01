
// Initialize express
const express = require('express');
const Handlebars = require("handlebars");
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const models = require('./db/models');
const methodOverride = require('method-override')

const app = express();
require('./controllers/events')(app, models);

// Use "main" as our default layout
app.engine('handlebars', exphbs({ defaultLayout: 'main', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
// Use handlebars to render
app.set('view engine', 'handlebars');
// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App listening on port 3000!')
})
