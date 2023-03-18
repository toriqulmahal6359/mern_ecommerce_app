import React, { Fragment, useRef, useState, useEffect } from 'react';
import './LoginSignUp.css';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";
import Loader from "../layout/Loader/Loader";
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login, registration } from '../../actions/userAction';
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";


const LoginSignUp = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const navigate = useNavigate();
    const location = useLocation();

    const { error, loading, isAuthenticated } = useSelector((state) => state.user);

    const switcherTab = useRef(null);
    const loginTab = useRef(null);
    const registerTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // const [redirectPath, setRedirectPath] =useState('');

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    });

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState("/profileimage.jpg");

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail, loginPassword));
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set('name', name);
        myForm.set('email', email);
        myForm.set('password', password);
        myForm.set('avatar', avatar);
        dispatch(registration(myForm));
    }

    const registerDataChange = (e) => {
        if(e.target.name === 'avatar'){
            const reader = new FileReader();
            
            reader.onload = () => {
                if(reader.readyState ===  2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }else{
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const redirect = location.search ? location.search.split("=")[1] : "/account";

    useEffect(() => {

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(isAuthenticated){
            if(redirect === 'shipping'){
                navigate('/shipping', { replace: true });
            }else{
                navigate('/account');
            }
        }

    }, [dispatch, error, alert, isAuthenticated, navigate, redirect]);

    const switchTabs = (e, tab) => {
        if(tab === 'login'){
            switcherTab.current.classList.add('shiftToNeutral');
            switcherTab.current.classList.remove('shiftToRight');

            registerTab.current.classList.remove('shiftToNeutralForm');
            loginTab.current.classList.remove('shiftToLeft');
        }
        if(tab === 'register'){
            switcherTab.current.classList.add('shiftToRight');
            switcherTab.current.classList.remove('shiftToNeutral');

            registerTab.current.classList.add('shiftToNeutralForm');
            loginTab.current.classList.add('shiftToLeft');
        }
    }
  return (
    <Fragment>
        { loading ? <Loader /> : <Fragment>
        <div className='LoginSignUpContainer'>
            <div className='LoginSignUpBox'>
                <div>
                    <div className='LoginSignUpToggle'>
                        <p onClick={(e) => switchTabs(e, "login")}>Login</p>
                        <p onClick={(e) => switchTabs(e, "register")}>Register</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                    <div className="loginEmail">
                        <MailOutlineIcon />
                        <input type="email" placeholder='Email Address' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                    </div>
                    <div className="loginPassword">
                        <LockOpenIcon />
                        <input type="password" placeholder='Password' value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                    </div>
                    <Link to="/password/forgot" >Forget Password ?</Link>
                    <input type="submit" value="Login" className='loginBtn'></input>
                </form>
                <form className='signUpForm' encType='multipart/form-data' ref={registerTab} onSubmit={registerSubmit}>
                    <div className='signUpName'>
                        <FaceIcon />
                        <input type="text" placeholder='Name' name="name" value={name} onChange={registerDataChange} required />
                    </div>
                    <div className='signUpEmail'>
                        <MailOutlineIcon />
                        <input type="email" placeholder='Email Address' name="email" value={email} onChange={registerDataChange} required />
                    </div>
                    <div className='signUpPassword'>
                        <LockOpenIcon />
                        <input type="password" placeholder='Password' name="password" value={password} onChange={registerDataChange} required />
                    </div>
                    <div id='registerImage'>
                        <img src={avatarPreview} alt = "Avatar Preview" />
                        <input type="file" name="avatar" accept='image/*' onChange={registerDataChange} />
                    </div>
                    <input type="submit" value="Register" className="signUpBtn" />   
                </form>
            </div>
        </div> 
    </Fragment>}
    </Fragment>
  )
}

export default LoginSignUp