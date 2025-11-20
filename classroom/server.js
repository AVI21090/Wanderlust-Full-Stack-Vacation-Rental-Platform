const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
/*const cookieparser = require("cookie-parser"); */
/*
app.use(cookieparser("secretcode"));

app.get("/getsignedcookies", (req,res) => {
    res.cookie("made-in", "India", {signed: True});
    res.send("signed cookie sent");
});
app.get("/verify",(req,res)=> {
    console.log(req.signedCookies);
    res.send("verified")
})

app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi,I am root!");
});

app.use("/users", users);
app.use("/posts",posts);
*/
const sessionoptions = {
    secret:"mysupersecretstring",
    resave: false,
saveUninitialized: true,
};

app.use(session(SessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.sucessMsg=req.flash("sucess");
    res.local.errorMsg = req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let{name="anonymous"} =req.query;
    req.session.name= name;
if(name==="anonymous"){
    req.flash("error","user not registered");

}
else {
    req.flash("sucess","user registered sucessfully!")
}
res.redirect("/hello")
});
app.get("/hello",(req,res)=>{
    res.render("page.ejs", {name:express.session.name, msg: req.flash("success")});
});

//app.get("/reqcount",(req,res)=>{
    // if(req.session.count) {
  //      req.session.count++; 
// } else{
   // req.session.count =1;
 //}

  //   res.send(`you send a request ${req.session.count} times`);
//});

//app.get("/test", (req,res)=>{
  //  res.send("test sucessful!");
// });
app.listen(3000,()=>{
    console.log("server is listening to 3000");
});