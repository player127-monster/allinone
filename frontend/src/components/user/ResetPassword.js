import { useState, useEffect } from "react"
import { resetPassword } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearAuthError } from "../../actions/userActions";
import { resetMessage } from "../../actions/userActions";

export default function ResetPassword(){

    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");

    
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const {token} = useParams();
    const {isAuthenticated, error} = useSelector(state=>state.authState);

    const submitHandler = (e) =>{
        e.preventDefault();

        const data = {
                    password:password,
                    confirmPassword:confirmPassword
                };

                
        
                dispatch(resetPassword(data,token)); // Pass plain JS object
    }

    useEffect(()=>{

        if(isAuthenticated){
            toast('Password reset success', {
                    type: 'success',
                    position: 'bottom-center',
                    onOpen: () => {
                        dispatch(resetMessage()); // ✅ reset the flag
                    }
                });

            navigate('/');
            return;
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
    },[isAuthenticated,error,dispatch,navigate])

    return(
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg">
                    <h1 className="mb-3">New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>

                </form>
            </div>
        </div>
    )
}