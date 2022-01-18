import "express-session";
import "multer";
import fs from 'fs';

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

export const getWatch = async (req, res) => {
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

        return res.render('watch', {video, title, userId});
    }

    res.render('watch', {video, title});
}

export const postWatch = async (req, res) => {
    const { text, delCommentId } = req.body;
    const { id } = req.params;
    const userId = req.session.userId;
    const date = new Date();
    
    // 로그인을 하지 않고 댓글을 달 경우 로그인 창으로 이동
    if(!userId) {
        return res.redirect('/users/login');
    }

    const user = await User.findById(userId);
    const name = user.name;
    
    const video = await Video.findById(id);
    let comments = video.comments;

    // 댓글 삭제 버튼을 눌렀을 때 comment ID 값이 있는 경우
    if(delCommentId) {
        for(let i = 0; i < comments.length; i++) {
            if(comments[i]._id.toString() === delCommentId) {
                comments.splice(i, 1);
            }
        }

        await Video.findByIdAndUpdate(id, {
            comments
        })

        return res.redirect(`/videos/watch/${id}`)
    }

    const obj = {
        userId,
        name,
        text,
        date,
    }

    comments.push(obj);

    await Video.findByIdAndUpdate(id, {
        comments
    })

    res.redirect(`/videos/watch/${id}`)
}

export const getMyVideo = async (req, res) => {
    const title = "My Videos"

    // 로그인이 되지 않았을 때 업로드 페이지 접근 불가능
    if(req.session.userId === undefined) {
        return res.redirect("/users/login");
    }

    const { userId } = req.session;
    const videos = await Video.find({userId});

    res.render('myVideo', {title, videos});
}

export const postMyVideo = async (req, res) => {
    const { id } = req.body;

    const video = await Video.findById(id);
    const thumbnail = video.thumbnail;
    const videoFile = video.videoFile;

    // 썸네일과 비디오 삭제
    fs.unlink(`upload/thumbnail/${thumbnail}`, (err) => {
        if (err !== null) {
            console.log(err);
        }
    });
    fs.unlink(`upload/video/${videoFile}`, (err) => {
        if (err !== null) {
            console.log(err);
        }
    });

    // Video DB 에서의 비디오 정보 삭제
    await Video.findByIdAndRemove(id);

    // VideoLog DB 에서의 비디오 정보 delete 수정
    const email = req.session.email;
    const videoLog = await VideoLog.findOne({email});
    let videos = videoLog.videos;

    // watchRecode.pug 에서 delete 정보를 사용
    for(let i = 0; i < videos.length; i++) {
        if(videos[i]._id.toString() === id) {
            videos[i].delete = true;
        }
    }

    await VideoLog.findOneAndUpdate({email}, {videos});

    res.redirect('/videos/my-videos');
}

export const getWatchRecode = async (req, res) => {
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

    res.redirect('/');
}

export const postWatchRecode = async (req, res) => {
    const { id } = req.body;
    const { email } = req.session;

    const videoLog = await VideoLog.findOne({email});
    let videos = videoLog.videos;
    
    // videoLog 에 있는 video ID 와 삭제하려는 video ID 가 같으면 삭제
    for(let i = 0; i < videos.length; i++) {
        if("" + videos[i]._id === id) {
            videos.splice(i, 1);
        }
    }

    await VideoLog.findOneAndUpdate({email}, {videos});
    
    res.redirect('/videos/watch-recode');
}