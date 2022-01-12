import mongoose from "mongoose";

const videoLogSchema = mongoose.Schema({
    email: {type: String, unique: true},
    videos: {type: Array},
})

export const VideoLog = mongoose.model("VideoLog", videoLogSchema);