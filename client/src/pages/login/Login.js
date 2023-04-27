import "./Login.scss";
import {Link} from "react-router-dom";
import {useState} from "react";
import axiosClient from "../../utils/axiosClient";
import {KEY_ACCESS_TOKEN, setItem} from "../../utils/localStorageManager";
import { useNavigate } from "react-router-dom";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response = await axiosClient.post("/auth/login", {
                email,
                password,
            });
            const accessToken = response.result.accessToken;
            setItem(KEY_ACCESS_TOKEN, accessToken);
            navigate("/");
        } catch(e){
            console.log(e.errMessage);
        }
    }

    return(
        <div className="Login" onSubmit={handleSubmit}>
            <div className="login-box">
                <h2 className="heading">Login</h2>
                <form>
                    <label htmlFor="email">Email</label>
                    <input className="email" type="email" id="email" onChange={(e) => setEmail(e.target.value)}/>

                    <label htmlFor="password">Password</label>
                    <input className="password" type="password" id="password" onChange={(e) => setPassword(e.target.value)}/>

                    <input type="submit" className="submit" />
                </form>
                <p className="subheading">Do not have an account? <Link to="/signup">Signup</Link></p>
            </div>
        </div>
    );
}

export default Login;