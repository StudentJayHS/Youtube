import express from "express";
import session from "express-session";

import { mainRouter } from "./router/mainRouter.js";
import { userRouter } from "./router/userRouter.js";
import { videoRouter } from "./router/videoRouter.js";

import "./database/connect.js";
import "./database/User.js";

const app = express();

app.set("view engine", "pug");
app.set("views", "view");

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'youtube',          // 쿠키를 임의로 변조하는 것을 방지하기 위한 값으로 이 값을 토대로 세션을 암호화
    resave: false,              // 세션에 변경사항이 없어도 항상 저장할 것인지 설정
    saveUninitialized: true,    // 세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
    cookie: { secure: false },  // https에서만 쿠키를 가져올 것인지 설정
}));

app.use('/', mainRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

// route req 방식으로 작동되기 때문에 js, css, image file 등은 폴더를 생성해 static 을 사용해야 함.
app.use('/upload', express.static('upload'));   // upload 폴더 내 파일을 /upload 루트로 사용하겠다는 의미

app.listen(4000, () => {
    console.log("welcome to my youtube!")
})