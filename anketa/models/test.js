var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaTest = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    info: {type: String},
    creatorUsername: {type: String, required: true},
    type: {type: String, required: true},
    begin: {type: Date, required: true},
    end: {type: Date},
    durationMin: {type: Number},
    questions: {type: Array, required: true}, 
    // question, type, {extra info, answer}
});

module.exports = mongoose.model('Test',schemaTest);


