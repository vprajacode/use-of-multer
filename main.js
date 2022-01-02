//imports
require("dotenv").config();
require("./db/conn");
const express =require("express");
const session =require("express-session");
const app =express();
//const PORT =process.env.PORT || 4000;

//database connection

// const db =mongoose.onnection;

// // db.on("error",(error)=>{console.log(error)});
//  db.once("open",()=>{console.log("database connection successful")});

//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(
    session({
        secret:"my secret key",
        saveUninitialized:true,
        resave:false

    })
);
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
});
app.use(express.static('uploads'));
//set template engine
app.set("view engine","ejs");



// app.get("/",(req,res)=>{
//     res.send("welcome to nodejs");
// });
//routes
app.use("",require("./routes/routes"));

// app.set('port', process.env.PORT || 3000);
// var server = app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + server.address().port);
//   console.log('Server started at http://localhost:3000');
// });

app.listen(3000,()=>{
    console.log('Server started at http://localhost:3000');
});
