import express from "express";
import multer from "multer";
import { getUpload, postUpload, getWatch, postWatch, getMyVideo, postMyVideo, getWatchRecode, postWatchRecode, getLikePlaylist, postLikePlaylist } from "../controller/videoController.js";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // if 문으로 확장자에 따라 폴더를 나눠 담기
        if (file.originalname.match(/\.(jpg|jepg|png)$/)) {
            cb(null, 'upload/thumbnail');    // 파일 경로 설정
        } else if (file.originalname.match(/\.(mp4)$/)) {
            cb(null, 'upload/video');
        }
    },
    filename: function(req, file, cb) {
        const date = new Date();
        if (file.originalname.match(/\.(jpg|jepg)$/)) {
            cb(null, date.getTime() + '.jpg');    // 파일 이름 변경
        } else if(file.originalname.match(/\.(png)$/)) {
            cb(null, date.getTime() + '.png');
        } else if (file.originalname.match(/\.(mp4)$/)) {
            cb(null, date.getTime() + '.mp4');
        }
    }
})

const upload = multer({
    storage: storage
});


export const videoRouter = express.Router();

videoRouter.route('/upload').get(getUpload).post(upload.fields([{name: "thumbnail"}, {name: "video"}]),postUpload);
videoRouter.route('/watch/:id').get(getWatch).post(postWatch);
videoRouter.route('/my-videos').get(getMyVideo).post(postMyVideo);
videoRouter.route('/watch-recode').get(getWatchRecode).post(postWatchRecode);
videoRouter.route('/like-playlist').get(getLikePlaylist).post(postLikePlaylist);