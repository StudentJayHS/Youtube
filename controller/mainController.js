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
    const { search } = req.query;   // get 방식일 경우 body 가 아닌 query 에 있음
    const title = search;

    // 정규식을 이용해 검색
    const videos = await Video.find({
        $or: [
            {title: { $regex: new RegExp(search, 'i') }},
            {hashtag: { $regex: new RegExp(search, 'i') }},
        ]
    });

    res.render('home', {videos, title});
}