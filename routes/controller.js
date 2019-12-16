var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connectionDB = require('../utils/connectionDB');
var user = require('../models/user');
var urlencodedParser= bodyParser.urlencoded({extended:false});

var userProfile = require('../models/user_profile');
var userdataDB = require('../utils/userDb');
var session = require('express-session');
var userprofileDB  = require('../utils/userprofileDB')
var userconnection = require('../models/user_connection');
var users = require('../models/user_schema');
var userlogin = require('../models/user_login');
var userconnDB = require('../models/user_connections_schema');
const { check,validationResult} = require('express-validator/check');

var bcrypt = require('bcryptjs');



router.get('/', function(req,resp){
   
    if (!(req.session.currentUserProfile === undefined)){

                 var userconnections = req.session.currentUserProfile.connection_list;

            resp.render('index',{data: userconnections ,user :req.session.theUser,session:req.session.login})
     }
    else{
        resp.render('index',{session:0});
    } 

});

router.get('/register', async function (res,resp){
  resp.render('register');
})

router.post('/register',[check('email').isEmail().withMessage("please provide a proper email"),
                   check('username').not().isEmpty().withMessage("username cannot be empty").matches(/^\w+( \w+)*$/).withMessage("username cannot have special characters"),
                   check('firstname').not().isEmpty().withMessage("firstname cannot be empty").matches(/^\w+( \w+)*$/).withMessage("firstname cannot have special characters"),
                   check('lastname').not().isEmpty().withMessage("lastname cannot be empty").matches(/^\w+( \w+)*$/).withMessage("lastname cannot have special characters"),
                   check('state').not().isEmpty().withMessage("state cannot be empty").matches(/^\w+( \w+)*$/).withMessage("state cannot have special characters"),
                   check('country').matches(/^\w+( \w+)*$/).withMessage("country cannot have special characters").not().isEmpty().withMessage("country cannot be empty"),
                   check('zipcode').isNumeric().withMessage("zipcode has to be numeric in nature")], async function (req,resp){
  register = {};
  register.username = req.body.username,
  register.firstname = req.body.firstname;
  register.lastname = req.body.lastname;
  register.email = req.body.email,
  register.address = req.body.address;
  register.city = req.body.city;
  register.state = req.body.state;
  register.zipcode = req.body.zipcode;
  register.country = req.body.country

   const errors = validationResult(req).errors;
   if(!(errors.length==0)) {
    console.log(errors);
      return resp.render("register_validation.ejs");
    }


  bcrypt.genSalt(10,function(err,salt){
  bcrypt.hash(req.body.password,salt,function(err,hash){
  const user = userlogin.userlogin({
            email:req.body.email,
            hash:hash
  }).save((err,response)=>{
    if (err)
      console.error(err);
  })
})
})

try{
  let connObj = await userdataDB.InsertNewUser(register);
}
  catch(err){
    console.error(err);
  }
  req.session.login = 0; 

  resp.render('success',{session :req.session.login});

});



router.get('/login',async function(req,res) 

    {
      res.render('login',{user :req.session.theUser,session :req.session.login});
    });

router.post('/login',[
  check('email').isEmail().withMessage("Invalid Email"),check('password').isLength({min:3}).withMessage("Invalid Password")], async function(req,resp){
  usrlogin = await userlogin.getusername(req.body.email);
  if (usrlogin==null){
    resp.render("email_does_not_exist");
  }
 
   const errors = validationResult(req).errors;
  if(!(errors.length==0)) {
      resp.render("login_err");
    }
  bcrypt.compare(req.body.password, usrlogin.hash,async function(err,result){
   

     if(result){
      rel = [];
      profileList = [];
      usrobj = await users.user.findOne({email:usrlogin.email})
     
       var userdata = await userconnDB.retrieveConnectionsbyUserID(usrobj.user_ID);
       
      var connections = await connectionDB.getConnections1();  
    
      for(let i=0;i<userdata.length;i++){

          for(let j=0;j<connections.length;j++){
            if(userdata[i].connection_ID==connections[j].connection_ID){
              profileList.push([connections[j]]);
              
            }

           }
             
      }
       for(let i=0;i<userdata.length;i++){

          for(let j=0;j<connections.length;j++){
            if(userdata[i].connection_ID==connections[j].connection_ID){
              connections[j].rsvp = userdata[i].rsvp;
              rel.push(connections[j])
            }

           }
             
      }
    
    
     var currentUser = req.session.theUser;
    
     req.session.theUser = usrobj;

   
     req.session.login = 1;
   var userId = req.session.theUser.user_ID;
 
      req.session.currentUserProfile = userdata;
      req.session.UserProfileList = profileList;
     
      return resp.render('profile',{data: profileList,user :req.session.theUser})
     } else {
     
      resp.render('login_err');
      return resp.status(400).send();
     }
})
})



router.get('/logout',function(req,res){
  req.session.login = 0;
  req.session.destroy();
 
 
  res.render('index',{session:0});

});


// route to display the connections page listing all connections

router.get('/connections', async function(req,resp){
    var categories = await getCategories();
    var res = await connectionDB.getConnections1();
   
  
    
    var data= {
        categories: categories,
        connections: res
    }
    // console.log("tt",data);
        return resp.render('connections', { data:data,session:req.session.login,user :req.session.theUser});

  
});




router.get('/about', function(req,resp){
	resp.render('about',{session:req.session.login,user :req.session.theUser});

});

// route to display the contact page

router.get('/contact', function(req,resp){

	resp.render('contact',{session: req.session.login,user :req.session.theUser});
});

// route to display the each connection detail if the 
// request connection_ID is present else display
// the connections page.

router.get('/connection/:connection_ID', async function(req, res) {
   
    var connection_ID = req.params.connection_ID;
   console.log(connection_ID);
   
    var connection = await connectionDB.getConnections_ID(connection_ID);

    if(connection==undefined)
  {
    var categories = await getCategories();
    var connectionData = await connectionDB.getConnections1();
    var data= {
        categories: categories,
        connections: connectionData
    }
    console.log(data,"pjk");
    res.render('connections', { data: data ,session:req.session.login ,user :req.session.theUser});
  }
  else{
     // console.log("iii",connection[0]);
    var data= connection;
 
    console.log("mn",data);
  
    res.render('connection', { data: data, session:req.session.login,user :req.session.theUser});
  }
});



router.get('/connections/*', async function(req, res) {
    if(req.session.theUser){
    var categories = await getCategories();
    var connectionData = await connectionDB.getConnections1();
    var data= {
        categories: categories,
        connections: connectionData
    }
    res.render('connections', { data: data,user :req.session.theUser,session,session:req.session.login });
  }
  else{
      res.redirect('/connections');
  }
});






var connections = [];
//code to get categories of each connection
 async function getCategories() {
    var data = await connectionDB.getConnections1();
    data.forEach(function (connection) {
        if(!connections.includes(connection.connection_topic)){
            connections.push(connection.connection_topic);
        }

    });
    return connections;
};

module.exports = router;