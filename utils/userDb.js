var connectionDB = require('../utils/connectionDB');
var sessions = require('express-session');
var User = require('../models/user');
var userDB = require('../models/user_schema');


let userdata = [
	{
        user_ID:"Riemann1191",
        first_name:"Bernhard",
        last_name:"Riemann",
        email:"riemann@gmail.com",
        address:"9393 UT Drive",
        city:"charlotte",
        state:"NC",
        zipcode:28262,
        country:"USA"
       

    },
    {
        user_ID:"Neil19",
        first_name:"Neils",
        last_name:"Bohr",
        email:"bohr@gmail.com",
        address:"9353 UT Drive",
        city:"charlotte",
        state:"NC",
        zipcode:28262,
        country:"USA"
        

    },
]

async function getusers (){
//     let users = [];
//     userdata.forEach(function(item){
//        var user = new User(userdata["user_ID"],userdata["first_name"],
//                             userdata["last_name"],userdata["email"],userdata["address"],
//                             userdata["city"],userdata["state"],userdata["zip"],userdata["country"]);
//        users.push(user)
//     });
//     return users;
    let users;
    try{
         users = await userDB.user.find({}).lean()
         console.log(users,"plplp");
         return users;
    }
    catch(err){
        return;
    }
};

async function getusersID(user_ID){
    try{
         users = await userDB.user.find({user_ID:user_ID}).lean()
         console.log(users);
         return users;
    }
    catch(err){
        return;
    }

}

async function getusersbyEmail(email){
    try{
         users = await userDB.user.find({email:email}).lean()
         console.log(users);
         return users;
    }
    catch(err){
        return;
    }

}
async function InsertNewUser(User){
    console.log(User,"ooohjkb");
    
    try{
        var users = userDB.user({user_ID:User.username,first_name:User.firstname,last_name:User.lastname,
        email:User.email,address:User.address,city:User.city,state:User.state,zipcode:User.zipcode,country:User.country});
        var new_user = await users.save();
         
         console.log("hghghg",new_user);
         return new_user;
    }
    catch(err){
        console.log("qqqq",err);
        return;
    }

}

module.exports.userdata = userdata;
module.exports.getusers = getusers;
module.exports.getusersID = getusersID;
module.exports.getusersbyEmail = getusersbyEmail;
module.exports.InsertNewUser = InsertNewUser;