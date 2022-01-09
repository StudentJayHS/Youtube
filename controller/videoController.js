import "express-session";
import "multer";
import { Video } from "../database/Video.js";

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
    let thumbnail = "";
    let videoFile = "";

    // thumbnail 을 등록하지 않고 업로드를 할 경우 에러 메시지 출력
    if(req.files['thumbnail']) {
        thumbnail = req.files['thumbnail'][0].filename;
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
        thumbnail,
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
    res.render('watch', {video, title});
}

export const myVideo = async (req, res) => {
    const title = "My Videos"
    console.log(req.session.userId);
    const { userId } = req.session;
    const videos = await Video.find({userId});
    console.log(videos);

    res.render('myVideo', {title, videos});
}