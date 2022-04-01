const express = require('express');
const path = require('path');
const app = express();
const mainRouter = require('./routes/index');

const port = 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(expressLayouts);

// public folder 
app.use(express.static(path.join(__dirname, 'public')));
app.use(mainRouter);


// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

module.exports = app;