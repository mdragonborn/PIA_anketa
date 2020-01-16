var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaPitanja = new Schema({
    id: {type: Number},
    question: {type: String},
    type: {type: String},
    ordered: {type: Boolean},
    weight: {type: Number},
    answerFields: {type: Array}, // extra info, answer
})

module.exports = mongoose.model("pitanje", schemaPitanja);