// job of this middleware is to check whether a valid access token has been send in req or not
const jwt = require("jsonwebtoken");
const {error} = require("../utils/responseWrapper");
const User = require("../models/User");

const requireUser  = async(req, res, next) => {
    if(!req.headers?.authorization?.startsWith("Bearer")){
        return res.json(error(401, "invalid access token or authorization header is missing"));
    }
    try{
        // jwt.verify throws an error if the access token is not verified
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.ACCESS_TOKEN_PRIVATE_KEY);
        const user = await User.findById(decoded._id);
        if(!user){
            return res.json(error(404, "user not found"));
        }
        req._id = decoded._id;
        next();
    } catch(e){
        console.log(e.message);
        res.json(error(401, "invalid access token"));
    }
}

module.exports = requireUser;