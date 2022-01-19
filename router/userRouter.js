import express from "express";
import { getSign, postSign, getLogin, postLogin, logout, getFindId, postFindId,
         getFindPassword, postFindPassword, getChangePassword, postChangePassword,
         profile, getEditProfile, postEditProfile } from "../controller/userController.js";

export const userRouter = express.Router();

userRouter.route('/sign').get(getSign).post(postSign);
userRouter.route("/login").get(getLogin).post(postLogin);
userRouter.get("/logout", logout);
userRouter.route('/find-ID').get(getFindId).post(postFindId);
userRouter.route('/find-password').get(getFindPassword).post(postFindPassword);
userRouter.route('/change-password').get(getChangePassword).post(postChangePassword);
userRouter.get('/profile', profile);
userRouter.route('/edit-profile').get(getEditProfile).post(postEditProfile);