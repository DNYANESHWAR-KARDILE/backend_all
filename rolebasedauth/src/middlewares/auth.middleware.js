const jwt = require('jsonwebtoken')

async function authArtist(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: "unautherized"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== "artist") {
            return res.status(403).json({ message: "you don't have access to create an music Album" })
        }

        req.user = decoded;

        next()

    }catch(err){
        console.log(err);
        return res.status(401).json({message: "unautherized"})
    }
    
}


async function authUser(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({message: "unautherized"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if ( decoded.role !== "user") {
            return res.status(403).json({ message: "you don't have access" })
        }

        req.user = decoded;

        next()

    }catch(err){
        console.log(err);
        return res.status(401).json({message: "unautherized"})
    }
    
}

module.exports = {authArtist , authUser}