import { User } from "../database/User.js";
import { Video } from "../database/Video.js";
import "express-session";

export const main = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    
    // 데이터베이스에 있는 모든 비디오들을 배열 형태로 저장
    const videos = await Video.find({});

    if(user === null) {
        return res.render('home', {videos});
    }

    res.render("home", {login: user.login, videos, userId});
}

export const search = async (req, res) => {
    const { search } = req.query;   // req 콘솔에는 body 값은 없고, query 값에 존재.
    const title = search;

    // 정규식을 이용해 검색
    const videos = await Video.find({
        title: { $regex: new RegExp(search, 'i') },
    });

    res.render('home', {videos, title});
}