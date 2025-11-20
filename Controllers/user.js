const user = require("../models/user");

module.exports.renderSignupForm= (req, res) => {
    res.render("users/signup.ejs");
};


module.exports.signup = async (req, res) => {

    try{
   let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerredUser = await user.register(newUser, password);
    console.log(registerredUser);
    req.login(registereduser, (err)=>{
        if(err){
            return next(err);
                req.flash("success", "welcome to wanderlust!");
    res.redirect("/listings");
        }
    })

    }catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
 

};


module.exports.renderLoginForm=(req,res)=> {
    res.render("users/login.ejs");
     
 };

module.exports.login = async(req,res)=>{
res.flash("success", "welcome back to wanderlust!");
let redirectUrl = res.local.redirect||"/listings"
res.redirect("/req.locals.redirectUrl");
 };

 module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if (err) {
            return next( err );
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
 };