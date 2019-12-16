var mongoose  =  require('mongoose');
var connectionDB = require('../utils/connectionDB');
console.log(connectionDB)
// var Schema = mongoose.schema;
userConnectionsSchema = new mongoose.Schema({ //Schema created to handle userconnections data
  user_ID : {type : String, required: true},
  connection_ID :{type: String, required: true, ref:'connection'},
  rsvp : {type : String, required: true}
},{collection:'userconnections'});


userconnections = mongoose.model('userconnections',userConnectionsSchema);






async function updateRSVP(ConnectionId, userId, rsvp){ //get userProfile of given userid
  try{
  
    const conn = await connectionDB.getConnections_ID(ConnectionId);
 
    if (!conn) {
      console.error("ConnectionId not found");
      return 
    }
   
    let usrcon = await userconnections.findOneAndUpdate({connection_ID:ConnectionId, user_ID:userId}, {$set: {rsvp : rsvp}}); 
    // to update connection in UserConnections collections
  
    return usrcon;
  }
  catch(err){
    return;
  }
}


async function retrieveConnectionsbyUserID(user_ID){
  try{
    var connection = await userconnections.find({user_ID:user_ID}).lean();
    
    return connection;
  }
  catch(err){
    return
  }
}

async function retrieveConnectionsbyConID(connection_ID){
  try{
    var connection = await userconnections.find({connection_ID:connection_ID}).lean();
    
    return connection;
  }
  catch(err){
    return
  }
}

async function insertData(user_ID,connection_ID){
  try{
    var new_con = userconnections({user_ID:user_ID,connection_ID:connection_ID,rsvp:"Yes"});
    console.log(new_con,"okoko");
    connection = await new_con.save();
  
    return connection;
  }
  catch(err){
    return
  }
}
async function insertDataNo(user_ID,connection_ID){
  try{
    var new_con = userconnections({user_ID:user_ID,connection_ID:connection_ID,rsvp:"No"});
    console.log(new_con,"okoko");
    connection = await new_con.save();
  
    return connection;
  }
  catch(err){
    return
  }
}

async function insertDataMaybe(user_ID,connection_ID){
  try{
    var new_con = userconnections({user_ID:user_ID,connection_ID:connection_ID,rsvp:"Maybe"});
    console.log(new_con,"okoko");
    connection = await new_con.save();
  
    return connection;
  }
  catch(err){
    return
  }
}

async function deleteData(user_ID,connection_ID){
  try{
    // var new_con = userconnections({user_ID:user_ID,connection_ID:connection_ID});
    query ={user_ID:user_ID,connection_ID:connection_ID};
    await userconnections.deleteOne(query);
    return  
  }
  catch(err){
    return
  }
}

async function deleteDataByConnection_ID(connection){
  try{
    // var new_con = userconnections({user_ID:user_ID,connection_ID:connection_ID});
    query ={connection_ID:connection.connection_ID};
    await userconnections.deleteOne(query);
    return  
  }
  catch(err){
    return
  }
}

async function checkConnectionbyUserID(connection_ID){
  try{
    var connection = await userconnections.find({connection_ID:connection_ID}).lean();
   
    return connection;
  }
  catch(err){
    return
  }
}




module.exports.updateRSVP = updateRSVP;
module.exports.retrieveConnectionsbyUserID = retrieveConnectionsbyUserID;
module.exports.checkConnectionbyUserID = checkConnectionbyUserID;
module.exports.insertData = insertData;
module.exports.deleteData = deleteData;
module.exports.userconnections = userconnections;
module.exports.insertDataNo = insertDataNo;
module.exports.insertDataMaybe = insertDataMaybe;
module.exports.checkConnectionbyUserID = checkConnectionbyUserID;
module.exports.deleteDataByConnection_ID = deleteDataByConnection_ID;