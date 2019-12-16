const Connection = require("../models/connection");
var mongoose = require('mongoose');
var connectionDB = require('../models/connection_schema');
var userDB = require('../models/user_connections_schema');

var db = 'mongodb://localhost:27018/application';
mongoose.connect(db);
console.log(db);

//data object for the hardcoded database of each connection detail/

// code to get connections object by passing it Connection class and pushing
//them into a list to be displayed into the connections view





async function getConnections1(){
    let connections;
    try{
        connections = await connectionDB.connections.find({}).lean();
        return connections;
    }
    catch(err){
        return;
    };
};

// console.log(getConnections1());
//code to get object of given Connection_ID

async function getConnections_ID(connection_ID){
    let connection;
    try{
        connection = await connectionDB.connections.find({connection_ID:connection_ID}).lean();
        // console.log("pp",connection);
        return connection;
    }
    catch(err){
        return;
    };
};
async function insertConnection(Connection){
try{
    let obj;
    obj = connectionDB.connections(Connection);
    console.log("uyu",obj);
    await obj.save();
    return obj;
}
catch(err){
    console.error(err);
}}


async function updateConnection(Connection,Updated){
try{
   var connection = new connectionDB.connections(Connection);
   var newconn  = connectionDB.connections.findOneAndUpdate(Connection,Updated);
   return newconn;
}
catch(err){
    console.error(err);
}}

async function deleteConnection1(Connection_ID,user_ID){
try{
    // var new_con = userconnections({user_ID:user_ID,connection_ID:connection_ID});
    conn = await connectionDB.connections.find({connection_ID:Connection_ID}).deleteOne().exec()
    console.log("iii",conn);
    // query ={hosted_by:user_ID,connection_ID:connection_ID};
    // await  connectionDB.connections.deleteOne(query);
    return  
  }
  catch(err){
    return
  }
}


// module.exports.data = data;
module.exports.getConnections1 = getConnections1;
module.exports.getConnections_ID = getConnections_ID;
module.exports.insertConnection = insertConnection;
module.exports.updateConnection = updateConnection;
module.exports.deleteConnection1 = deleteConnection1;

