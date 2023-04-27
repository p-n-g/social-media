const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

module.exports = async () => {
    const mongoUri =
    "mongodb+srv://prajvalgahine:nkUlUPlK34Q50m4s@cluster0.mmmjky8.mongodb.net/social-media?retryWrites=true&w=majority";
  try {
    const connect = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (e) {
    process.exit(1);
  }
};
