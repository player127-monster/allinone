import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword as  forgotPasswordAction } from "../../actions/userActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetMessage } from "../../actions/userActions";
import { clearAuthError } from "../../actions/userActions";

export default function ForgotPassword(){

    const [email,setEmail] = useState('');
    const dispatch = useDispatch();

    const { error, message} = useSelector(state=>state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        
        const data = {
            email:email
        };

        dispatch(forgotPasswordAction(data)); // Pass plain JS object
    }

    useEffect(()=>{
            if (message) {
                    toast(message, {
                        type: 'success',
                        position: 'bottom-center',
                        onOpen: () => {
                            dispatch(resetMessage()); // ✅ reset the flag
                        }
                    });
                    setEmail('');
                    return
                    
                }
            
            if (error) {
                    toast(error, {
                        position: "bottom-center",
                        type: 'error',
                        onOpen: () => {
                            dispatch(clearAuthError());
                        }

                    })
                    return
                    
                } 
        },[message,error,dispatch])

    return(
        <div className="row wrapper ">
                <div className="col-10 col-lg-5 m-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3">
                            Send Email
                    </button>

                    </form>
                </div>
        </div>
    )
}