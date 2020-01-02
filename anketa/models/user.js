var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var schema = new Schema({
    email : {type:String, require:true},
    username: {type:String, require:true},
    ime: {type:String, require:true},
    prezime: {type:String, require:true},
    jmbg: {type:String, require:true},
    datum_rodjenja: {type:Date, require:true},
    mesto_rodjenja: {type:String, require:true},
    phone: {type:String, require: true},
    password:{type:String, require:true},
    creation_dt:{type:Date, require:true}
});

schema.statics.hashPassword = function hashPassword(password){
    return bcrypt.hashSync(password,10);
}

schema.methods.validPassword = function(hashedpassword){
    return  bcrypt.compareSync(hashedpassword, this.password);
}

module.exports = mongoose.model('User',schema);