const express = require('express')
const cors = require("cors");
const noteModel = require('./models/note.model')


const app = express();

app.use(cors());
app.use(express.json());


app.post("/notes", async (req,res)=>{

    const data = req.body
    await noteModel.create({
        id: data.id,
        title: data.title,
        discription: data.discription
    })

    res.status(201).json({
        message: "note created"
    })
})

app.get("/notes", async (req,res)=>{

     const notes =  await noteModel.find() //[]

     res.status(201).json({
        message: "Notes Fetched successfully",
        notes: notes
     })

})

app.delete("/notes/:id", async (req,res)=>{

    const id = req.params.id
    await noteModel.findOneAndDelete({_id: id})

    res.status(201).json({
        message: "note deleted"
    })
})

app.patch("/notes/:id", async (req,res)=>{

    const id = req.params.id
    const discription = req.body.discription

    await noteModel.findOneAndUpdate({_id: id}, {
        discription: discription
    })

    res.status(201).json({
        message: "note updated"
    })
})


module.exports = app