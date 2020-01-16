var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schemaReport = new Schema({
    testId: {type: Number, required: true},
    type: {type: String, required: true},
    maxScore: {type: Number},
    average: {type: Number},
    responseCount: {type: Number},
    scores: {type: Array},
    questions: {type: Array, required: true}, 
    // question, type, fieldArray<{extra info, <ansarray{content, occurrences}>>}
});

module.exports = mongoose.model('Report',schemaReport);


