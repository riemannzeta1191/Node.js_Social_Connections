const userConnection = require("../models/user_connection");
const data = require("../utils/userDb");
// console.log(data.userdata);
// console.log(new userConnection());


class userProfile  {

	constructor(user_ID,connection_list){
		this.user_ID = user_ID;
		this.connection_list = connection_list;

	}

	addConnection(connectionObj){
      this.connection_list.push(connectionObj);
    }

    

    removeConnection(connectionID){
      for( var i=0;i<this.connection_list.length;i++){
         if(this.connection_list[i].connection.connection_ID == connection_ID){
           this.connection_list.splice(i,1);
           break;
         }
      }

    }

    updateConnection(UserConnectionObj,rsvp){
       for (var i=0;i<this.connection_list.length;i++){
         if(this.connection_list[i].connection.connection_ID ==  UserConnectionObj.connection.connection_ID){
         	this.connection_list[i].connection = UserConnectionObj.connection;
           this.listadventures[i].rsvp = rsvp;
         }
       }
    }

    
    getConnections(){
      return this.connection_list;
    }

    emptyProfile(){
       delete this.userId;
       delete this.connection_list;
     }
   


};







module.exports = userProfile;

