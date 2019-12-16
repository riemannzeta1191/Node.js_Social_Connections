var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var connectionDB = require('../utils/connectionDB');
var user = require('../models/user');
var urlencodedParser= bodyParser.urlencoded({extended:false});

var userProfile = require('../models/user_profile');
var userdatadb = require('../utils/userDb');
var session = require('express-session');
const { check,validationResult } = require('express-validator');
var userprofileDB  = require('../utils/userprofileDB')
var userconnection = require('../models/user_connection');
var connectionschemaDB = require('../models/connection_schema');
var userconnDB = require('../models/user_connections_schema');
var userlogin = require('../models/user_login');
var bcrypt = require('bcryptjs');


let d = new Date();

router.get('/newConnection', async function(req,res) {
    
   var currentUser = req.session.theUser;

       if(currentUser == undefined){
      


          res.redirect("/login");
       }
       else{
        if(req.session.update==1){

           
        }
        var userId = req.session.theUser.user_ID;
       
        req.session.login =1;
       var currentUserProfile = await userprofileDB.getUserProfile(userId);
       var li = currentUserProfile[0].connections;
        var userconnections = li;
        res.render('newConnection',{data: userconnections ,user :req.session.theUser,session :req.session.login});

       }   
});







router.post('/newConnection', [check('name').custom((value,{req})=>{
                if(isNaN(value)){
                    return true;
                }else{
                    throw new Error('invalid name')
                }}).matches(/^\w+( \w+)*$/).withMessage("topic cannot have special characters"),
 check('topic').not().isEmpty().withMessage("It cannot be Empty").isAlpha().withMessage("Must Contain alphabetical chars").matches(/^\w+( \w+)*$/).withMessage("topic cannot have special characters"),
 check('where').not().isEmpty().withMessage("It cannot be Empty").matches(/^\w+( \w+)*$/).withMessage("topic cannot have special characters"),

 check('details').not().isEmpty().withMessage("It cannot be Empty").matches(/^\w+( \w+)*$/).withMessage("topic cannot have special characters"), 
  check('date').custom((value, { req }) => {
    if(new Date(value) < new Date()) {
        throw new Error (' date of lab must be valid ');
    }
    return true;
}),

  check('when').not().isEmpty().withMessage("time field cannot be Empty").matches(/\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([AaPp][Mm]))/).withMessage("time should match e.g 8:30 AM").matches(/^[A-Za-z0-9: ]*$/).withMessage("topic cannot have special characters"),
  ],async function(req,resp,next){
    
  if(req.session.update==1){
    connobj = await connectionDB.getConnections_ID(req.session.connectioncode);
    con = connobj[0];
    ch = {}

    ch.connection_ID = connobj[0].connection_ID;
    ch.connection_name = req.body.name;
    ch.connection_topic = req.body.topic;
    ch.hosted_by = req.session.theUser.user_ID;
    ch.details = req.body.details;
    ch.date = req.body.date;
    ch.location = req.body.where;
    ch.time = req.body.when;
    ch.rsvp = 'No'
    try{
    var updated_connection = await connectionDB.updateConnection(con,ch);
    req.session.update = 0;
    return resp.render('success',{update:req.session.update,session :req.session.login,user :req.session.theUser});

  }
  catch(err){
    console.error(err);
    return;

  }

  }

 
  jh = {};
  jh.connection_ID = getRandomInt(7,100);
  jh.connection_name = req.body.name;
  jh.connection_topic = req.body.topic;
  jh.hosted_by = req.session.theUser.user_ID;
  jh.details = req.body.details;
  jh.date = req.body.date;
  jh.location = req.body.where;
  jh.time = req.body.when;
  jh.rsvp = 'No'
  const errors = validationResult(req).errors;

    if(!(errors.length==0)) {
      console.log(errors);
      return resp.render("validation");

    }  
  
  try{
  let connObj = await connectionDB.insertConnection(jh);

  }
  catch(err){
    console.error(err);
  }

 


  lib = req.session.UserProfileList;
  resp.render('success',{data: lib ,user :req.session.theUser,session :req.session.login});

});


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}









