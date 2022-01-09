import express from "express";
import { getUpload, postUpload, watch, myVideo } from "../controller/videoController.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'upload/')     // 파일 경로 설정
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)     // 파일 이름 변경
    }
})

const upload = multer({
    storage: storage
});


export const videoRouter = express.Router();

videoRouter.route('/upload').get(getUpload).post(upload.fields([{name: "thumbnail"}, {name: "video"}]),postUpload);
videoRouter.get('/watch/:id', watch);
videoRouter.get('/my-videos', myVideo);