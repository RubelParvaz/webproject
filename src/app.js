var express = require('express');
var path = require('path');
var hbs = require('hbs');
var app = express();
var staticpath = path.join(__dirname, '../public');
var templatespath = path.join(__dirname, '../templates/views');
var partialspath = path.join(__dirname, '../templates/partials');
app.use(express.static(staticpath));
app.set('view engine', 'hbs')
app.set('views', templatespath)
hbs.registerPartials(partialspath)
app.get('/', (req, res) => {
  const data = {
    title: 'Home page',
    message: 'My name is ',
    first_name: 'Rubel',
    last_name: 'Parvaz',
  };

  res.render('index', data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