router.get("/savedconnection",async function(req,res){
    var currentUser = req.session.theUser;
     random_user = await userdatadb.getusers();
       if(currentUser != undefined){

         
         req.session.login = 1;
       var userId = req.session.theUser.user_ID;
       var currentUserProfile = await userprofileDB.getUserProfile(userId);
       var li = currentUserProfile;
    
       k = [];
       for(let j=0;j<li.length;j++){
          var ans = await connectionDB.getConnections_ID(li[j].connection_ID);
          k.push(ans);
       }
       map = [];
       for(let m=0;m<currentUserProfile.length;m++){
        for(let n=0;n<k.length;n++){
          if(currentUserProfile[m].connection_ID == k[n][0].connection_ID){
            k[n][0].rsvp =   currentUserProfile[m].rsvp
            map.push(currentUserProfile)
          }
        }
       }
      
       req.session.currentUserProfile = currentUserProfile;
     
       req.session.UserProfileList = k;
       var userconnectionssession = req.session.currentUserProfile.connection_list;
       
       var userconnections = k;
       if (userconnections == undefined){
         res.render('savedconnection',{data:[]});
       }
       else{

        res.render('new_profile',{data: k,user :req.session.theUser});
      }
}})







router.post('/connection/changes',urlencodedParser, async function(req,res,next){
  if (req.session.theUser){
  k = [];
            var userId = req.session.theUser.user_ID;
            var currentUserProfile = await userprofileDB.getUserProfile(userId);
          
            var id = req.body.connectioncode;
           
           for(m=0;m<currentUserProfile.length;m++){
               conn = await connectionDB.getConnections_ID(currentUserProfile[m].connection_ID);
              k.push(conn);
            };
        }    

  var action = req.body.action;


   if(action=='delete'){
           
           var id = req.body.connectioncode;
           lib = req.session.UserProfileList;
           var userId = req.session.theUser.user_ID;
           var connectiondb = await connectionDB.getConnections_ID(id);

           if(req.session.theUser.user_ID!=connectiondb[0].hosted_by){
           for(var i=0;i<lib.length;i++){
             if(lib[i][0].connection_ID==id){
                lib.splice(i,1);
                try{
                var del = await userconnDB.deleteData(userId,id);
              }
              catch(err){
                console.error(err);
              }
                var userdata = await userconnDB.retrieveConnectionsbyUserID(userId);
                if (!(req.session.theUser === undefined)){
               
                for(var x=0;x<lib.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        // console.log(x,y,"ujuj");
                                        if(lib[x][0].connection_ID == userdata[y].connection_ID){
                                         lib[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                    }}              

           }

           res.render('savedconnection',{data : lib,user :req.session.theUser});
    }
    else{
            lib = req.session.UserProfileList;
            console.log("ol",k);
            for(var i=0;i<lib.length;i++){
             if(lib[i][0].connection_ID==id){
                lib.splice(i,1);
            
                var user_ID = req.session.theUser.user_ID;
                try{
                var del = await connectionDB.deleteConnection1(id,user_ID);
              }
               catch(err){
                console.error(err,"yyyyyxc");
               }
                var user_cons = await userconnDB.checkConnectionbyUserID(id)
                user_cons.forEach(async function(item){
                  await userconnDB.deleteDataByConnection_ID(item);
                });
                var userdata = await userconnDB.retrieveConnectionsbyUserID(user_ID);

                if (!(req.session.theUser === undefined)){
               
                for(var x=0;x<lib.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        // console.log(x,y,"ujuj");
                                        if(lib[x][0].connection_ID == userdata[y].connection_ID){
                                         lib[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                    }



           res.render('savedconnection',{data : lib,user :req.session.theUser});



          // }}      

    }  }} 

   }


   else if(action=='Updateprofile'){
              var id = req.body.connectioncode;
              var li =[];
              var ki = [];
           
             
              var connection = await connectionDB.getConnections_ID(id);
            
              if (req.session.theUser.user_ID !=connection[0].hosted_by){
              var isaddeditem = false;
              
              for(var i=0;i<req.session.UserProfileList.length;i++){
                if(req.session.UserProfileList[i][0].connection_ID == id){
                      isaddeditem = true;
                      
                       li.push(i)
                       ki.push(req.session.UserProfileList[i])
                      break;
                    
                     }
                      
                  }
              return res.render('connection',{data: ki[0],session:req.session.login,user :req.session.theUser});  
              }
              else{
                    req.session.update = 1;
                    req.session.connectioncode = req.body.connectioncode;
                   return res.redirect('/newConnection');
              }
            }  
      
   else if(action=="UpdatersvpYes"){
            
              
              if(!(req.session.currentUserProfile === undefined)){
               
            
               var sess_list = req.session.UserProfileList;
              itemadded = false;
              var counter = 0;
              connection = await connectionDB.getConnections_ID(id);
             
             
              for( var i=0;i<req.session.UserProfileList.length;i++){
                          
                 if(req.session.UserProfileList[i][0].connection_ID == id){
                 	var foo = req.session.UserProfileList[i][0];
               
                   if(!(req.session.UserProfileList[i][0].rsvp == "Yes")){
                  
                       req.session.UserProfileList[i][0].rsvp="Yes";
                        
                        
                        var conn_add = await connectionDB.getConnections_ID(id);

                        var rsvpdata = await userconnDB.updateRSVP(foo.connection_ID,userId,foo.rsvp);

                        var userdata = await userconnDB.retrieveConnectionsbyUserID(userId)
  
                      for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        console.log(x,y,"ujuj");
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                      req.session.UserProfileList.push()           
        

 
                        isaddeditem = true;
                      }
                   break;
                 } 
                 
                 else {
                  
                    counter += 1;
                    if (counter == sess_list.length){
                     
                     connection.rsvp = "Yes";
                    try{

                    let new_con = await userconnDB.insertData(userId,id);

                  
                    var new_con_id = await connectionDB.getConnections_ID(id);
                    k.push(new_con_id);
                    var userdata = await userconnDB.retrieveConnectionsbyUserID(userId)

                     for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        console.log(x,y,"ujuj");
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                    

                  sess_list.push(new_con_id);
                  }
                  catch(err){
                    console.error(err);
                  }
                    break;

                    }
                  continue;
                 } 

              }
                
              if (sess_list.length == 0){
               
                connection.rsvp = "Yes";
                
                 var usercon = await userconnDB.checkConnectionbyUserID(userId, id,);
                 if (usercon.length == 0){
                      let new_con = await userconnDB.insertData(userId,id);
                      conn = await connectionDB.getConnections_ID(id);
                      k.push(conn);
                      var userdata = await userconnDB.retrieveConnectionsbyUserID(userId)
                      for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        console.log(x,y,"ujuj");
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                    // for(ol=0;)

                 }
                
                sess_list.push(conn);
             } 
            
               req.session.currentSnapshot = k;      
            
              res.render('savedconnection',{data:k,rsvp:rsvpdata,session:req.session.login,user :req.session.theUser});
       }
       else{
   
        res.redirect('/login');
       }
   }

   else if(action=="UpdatersvpNo"){

   	           var id = req.body.connectioncode;

              
   	           if(!(req.session.UserProfileList === undefined)){
                 var sess_list = req.session.UserProfileList;
              itemadded = false;
              var counter = 0;
              connection = await connectionDB.getConnections_ID(id);
             
              for( var i=0;i<req.session.UserProfileList.length;i++){
                 if(req.session.UserProfileList[i][0].connection_ID == id){
                                           

                   if(!(req.session.UserProfileList[i][0].rsvp == undefined)){
                    
                        req.session.UserProfileList[i][0].rsvp="No";
                      }
                      var foo = req.session.UserProfileList[i][0];
                      

                         
                       var rsvpdata = await userconnDB.updateRSVP(foo.connection_ID,userId,foo.rsvp);
                        var userdata = await userconnDB.retrieveConnectionsbyUserID(userId);
                          for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        console.log(x,y,"ujuj");
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  };

                      

                   break;
                 }
                  else {
                  
                    counter += 1;
                    if (counter == sess_list.length){
                     
                     connection.rsvp = "No";
                    // sess_list.push(new userconnection(connection,connection.rsvp));
                    try{

                    let new_con = await userconnDB.insertDataNo(userId,id);

                  
                    var new_con_id = await connectionDB.getConnections_ID(id);
                    k.push(new_con_id);
                    var userdata = await userconnDB.retrieveConnectionsbyUserID(userId)

                     for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        console.log(x,y,"ujuj");
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                    

                  sess_list.push(new_con_id);
                  }
                  catch(err){
                    console.error(err);
                  }
                    break;

                    }
                  continue;


         }

              }


              if (sess_list.length == 0){
               
                connection.rsvp = "No";
                
                
                 var usercon = await userconnDB.checkConnectionbyUserID(userId, id,);
                 if (usercon.length == 0){
                      let new_con = await userconnDB.insertDataNo(userId,id);
                      conn = await connectionDB.getConnections_ID(id);
                      k.push(conn);
                      var userdata = await userconnDB.retrieveConnectionsbyUserID(userId)
                      for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                   

                 }
             
                
                sess_list.push(conn);
             } 
            
   
              res.render('savedconnection',{data:k, user:req.session.theUser ,session:req.session.login});
           }
           else{
           	   res.redirect('/login');
           }

   }

   else if(action=="UpdatersvpMaybe"){

               var id = req.body.connectioncode;

              
               if(!(req.session.UserProfileList === undefined)){
                 var sess_list = req.session.UserProfileList;
              itemadded = false;
              var counter = 0;
              connection = await connectionDB.getConnections_ID(id);
             
              for( var i=0;i<req.session.UserProfileList.length;i++){
                 if(req.session.UserProfileList[i][0].connection_ID == id){
                                           

                   if(!(req.session.UserProfileList[i][0].rsvp == undefined)){
                    
                        req.session.UserProfileList[i][0].rsvp="Maybe";
                      }
                      var foo = req.session.UserProfileList[i][0];
                      

                         
                       var rsvpdata = await userconnDB.updateRSVP(foo.connection_ID,userId,foo.rsvp);
                        var userdata = await userconnDB.retrieveConnectionsbyUserID(userId);
                          for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        console.log(x,y,"ujuj");
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  };

                      

                   break;
                 }
                  else {
                  
                    counter += 1;
                    if (counter == sess_list.length){
                     
                     connection.rsvp = "Maybe";
                    // sess_list.push(new userconnection(connection,connection.rsvp));
                    try{

                    let new_con = await userconnDB.insertDataMaybe(userId,id);

                  
                    var new_con_id = await connectionDB.getConnections_ID(id);
                    k.push(new_con_id);
                    var userdata = await userconnDB.retrieveConnectionsbyUserID(userId)

                     for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        console.log(x,y,"ujuj");
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                    

                  sess_list.push(new_con_id);
                  }
                  catch(err){
                    console.error(err);
                  }
                    // console.log(new_data,"bbb");
                    break;

                    }
                  continue;


         }

              }


              if (sess_list.length == 0){
               
                connection.rsvp = "Maybe";
                
                
                 var usercon = await userconnDB.checkConnectionbyUserID(userId, id,);
                 if (usercon.length == 0){
                      let new_con = await userconnDB.insertDataMaybe(userId,id);
                      conn = await connectionDB.getConnections_ID(id);
                      k.push(conn);
                      var userdata = await userconnDB.retrieveConnectionsbyUserID(userId)
                      for(var x=0;x<k.length;x++){
                                    for(var y=0;y<userdata.length;y++){
                                        if(k[x][0].connection_ID == userdata[y].connection_ID){
                                         k[x][0].rsvp = userdata[y].rsvp;
                                        }
                                    }
                                  }
                    // for(ol=0;)

                 }
              
                // sess_list.push(new userconnection(connection,connection.rsvp));  
                sess_list.push(conn);
             } 
              // c

               // req.session.currentSnapshot = k;         
              res.render('savedconnection',{data:k, user:req.session.theUser ,session:req.session.login});
           }
           else{
               res.redirect('/login');
           }

   }

});

module.exports = router;