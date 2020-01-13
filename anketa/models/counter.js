var mongoose = require("mongoose");

var schemaCounters = new mongoose.Schema({
    id: {type: String},
    next: {type: Number}
});

var model = mongoose.model('Counters', schemaCounters);;

module.exports = {
    model: model,
    counter: async (name, callback) => {
        model.findOneAndUpdate({id:name}, 
            {$inc:{next:1}}, {'new':true, 
            useFindAndModify: false,
            upsert: true}, 
            (err, result) => {
            return callback(result);});
    }
};