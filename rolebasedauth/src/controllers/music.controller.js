const musicModel = require('../models/music.model')
const albumModel = require('../models/album.model')
const { uploadFile } = require('../services/storage.service')

const jwt = require('jsonwebtoken')

async function createMusic(req, res) {

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id,
    })

    res.status(201).json({
        message: "music created succesfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    })


}

async function createAlbum(req, res) {
    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        artist: req.user.id,
        musics: musics
    })

    res.status(201).json({
        message: "Album Created Successfully",
        album: {
            id: album._id,
            title: album.title,
            artist: album.artist,
            musics: album.musics,
        }
    })

}

async function getAllMusics(req, res) {

    const musics = await musicModel
    .find()
    .limit(15)
    .populate("artist", "username email")

    res.status(200).json({
        message: "Music Fetched Successfully",
        musics: musics,
    })

}

async function getAllAlbums(req, res) {

    const albums = await albumModel.find().select("title artist").populate("artist", "username email")

    res.status(200).json({
        message: "Album Fetched Successfully",
        albums: albums,
    })

}

async function getAlbumById(req, res) {
    try {
        const albumId = req.params.albumId;

        const album = await albumModel
            .findById(albumId)
            .populate("artist", "username")
            .populate("musics");

        if (!album) {
            return res.status(404).json({
                message: "Album not found"
            });
        }

        return res.status(200).json({
            message: "Album Fetched Successfully",
            album: album
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error fetching album",
            error: error.message
        });
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }