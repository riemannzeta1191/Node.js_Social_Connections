var mongoose  =  require('mongoose');
const bcrypt = require('bcrypt');
// var Schema = mongoose.schema;

var UserLoginSchema = mongoose.Schema({
	email:{type:String,required:true, unique:1},
	hash:{type:String,required:true,minlength:6},
	
});

let SALT = 10;
const userlogin = mongoose.model('userlogin',UserLoginSchema);

module.exports.userlogin = userlogin;

UserLoginSchema.pre('save',function(next){
	var user = this;
	if(user.isModified('password')){
		bcrypt.genSalt(SALT, function(err,salt){
			if (err) return next(err);
			bcrypt.hash(user.hash, salt, function(err,hash){
				if(err) return next(err);
				user.hash = hash;
				next();
			})
		})

	} else {
		next()
	}
})


async function getusername(email){
	try{
	var obj = await userlogin.findOne({email:email})
	console.log(obj);
	return obj;
	}
	catch(err){
		return;
	}
}

module.exports.getusername = getusername;