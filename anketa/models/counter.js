import { Mongoose } from "mongoose";

var schemaCounters = new Mongoose.Schema({
    id: {type: String},
    next: {type: Number}
});

var model = mongoose.model('Counters', schemaCounters);;

schemaCounters.statics.counter = function(name) {
    var ret = model.findAndModify({id:name, 
        update:{$inc:{next:1}}, 'new':true, upsert: true});
    return ret.next;
}

module.exports = model;