import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    userId: {type: String},
    thumbnail: {type: String, require: true},
    videoFile: {type: String, require: true},
    title: {type: String, require: true},
    hashtag: {type: String},
    description: {type: String},
    views: {type: Number, default: 0},
    uploadDate: {type: String},
    viewDate: {type: Date},
    owner: {type: Boolean},
    delete: {type: Boolean, default: false},
    userLike: [{type: String, unique: true}],
    comments: [{
        userId: {type: String, unique: true},
        name: {type: String, unique: true},
        text: {type: String},
        date: {type: Date},
    }]
});

export const Video = mongoose.model("video", videoSchema);