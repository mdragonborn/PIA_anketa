var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaTest = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    info: {type: String, required: true},
    creatorUsername: {type: String, required: true},
    type: {type: String, required: true},
    begin: {type: Date, required: true},
    end: {type: Date},
    duration: {type: Number},
    questions: {type: Array},
});

module.exports = mongoose.model('Test',schemaTest);


