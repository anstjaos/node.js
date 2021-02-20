const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    query: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('History', historySchema);
