import React, { Fragment, useState, useEffect } from 'react';
import './ForgotPassword.css';
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from '../../actions/userAction';
import { useAlert } from "react-alert";
import MetaData from '../layout/MetaData';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { error, message, loading } = useSelector((state) => state.forgotPassword);

    const [email, setEmail] = useState("");

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set('email', email);

        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          };
        
        const data = JSON.stringify({ email });
        
        dispatch(forgotPassword(data, config))
    }

    useEffect(() => {

        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if(message){
            alert.success(message);

        }
    }, [dispatch, error, alert, message]);
  return (
    <Fragment>
        { loading ? ( 
            <Loader /> 
        ) : ( 
        <Fragment>
            <MetaData title="Forgot Password" />
            <div className='forgotPasswordContainer'>
                <div className='forgotPasswordBox'>
                    <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                    <form className='forgotPasswordForm' onSubmit={forgotPasswordSubmit}>
                        <div className='forgotPasswordEmail'>
                            <MailOutlineIcon />
                            <input type="email" placeholder='Email Address' name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <input type="submit" value="Send" className="forgotPasswordBtn" />   
                    </form>
                </div>
            </div>
        </Fragment> )}
    </Fragment>
  )
}

export default ForgotPassword