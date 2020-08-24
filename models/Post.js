const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let option = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
};
let day = new Date();
let cDay = day.toLocaleDateString('en-US', option) + '-' + day.getFullYear().toString();


const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String,
        default: cDay
    },
    created_on: {
        type: Date,
        default: Date.now,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: 0
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: 0
    }],
    comment: [{
        username: {
            type: String,
            required: false
        },
        data: {
            type: String,
            required: false
        },
    }]
});

module.exports = mongoose.model('Posts', PostSchema);