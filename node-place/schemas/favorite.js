const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema({
    placeId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    location: { type: [Number], index: '2dsphere'},
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
