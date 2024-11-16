const express = require("express")
const {engine} = require("express-handlebars"); //for handling engines
const bodyParser = require("body-parser"); 
const mysql = require("mysql");

require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

//parsing middleware, eenables passing json data through a form
//parse applicatin/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//Parse application json
app.use(bodyParser.json());

//setting up static files, such as the files you might want to add to your frontend such as custom css files, custome javasctipt files or having easy access to your images
app.use(express.static('public'));

//setting up templating engines using handleBars
app.engine("hbs", engine({extname: ".hbs"}));
app.set('view engine',"hbs");

//connection Pool - to sql
// console.log("Host:", process.env.DB_HOST);
// console.log("User:", process.env.DB_USER);
// console.log("Database:", process.env.DB_NAME);

const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

//CONNECT TO DB
 pool.getConnection((err, connection) => { 
//     if(err) throw err; // not connected
//     console.log('Connected as ID', + connection.threadId);
if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
}
console.log("Connected to MySQL database!");
connection.release(); // Release the connection back to the pool
 })

//render page i.e route
const userRouter = require('./server/routes/routes')
app.use('/', userRouter);
// app.get('', (req, res) => {
//     res.render('home')
// })

app.listen(port,()=> console.log(`app listening on port ${port}`));