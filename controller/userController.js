import { User } from "../database/User.js";
import "express-session";
import bcrypt from "bcrypt";
import { VideoLog } from "../database/VideoLog.js";

export const getSign = (req, res) => {
    const title = "Sign";
    res.render("user/sign", {title});
}

export const postSign = async (req, res) => {
    const { name, email, identification, password, password_2 } = req.body;
    const nameExists = await User.exists({name});
    const emailExists = await User.exists({email});
    const idExists = await User.exists({identification});

    // 가입된 이름이 있는 경우
    if(nameExists !== false) {
        const error = "The name already exists";
        return res.render("user/sign", {error})
    }

    // 가입된 이메일이 있는 경우
    if(emailExists !== false) {
        const error = "The email already exists";
        return res.render("user/sign", {error})
    }

    // 가입된 아이디가 있는 경우
    if(idExists !== false) {
        const error = "The ID already exists";
        return res.render("user/sign", {error})
    }
    
    // 회원가입 할 때 비밀번호와 비밀번호 확인이 서로 다를 때
    if(password != password_2) {
        const error = "Password doesn't match";
        return res.render('user/sign', {error})
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
    res.render("user/login", {title})
}

export const postLogin = async(req, res) => {
    const { identification, password } = req.body;
    const user = await User.findOne({identification});
    
    // user 정보가 없는 경우(아이디가 일치하지 않으면)
    if(user === null) {
        const error = "ID doesn't exists";
        return res.render("user/login", {error})
    }

    const loadPassword = await bcrypt.compare(password, user.password);
    
    // user에 있는 비밀번호와 입력된 비밀번호를 비교
    if(loadPassword === false) {
        const error = "Password doesn't match";
        return res.render('user/login', {error});
    } else {
        const user = await User.findOneAndUpdate({identification}, {login: true}, {returnDocument: "after"});
        req.session.userId = user._id.toString();
        req.session.email = user.email;
        req.session.editProfile = false;
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
    res.render('user/findId', {title});
}

export const postFindId = async (req, res) => {
    const title = "Find Id";
    const { email, name } = req.body;
    const user = await User.findOne({email});

    // 이메일 정보가 일치하지 않는 경우
    if (!user) {
        const error = "The email doesn't exists";
        return res.render('user/findId', {error})
    }

    // 이름 정보가 일치하지 않는 경우
    if (name !== user.name) {
        const error = "The name doesn't match";
        return res.render('user/findId', {error})
    }

    const id = user.identification;
    res.render('user/findId', {id, name, title});
}

export const getFindPassword = (req, res) => {
    const title = "Find Password"
    res.render('user/findPassword', {title})
}

export const postFindPassword = async (req, res) => {
    const { identification, name } = req.body;
    const user = await User.findOne({identification});

    // 아이디가 없는 경우
    if(!user) {
        const error = "ID doesn't exists";
        return res.render('user/findPassword', {error})
    }

    // 이름이 일치하지 않는 경우
    if(name !== user.name) {
        const error = "The name doesn't match";
        return res.render('user/findPassword', {error})
    }
    req.session.identification = identification;
    res.redirect('/users/change-password');
}

export const getChangePassword = async (req, res) => {
    const title = "Change Password";
    const identification = req.session.identification;

    // ID 는 find-password 와 editProfile 에서 인증을 해야 존재.
    if(!identification) {
        // editprofile 에서 인증을 해야 true 값을 받을 수 있음
        if(req.session.editProfile === false) {
            return res.redirect('users/edit-profile');
        }
        return res.redirect('/users/find-password');   
    }

    // userId 는 로그인을 했을 때 전달받을 수 있는데 로그인 없이 비밀번호를 찾는 경우에 editProfile 값을 false 로 변경하는 것을 방지하기 위해.
    if(req.session.userId) {
        req.session.editProfile = false;
    }

    // 프로필에서 비밀번호 수정할 때 사용할 user
    const user = await User.findOne({identification});

    res.render('user/changePassword', {title, user});
}

export const postChangePassword = async (req, res) => {
    const { changePassword, changePassword_2, profile, nowPassword } = req.body;
    const { identification } = req.session;
    const user = await User.findOne({identification});
    let error = "";

    // 프로필에서 비밀번호 변경을 하는 경우
    if(profile) {
        const comparePassword = await bcrypt.compare(nowPassword, user.password);

        // 현재 비밀번호가 일치하지 않는 경우
        if(!comparePassword) {
            error = "The password doesn't match";
            return res.render('user/changePassword', {error, user});
        }

        // 바꿀 비밀번호들이 일치하지 않는 경우
        if(changePassword !== changePassword_2) {
            const error = "The passwords don't match";
            return res.render('user/changePassword', {error, user});
        }

        // 기존 비밀번호와 같게 변경하려는 경우
        if(nowPassword === changePassword) {
            const error = "You can't change it to the same password";
            return res.render('user/changePassword', {error, user});
        }

        await User.findOneAndUpdate({identification}, { password: await bcrypt.hash(changePassword, 5) });

        return res.redirect('/users/edit-profile');
    }

    // 비밀번호가 서로 일치하지 않는 경우
    if(changePassword !== changePassword_2) {
        const error = "The passwords don't match";
        return res.render('user/changePassword', {error, user})
    }

    await User.findOneAndUpdate({identification}, { password: await bcrypt.hash(changePassword, 5) });
    req.session.destroy();
    res.redirect('/users/login');
}

export const profile = async (req, res) => {
    const userId = req.session.userId;
    const title = "Profile";

    // 로그인을 하지 않고 url 경로를 따라 접근했을 때
    if(!userId) {
        return res.redirect('/users/login');
    }

    const user = await User.findById(userId);

    res.render('user/profile', {title, user});
}

export const getEditProfile = async (req, res) => {
    const title = "Edit Profile";
    const userId = req.session.userId;
    const user = await User.findById(userId);

    // 로그인을 하지 않고 url 경로를 따라 접근했을 때
    if(!userId) {
        return res.redirect('/users/login');
    }

    res.render('user/editProfile', {title, user});
}

export const postEditProfile = async (req, res) => {
    const { password, edit } = req.body;
    const userId = req.session.userId;

    // 로그인을 하지 않고 url 경로를 따라 접근했을 때
    if(!userId) {
        return res.redirect('/users/login');
    }

    // edit 가 true 면 프로필 수정이 가능하도록(프로필 수정에서 첫 회 비밀번호를 입력하면)
    if(edit) {
        const { name, email } = req.body;

        await User.findByIdAndUpdate(userId, {
            name,
            email,
        })

        return res.redirect('/users/profile');
    }

    const user = await User.findById(userId);

    // 비밀번호 변경으로 가기 위해 세션 저장
    req.session.identification = user.identification;

    // 로그인 상태에서 url을 통해 바로 비밀번호 변경으로 가는 것을 막기 위함.
    req.session.editProfile = true;

    // 프로필 수정을 하려면 비밀번호 한 번 입력하는 것으로 보안.
    const comparePassword = await bcrypt.compare(password, user.password);

    if(!comparePassword) {
        const error = "The Password doesn't match";
        return res.render('user/editProfile', {error});
    }

    res.render('user/editProfile', {user})
}