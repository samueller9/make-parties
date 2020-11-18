module.exports = (app, models) => {
  const jwt = require('jsonwebtoken');

function generateJWT(user) {
  const mpJWT = jwt.sign({ id: user.id,}, "AUTH-SECRET", { expiresIn: 60*60*24*60 });

  return mpJWT
}


app.get('/sign-up', (req, res) => {
  res.render('sign-up', {});
})
app.post('/sign-up', (req, res) => {
  console.log(req.body)
  models.User.create(req.body).then(user => {
    const mpJWT = generateJWT(user)

    res.cookie("mpJWT", mpJWT)

    res.redirect('/');
  }).catch((err) => {
    console.log(err)
  });
})





//Login
app.get('/login', (req, res) => {
  res.render('login');
})
app.post('/login', (req, res) => {
  models.User.create(req.body).then(login => {
    res.redirect(`/`);
  }).catch((err) => {
    console.log(err)
  });
})

}
