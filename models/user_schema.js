var mongoose  =  require('mongoose');
// var Schema = mongoose.schema;

var UserSchema = mongoose.Schema({
	user_ID: {type:String,required:true},
	first_name: {type:String,required:true},
	last_name: {type:String,required:true},
	email:{type:String,required:true},
	address:{type:String,required:true},
	city:{type:String,required:true},
	state: {type:String,required:true},
	zipcode:{type:Number,required:true},
	country:{type:String,required:true},

},
{'collection':'users'}
);

const user = mongoose.model('user',UserSchema);

module.exports.user = user;


