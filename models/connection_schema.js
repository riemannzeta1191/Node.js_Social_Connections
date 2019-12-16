var mongoose  =  require('mongoose');
// var Schema = mongoose.schema;
var Schema = mongoose.Schema;
var ConnectionSchema = new Schema({
	connection_ID: {type:String,required:true},
	connection_name: {type:String,required:true},
	connection_topic : {type:String,required:true},
	hosted_by:{type:String,required:true},
	details:{type:String,required:true},
	date:{type:Date,required:true},
	location: {type:String,required:true},
	time:{type:String,required:true},
	rsvp:{type:String,required:true}

},
  {'collection':'connection'}
);

connections = mongoose.model('connection',ConnectionSchema);

module.exports.connections = connections;