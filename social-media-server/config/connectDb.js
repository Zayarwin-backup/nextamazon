const { default: mongoose } = require("mongoose");

const connectdb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Mogodb connect success");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectdb;
