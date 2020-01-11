var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schemaResponses = new Schema({
    testId: {type: Number, required: true},
    username: {type: String, required: true},
    answers: {type: Array},
    score: {type: Number}    
})

module.exports = mongoose.model('Responses', schemaResponses);
