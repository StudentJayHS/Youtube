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

    res.render("video/upload", {title})
}

export const postUpload = async (req, res) => {
    const { title, description, hashtag } = req.body;
    const { thumbnail, video } = req.files;
    let viewThumbnail = "";
    let videoFile = "";

    // 파일 없이 업로드를 할 경우
    if(thumbnail === undefined || video === undefined) {
        const error = "There is no file";
        return res.render("video/upload", {error});
    }

    // 확장자가 일치하지 않은 경우
    if(thumbnail[0].originalname.match(/\.(jpg|jpeg)$/) === null) {
        const error = "Only the image is possible.(jpg, jpeg)";
        return res.render("video/upload", {error});
    }

    if(video[0].originalname.match(/\.(mp4)$/) === null) {
        const error = "Only the video is possible.(mp4)";
        return res.render("video/upload", {error});
    }

    // thumbnail 을 등록하지 않고 업로드를 할 경우 에러 메시지 출력
    if(req.files['thumbnail']) {
        viewThumbnail = req.files['thumbnail'][0].filename;
    } else {
        const error = 'You recommend that you register your picture';
        return res.render('video/upload', {error})
    }

    // videoFile 을 등록하지 않고 업로드를 할 경우 에러 메시지 출력
    if(req.files['video']) {
        videoFile = req.files['video'][0].filename;
    } else {
        const error = 'You recommed that you register your video';
        return res.render('video/upload', {error});
    }

    const uploadDate = new Date();
    const id = req.session.userId;

    await Video.create({
        thumbnail: viewThumbnail,
        videoFile,
        title,
        description,
        hashtag: hashtag.startsWith(' ', 1) ? "" : hashtag,
        uploadDate,
        userId: id,
    });
    res.redirect('/');
}

export const getWatch = async (req, res) => {
    const { id } = req.params;
    let video = await Video.findById(id);
    const title = video.title;
    let views = video.views + 1;

    // 비디오 링크를 클릭하면 시청한 비디오 저장
    const userId = req.session.userId;
    if(userId) {
        const user = await User.findById(userId);
        const email = user.email;
        const videoLog = await VideoLog.findOne({email});

        let videos = videoLog.videos;
        videos.push(video);

        // 좋아요 버튼을 눌렀을 경우 또는 싫어요 버튼을 눌렀을 경우
        let button = "";
        if(user.like.includes(id)) {
            button = "like"
        } else if(user.hate.includes(id)) {
            button = "hate"
        } else {
            button = ""
        }

        await VideoLog.findOneAndUpdate({email}, {videos});
        video = await Video.findByIdAndUpdate(id, {views}, {returnDocument: 'after'});

        return res.render('video/watch', {video, title, userId, user, button});
    }

    video = await Video.findByIdAndUpdate(id, {views}, {returnDocument: 'after'});

    res.render('video/watch', {video, title});
}

export const postWatch = async (req, res) => {
    const { text, delCommentId } = req.body;
    const { id } = req.params;
    const userId = req.session.userId;
    const date = new Date();

    const user = await User.findById(userId);
    const name = user.name;

    // 좋아요 또는 싫어요 버튼을 누르면 비디오 id 값 받음(ajax)
    const videoId = req.body.id;

    // 로그인 상태일 경우에만
    if(userId) {
        // 좋아요 버튼을 눌렀을 경우
        if(req.body.like === 'true') {
            let like = user.like;
            like.push(videoId);

            let hate = user.hate;
            if(hate.includes(videoId)) {
                hate.splice(hate.indexOf(videoId), 1);
            }

            return await User.findByIdAndUpdate(userId, {
                like,
                hate,
            })
        } 
        
        // 좋아요 버튼을 한 번 더 눌렀을 경우
        if (req.body.like === 'false') {
            let like = user.like;
            if(like.includes(videoId)) {
                like.splice(like.indexOf(videoId), 1);
            }

            return await User.findByIdAndUpdate(userId, {
                like,
            })
        }

        
        // 싫어요 버튼을 눌렀을 경우
        if(req.body.hate === 'true') {
            let hate = user.hate;
            hate.push(videoId);

            let like = user.like;
            if(like.includes(videoId)) {
                like.splice(like.indexOf(videoId), 1);
            }

            return await User.findByIdAndUpdate(userId, {
                like,
                hate,
            })
        } 
        
        // 싫어요 버튼을 한 번 더 눌렀을 경우
        if (req.body.hate === 'false') {
            let hate = user.hate;
            if(hate.includes(videoId)) {
                hate.splice(hate.indexOf(videoId), 1);
            }

            return await User.findByIdAndUpdate(userId, {
                hate,
            })
        }
    }
    
    const video = await Video.findById(id);
    let comments = video.comments;

    // 로그인을 했을 시에만 댓글 작성
    if(userId && text) {
        const data = {
            userId,
            name,
            text,
            date,
        }

        comments.push(data);

        const updateVideo = await Video.findByIdAndUpdate(id, {
            comments
        }, {returnDocument: 'after'});

        // 댓글을 달았을 때 부여된 아이디 값 추출
        const commentId = updateVideo.comments.slice(-1)[0]._id

        const responseData = {
            userId,
            name,
            text,
            date,
            commentId,
        }

        return res.json(responseData);
    }

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

        return res.json(comments);
    }
}

export const getMyVideo = async (req, res) => {
    const title = "My Videos"

    // 로그인이 되지 않았을 때 업로드 페이지 접근 불가능
    if(req.session.userId === undefined) {
        return res.redirect("/users/login");
    }

    const { userId } = req.session;
    const videos = await Video.find({userId});

    res.render('video/myVideo', {title, videos});
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

        return res.render('video/watchRecode', {title, videos});
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