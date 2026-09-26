const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    post: String,
    caption: String,
})

const postModel = mongoose.model("post",postSchema)

module.exports = postModel