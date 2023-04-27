import "./Signup.scss";
import {Link, useNavigate} from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { setLoading } from "../../redux/slices/appConfigSlice";
import { useDispatch } from "react-redux";
import { useRef } from "react";

function Signup(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();


    async function handleSubmit(e){
        e.preventDefault();
        try{
            dispatch(setLoading(true));
            // console.log(emailRef.current.value);
            // console.log(passwordRef.current.value);
            // console.log(nameRef.current.value);

            await axiosClient.post("/auth/signup", {
                email: emailRef.current.value,
                password: passwordRef.current.value,
                name: nameRef.current.value,
            });
            navigate("/");
        } catch(e){
            console.log(e);
        } finally{
            dispatch(setLoading(false));
        }
    }
    return(
        <div className="Signup">
            <div className="signup-box">
                <h2 className="heading">Signup</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input className="name" type="type" id="name" ref={nameRef}/>

                    <label htmlFor="email">Email</label>
                    <input className="email" type="email" id="email" ref={emailRef}/>

                    <label htmlFor="password">Password</label>
                    <input className="password" type="password" id="password" ref={passwordRef}/>

                    <input type="submit" className="submit" />
                </form>
                <p className="subheading">Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default Signup;