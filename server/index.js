const express = require("express");
const dotenv = require("dotenv");
const mainRouter = require("./routes");
const connectDB = require("./connectDB");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;


dotenv.config({
    path: "./.env",
});

const app = express();
app.use(express.json({limit: "10mb"}));
app.use(morgan("common"));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));
// cloudinary.config({
//     cloud_name: "dqljxm4mq",
//     api_key: "322971986284246",
//     api_secret: "sSgkxJpwPHG0JsVMYZbbPSKaP3I",
// });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api", mainRouter);

connectDB();


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("listening to port ", PORT);
});