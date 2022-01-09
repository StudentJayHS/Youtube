import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    userId: {type: String},
    thumbnail: {type: String, require: true},
    videoFile: {type: String, require: true},
    title: {type: String, require: true},
    hashtag: {type: String},
    description: {type: String},
    views: {type: Number, default: 0},
    uploadDate: {type: Date},
    owner: {type: Boolean},
});

export const Video = mongoose.model("video", videoSchema);