const express = require('express')
const multer = require('multer')
const cors = require("cors");
const postModel = require('./models/post.model')
const uploadFile = require('./services/storage.service')



const app = express();

const upload = multer({storage: multer.memoryStorage()})

app.use(cors());
app.use(express.json());

app.post("/create-post", upload.single('post'), async (req, res) => {

    console.log(req.body)
    console.log(req.file)

    const result = await uploadFile.uploadFile(req.file.buffer)

    const post = await postModel.create({
        post:result.url,
        caption:req.body.caption
    });

    return res.status(201).json({
        message:"Post created successfully",
        post
    })

})

app.get("/posts", async (req, res) => { 

    const posts = await postModel.find()

    return res.status(200).json({
        message:"Posts fetched successfully",
        posts
    })
})


module.exports = app