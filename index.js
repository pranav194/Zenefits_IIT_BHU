const express = require('express');
const path  = require('path');

const app = express();

const orgRoute = require('./routes/orgchart');
const depRoute = require('./routes/listDep');
const locRoute = require('./routes/loc');


app.set("view engine", "ejs");

app.use (express.static(path.join(__dirname,'public')));



app.get('/',(req,res)=>{
    res.render('index.ejs');
});

app.use('/org',orgRoute);
app.use('/listofdep', depRoute);
app.use('/loc',locRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));

/****************************
 * task done by Pranav Gupta*
 * Roll no - 17045067       * 
 * **************************/