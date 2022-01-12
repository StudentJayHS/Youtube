import { User } from "../database/User.js";
import "express-session";
import bcrypt from "bcrypt";
import { VideoLog } from "../database/VideoLog.js";

export const getSign = (req, res) => {
    const title = "Sign";
    res.render("sign", {title});
}

export const postSign = async (req, res) => {
    const { name, email, identification, password, password_2 } = req.body;
    const nameExists = await User.exists({name});
    const emailExists = await User.exists({email});
    const idExists = await User.exists({identification});

    // 가입된 이름이 있는 경우
    if(nameExists !== false) {
        const error = "The name already exists";
        return res.render("sign", {error})
    }

    // 가입된 이메일이 있는 경우
    if(emailExists !== false) {
        const error = "The email already exists";
        return res.render("sign", {error})
    }

    // 가입된 아이디가 있는 경우
    if(idExists !== false) {
        const error = "The ID already exists";
        return res.render("sign", {error})
    }
    
    // 회원가입 할 때 비밀번호와 비밀번호 확인이 서로 다를 때
    if(password != password_2) {
        const error = "Password doesn't match";
        return res.render('sign', {error})
    }

    await VideoLog.create({
        email,
    });

    await User.create({
        name,
        email,
        identification,
        password: await bcrypt.hash(password, 5),   // bcrypt를 통해 5번의 솔트값으로 비밀번호 해쉬
    });

    res.redirect('/users/login')
}

export const getLogin = (req, res) => {
    const title = "Login";
    res.render("login", {title})
}

export const postLogin = async(req, res) => {
    const { identification, password } = req.body;
    const user = await User.findOne({identification});
    
    // user 정보가 없는 경우(아이디가 일치하지 않으면)
    if(user === null) {
        const error = "ID doesn't exists";
        return res.render("login", {error})
    }

    const loadPassword = await bcrypt.compare(password, user.password);
    
    // user에 있는 비밀번호와 입력된 비밀번호를 비교
    if(loadPassword === false) {
        const error = "Password doesn't match";
        return res.render('login', {error});
    } else {
        const user = await User.findOneAndUpdate({identification}, {login: true}, {returnDocument: "after"});
        req.session.userId = user._id.toString();
        return res.redirect("/");
    }
}

export const logout = async (req, res) => {
    const id = req.session.userId;
    if(id) {
        await User.findByIdAndUpdate(id, {
            login: false,
        })
    }
    req.session.destroy();
    return res.redirect("/");
}

export const getFindId = (req, res) => {
    const title = "Find Id";
    res.render('findId', {title});
}

export const postFindId = async (req, res) => {
    const title = "Find Id";
    const { email, name } = req.body;
    const user = await User.findOne({email});

    // 이메일 정보가 일치하지 않는 경우
    if (!user) {
        const error = "The email doesn't exists";
        return res.render('findId', {error})
    }

    // 이름 정보가 일치하지 않는 경우
    if (name !== user.name) {
        const error = "The name doesn't match";
        return res.render('findId', {error})
    }

    const id = user.identification;
    res.render('findId', {id, name, title});
}

export const getFindPassword = (req, res) => {
    const title = "Find Password"
    res.render('findPassword', {title})
}

export const postFindPassword = async (req, res) => {
    const { identification, name } = req.body;
    const user = await User.findOne({identification});

    // 아이디가 없는 경우
    if(!user) {
        const error = "ID doesn't exists";
        return res.render('findPassword', {error})
    }

    // 이름이 일치하지 않는 경우
    if(name !== user.name) {
        const error = "The name doesn't match";
        return res.render('findPassword', {error})
    }
    req.session.identification = identification;
    res.redirect('/users/change-password');
}

export const getChangePassword = (req, res) => {
    const title = "Change Password";
    res.render('changePassword', {title})
}

export const postChangePassword = async (req, res) => {
    const { changePassword, changePassword_2 } = req.body;
    const { identification } = req.session;

    // 비밀번호가 서로 일치하지 않는 경우
    if(changePassword !== changePassword_2) {
        const error = "The password doesn't match";
        return res.render('changePassword', {error})
    }

    await User.findOneAndUpdate({identification}, { password: await bcrypt.hash(changePassword, 5) });
    req.session.destroy();
    res.redirect('/users/login');
}