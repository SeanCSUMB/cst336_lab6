const express = require("express");
const app = express();
const session = require('express-session');
const bcrypt = require("bcrypt");
const mysql = require("mysql");

app.set("view engine", "ejs");

app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));

app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("index");
});

app.post("/", async function(req, res){
    console.log(req.session.authenticated);
    let username = req.body.username;
    let password = req.body.password;
    //console.log("username:" + username);
    //console.log("password:" + password);
    //res.send("This is the root route using POST!");
    let hashedPwd = "$2a$10$06ofFgXJ9wysAOzQh0D0..RcDp1w/urY3qhO6VuUJL2c6tzAJPfj6";
    
    let passwordMatch = await checkPassword(password, hashedPwd);
    console.log("passwordMatch:" + passwordMatch);
    
    if (username == 'admin' && passwordMatch) {
        req.session.authenticated = true;
        req.session.save();
        //console.log(req.session.authenticated);
        res.render("welcome");
    }else{
        res.render("index", {"loginError":true});
    }
    //console.log(req.session.authenticated);
});

app.get("/myAccount", function(req, res){
    console.log(req.session.authenticated);
    if (req.session.authenticated){
        res.render("account");
    }else{
        res.redirect("/");
    }
    
});

function checkPassword(password, hashedValue){
    return new Promise( function(resolve, reject){
        bcrypt.compare(password, hashedValue, function(err, result){
            console.log("Result: " + result);
            resolve(result);
        })
    })
}

app.listen(8080, "0.0.0.0", function(){
    console.log("server running");
});