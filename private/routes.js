var path = require("path");
var fs = require("fs");
let noteData = require('../db/db.json');

module.exports = function (app) {
    // API ROUTES
    app.get("/api/notes", (req, res) => {
        fs.readFile("./db/db.json", (err, data) => {
            if (err) throw err;
            return res.json(JSON.parse(data));
        });
    });

    app.post("/api/notes", (req, res) => {
        let inputtedData = req.body;

        // Add a unique id to the note
        let uid = genRandomNum(1, 9999);
        inputtedData["id"] = uid;

        noteData.push(inputtedData);
        fs.writeFile('./db/db.json', JSON.stringify(noteData), (err) => {
            if (err) throw err;
            return res.json(inputtedData);
        });
    });

    app.delete("/api/notes/:id", (req, res) => {
        let deletionTarget = req.params.id;
        for (i = 0; i < noteData.length; i++) {
            if (deletionTarget == noteData[i].id) {
                noteData.splice(i, 1);
            }
        }
        fs.writeFile("./db/db.json", JSON.stringify(noteData), (err) => {
            if (err) throw err;
            return;
        });
        res.end();
    });
    
    // HTML ROUTES
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "./public/index.html"));
    });
};

function genRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}