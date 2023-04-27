
import {MdLocationOn} from "react-icons/md"
import {BsFillTelephoneFill} from "react-icons/bs"
import {AiFillMail, AiFillInstagram, AiFillTwitterCircle, AiFillFacebook, AiFillYoutube} from "react-icons/ai"
import "./Footer.scss";

function Footer() {
    return (
        <div className="Footer">
            <div className="about">
                <h2>More About Us</h2>
                <p>Social Media is an application where a user can virtually be social and connect with their family, friends and/or celebrities. It give certain feature so that user can seamlessly create an account, create a post, like or dislike a post, follow or unfollow other users</p>
            </div>
            
            <div className="follow">
                <h2>Follow Us</h2>
                <ul>
                    <li><a href="https://www.instagram.com/mr_png"><AiFillInstagram /> Instagram</a></li>
                    <li><a href="https://www.twitter.com/mr__png"><AiFillTwitterCircle /> Twitter</a></li>
                    <li><a href="https://www.facebook.com/prajval.gahine.3/"><AiFillFacebook /> Facebook</a></li>
                    <li><a href="https://www.youtube.com/channel/UCBJ8xVgQgx0UTU1ufOm00nA"><AiFillYoutube /> Youtube</a></li>
                </ul>
            </div>

            <div className="contact">
                <h2>Contact To Us</h2>
                <ul>
                    <li><MdLocationOn /> Surat, Gujarat</li>
                    <li><BsFillTelephoneFill /> +91 9924380554</li>
                    <li><AiFillMail /> prajvalgahine7121@gmail.com</li>
                </ul>
            </div>
        </div>
    );
}

export default Footer;