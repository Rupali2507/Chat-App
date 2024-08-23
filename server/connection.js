const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = { connectToMongoDB };
