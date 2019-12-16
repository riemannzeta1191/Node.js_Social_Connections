

class user {

	constructor(user_ID,first_name,last_name,email,address,city,state,zip,country){
		this.user_ID = user_ID;
		this.first_name = first_name;
		this.last_name = last_name;
		this.email = email;
		this.address = address;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.country = country;

	}
}

module.exports = user;