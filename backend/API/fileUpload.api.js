const mongoose = require("mongoose");
const multer = require("multer")

const Grid = require('gridfs-stream');
const path = require("path");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
module.exports = function fileUpload(app) {
    const mongoURI = "mongodb+srv://LMS_db:123@cluster0-2uup7.mongodb.net/test?retryWrites=true&w=majority"
    // const mongoURI = "mongodb://localhost:27017/LMS"

    const conn = mongoose.createConnection(mongoURI);
    let gfs;

    conn.once('open', () => {
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('fs');
    })


    const storage = new GridFsStorage({
        url: mongoURI,
        File: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'fs'
                    };
                    resolve(fileInfo);
                });
            });
        }
    });
    const upload = multer({ storage });

    app.post('/upload', upload.single('file'), (req, resp) => {
        resp.json({ file: req.file });

    })

    app.post('/download', function (req, res, next) {
        filepath = path.join(__dirname, '../fs') + '/' + req.body.filename;
        res.sendFile(filepath);
    });
    app.get('/files', (req, resp) => {
        gfs.files.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                return resp.status(404).json({
                    err: 'No files '
                });

            }
            return resp.json(files);
        })
    })
    app.delete('/delfile/:id', (req, resp) => {
        gfs.remove({ _id: req.params.id, root: 'fs' }, (err, gridStore) => {
            if (err) {
                return resp.status(404).json({ err: err });
            }
        })
        return resp.json("success");
    })


}