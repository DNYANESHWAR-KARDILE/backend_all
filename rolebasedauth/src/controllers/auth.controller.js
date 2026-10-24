const userModel = require('./../models/user.model')
const jwt = require('jsonwebtoken')

async function registerUser (req, res) {
    const {username, email, password, role="user"} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({message: "user already exists"})
    }

    const user = await userModel.create({
        username,
        email,
        password,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    },process.env.JWT_SECREAT)

    res.cookie("token", token)

    res.status(201).json({
        message: "User Registerd Successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}