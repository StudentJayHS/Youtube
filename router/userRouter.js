import express from "express";
import multer from "multer";
import { getSign, postSign, getLogin, postLogin, logout, getFindId, postFindId,
         getFindPassword, postFindPassword, getChangePassword, postChangePassword,
         profile, getEditProfile, postEditProfile } from "../controller/userController.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/picture')  // 파일 저장 경로
    },
    filename: (req, file, cb) => {
        const date = new Date();
        if (file.originalname.match(/\.(jpg|jepg)$/)) {
            cb(null, date.getTime() + '.jpg');    // 파일 이름 변경
        } else if(file.originalname.match(/\.(png)$/)) {
            cb(null, date.getTime() + '.png');
        }
    }
})

const upload = multer({
    storage: storage
})

export const userRouter = express.Router();

userRouter.route('/sign').get(getSign).post(postSign);
userRouter.route("/login").get(getLogin).post(postLogin);
userRouter.get("/logout", logout);
userRouter.route('/find-ID').get(getFindId).post(postFindId);
userRouter.route('/find-password').get(getFindPassword).post(postFindPassword);
userRouter.route('/change-password').get(getChangePassword).post(postChangePassword);
userRouter.get('/profile', profile);
userRouter.route('/edit-profile').get(getEditProfile).post(upload.single('picture') ,postEditProfile);