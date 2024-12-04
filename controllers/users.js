const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req, res) =>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }else{
                req.flash("success", "Welcome to Restify!")
                res.redirect("/listings");
            }
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

module.exports.renderLogin = (req, res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req, res)=>{
    let { username , password } = req.body;
    req.flash("success", "Welcome to Restify!")
    let redirectUrl = res.locals.redirectUrl  || "/listings" // if res.locals.redirectUrl 
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Successfully logout!")
        res.redirect("/listings")
    })
}