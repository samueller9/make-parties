module.exports = (app, models) => {

//Sign-up
app.get('/sign-up', (req, res) => {
  res.render('sign-up', {});
})
app.post('/sign-up', (req, res) => {
  models.Signup.create(req.body).then(signup => {
    res.redirect(`/`);
  }).catch((err) => {
    console.log(err)
  });
})



//Login
app.get('/login', (req, res) => {
  res.render('login');
})
app.post('/login', (req, res) => {
  models.Login.create(req.body).then(login => {
    res.redirect(`/`);
  }).catch((err) => {
    console.log(err)
  });
})

}
