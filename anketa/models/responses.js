var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schemaResponses = new Schema({
    testId: {type: Number, required: true},
    username: {type: String, required: true},
    answers: {type: Array},
    beginning: {type: Date},
    end: {type: Date},
    finished: {type: Boolean},
    durationMin: {type: Number},
    score: {type: Number}    
})

module.exports = mongoose.model('Responses', schemaResponses);
