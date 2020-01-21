var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaQuestion = new Schema({
    id: {type: Number, required: true},
    question: {type: String},
    type: {type: Number},
    ordered: {type: Boolean},
    weight: {type: Number},
    answerFields: {type: Array}, // extra info, answer
})

module.exports = mongoose.model("question", schemaQuestion);