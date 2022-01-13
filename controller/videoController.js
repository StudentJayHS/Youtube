import "express-session";
import "multer";
import { User } from "../database/User.js";
import { Video } from "../database/Video.js";
import { VideoLog } from "../database/VideoLog.js";

export const getUpload = async(req, res) => {
    const title = "Upload";

    // 로그인이 되지 않았을 때 업로드 페이지 접근 불가능
    if(req.session.userId === undefined) {
        return res.redirect("/users/login");
    }

    res.render("upload", {title})
}

export const postUpload = async (req, res) => {
    const { title, description, hashtag } = req.body;
    const { thumbnail, video } = req.files;
    let viewThumbnail = "";
    let videoFile = "";

    // 확장자가 일치하지 않은 경우
    if(thumbnail[0].originalname.match(/\.(jpg|jpeg)$/) === null) {
        const error = "Only the image is possible.(jpg, jpeg)";
        return res.render("upload", {error});
    }

    if(video[0].originalname.match(/\.(mp4)$/) === null) {
        const error = "Only the video is possible.(mp4)";
        return res.render("upload", {error});
    }

    // thumbnail 을 등록하지 않고 업로드를 할 경우 에러 메시지 출력
    if(req.files['thumbnail']) {
        viewThumbnail = req.files['thumbnail'][0].filename;
    } else {
        const error = 'You recommend that you register your picture';
        return res.render('upload', {error})
    }

    // videoFile 을 등록하지 않고 업로드를 할 경우 에러 메시지 출력
    if(req.files['video']) {
        videoFile = req.files['video'][0].filename;
    } else {
        const error = 'You recommed that you register your video';
        return res.render('upload', {error});
    }

    const uploadDate = new Date();
    const id = req.session.userId;

    await Video.create({
        thumbnail: viewThumbnail,
        videoFile,
        title,
        description,
        hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
        uploadDate,
        userId: id,
    });
    res.redirect('/');
}

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    const title = video.title;

    // 비디오 링크를 클릭하면 시청한 비디오 저장
    const userId = req.session.userId;
    if(userId) {
        const user = await User.findById(userId);
        const email = user.email;
        const videoLog = await VideoLog.findOne({email});
        let videos = videoLog.videos;
        videos.push(video);

        await VideoLog.findOneAndUpdate({email}, {videos});
    }

    res.render('watch', {video, title});
}

export const myVideo = async (req, res) => {
    const title = "My Videos"

    // 로그인이 되지 않았을 때 업로드 페이지 접근 불가능
    if(req.session.userId === undefined) {
        return res.redirect("/users/login");
    }

    const { userId } = req.session;
    const videos = await Video.find({userId});

    res.render('myVideo', {title, videos});
}

export const watchRecode = async (req, res) => {
    const title = "Watch Recode";

    // 로그인이 되지 않았을 때 업로드 페이지 접근 불가능
    if(req.session.userId === undefined) {
        return res.redirect("/users/login");
    }

    const userId = req.session.userId;
    if(userId) {
        const user = await User.findById(userId);
        const email = user.email;

        const videoLog = await VideoLog.findOne({email});
        const videos = videoLog.videos;

        return res.render('watchRecode', {title, videos});
    }

    res.render('watchRecode', {title});
}