const Connection = require("../models/connection");
const user = require("../models/user");

class userConnection  {

	constructor(connection,rsvp){
		this.connection = connection;
		this.rsvp = rsvp;
	}
}

module.exports = userConnection;