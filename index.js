require("dotenv").config();

const express=require('express')
const mysql=require('mysql2')
const cors=require('cors')
const passport=require('passport')
const session=require('express-session')


let app=express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));





const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
  }) // ✅ Add this!
  
  db.connect((err)=>{
    if(err){
        console.log("error in connecting db",err)
    }
    else{
        console.log("successfully connected to db")
    }
  })
 


const googleStrategy = require('./googleStrategy');
googleStrategy(passport, db);
// session config
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

// passport middleware

app.use(passport.initialize());
app.use(passport.session());





// auth routes
// redirect user to google

app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}))

// google sends back data here

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:5173/dashboard",
    failureRedirect:"http://localhost:5173/login"
}))


// logout route

app.get("/auth/logout",(req,res)=>{
    req.logOut(()=>{
        res.redirect("http://localhost:5173")
    })
})


app.get("/auth/user", (req, res) => {
    if (req.user) {
      res.json(req.user); // Sends logged-in user's data (from session)
    } else {
      res.status(401).json({ message: "Not logged in" });
    }
  });

  app.get("/", (req, res) => {
    res.send("✅ Backend is up and running on Render!");
  })

const PORT=process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`server is Listening at ${PORT}`)
})