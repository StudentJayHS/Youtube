import express from "express";
import { getUpload, postUpload, watch, myVideo, watchRecode } from "../controller/videoController.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // if 문으로 확장자에 따라 폴더를 나눠 담기
        if (file.originalname.match(/\.(jpg|jepg)$/)) {
            cb(null, 'upload/thumbnail');    // 파일 경로 설정
        } else if (file.originalname.match(/\.(mp4)$/)) {
            cb(null, 'upload/video');
        }
    },
    filename: function(req, file, cb) {
        const date = new Date();
        if (file.originalname.match(/\.(jpg|jepg)$/)) {
            cb(null, date.getTime() + '.jpg');    // 파일 이름 변경
        } else if (file.originalname.match(/\.(mp4)$/)) {
            cb(null, date.getTime() + 'mp4');
        }
    }
})

const upload = multer({
    storage: storage
});


export const videoRouter = express.Router();

videoRouter.route('/upload').get(getUpload).post(upload.fields([{name: "thumbnail"}, {name: "video"}]),postUpload);
videoRouter.get('/watch/:id', watch);
videoRouter.get('/my-videos', myVideo);
videoRouter.get('/watch-recode', watchRecode);