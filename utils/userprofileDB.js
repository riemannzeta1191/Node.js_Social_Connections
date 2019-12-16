var userprofile = require('../models/user_profile');
var UserConnection = require('../models/user_connection.js');
var connectionDB = require('./connectionDB.js');
var userconnectionDB = require('../models/user_connections_schema');




async function getUserProfile(userId){
  let userconnection;
   try{
    userconnection = await userconnectionDB.userconnections.find({user_ID:userId}).lean()
    console.log("oooo",userconnection);
    return userconnection;
  }
  catch(err){
    return;
  }

};
// getUserProfile("CC_1");

 



module.exports.getUserProfile = getUserProfile;
 