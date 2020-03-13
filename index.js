const express = require('express');
const path  = require('path');
const bodyParser 	 = require('body-parser');
// const http 			 = require('http');
const app = express();

const orgRoute = require('./routes/orgchart');




// app.use(express.json);
// app.use(bodyParser.json());
app.set("view engine", "ejs");
// app.use(express.urlencoded({extended: false}));
app.use (express.static(path.join(__dirname,'public')));



app.get('/',(req,res)=>{
    res.render('index.ejs');
});

app.use('/zenefits/org',orgRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));