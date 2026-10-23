const userModel = require('./../models/user.model');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {

    const { username, email, password } = req.body;

    const isuserAlreadyExists = await userModel.findOne({
        email
    })

    if(isuserAlreadyExists) {
        return res.status(409).json({
            message: "user alrady exist"
        })
    }

    const user = await userModel.create({ username, email, password });

    const token = jwt.sign(
        { id : user._id,},
        process.env.JWT_SECRET //jwtsecrete.com 
    )

    res.cookie("token", token)
    res.status(201).json({
        message: "User Register succsesfully",
        user

    })


}

module.exports = {registerUser};