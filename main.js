const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const uutissovellus = require("./models/uutissovellus");

const session = require("express-session");
const crypto = require("crypto");

const portti = 3106;

const fs = require("fs");

let kommentit = [];

fs.readFile("./models/kommentit.json", "utf-8", (err, data) => {   

    if (err) throw err;

    kommentit = JSON.parse(data);

});

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { "extended" : true }));

app.use(session({
                     "secret" : "ÄkäsLompolo!",
                     "resave" : false,
                     "saveUninitialized" : false 
                }));

app.use("/uutinen/", (req, res, next) => {                     

    if (!req.session.saaTulla && req.path != "/login/") {
                
    res.render("login", { "virhe" : null });
                
    } else {
                
    next();
                
    }
                
});

app.post("/login/", (req, res) => {

    uutissovellus.haeKayttaja(req.body.tunnus, (kayttajatiedot) => {

        if (kayttajatiedot) {

            let tiiviste = crypto.createHash("SHA512").update(req.body.salasana).digest("hex");

            if (kayttajatiedot.salasana == tiiviste) {

                req.session.saaTulla = true;

                res.redirect("/uutinen/");

            } else {

                req.session.saaTulla = false;

                let virhe = "Virheellinen käyttäjätunnus tai salasana.";

                res.render("login", { "virhe" : virhe });
            }


        } else {

            req.session.saaTulla = false;

            let virhe = "Virheellinen käyttäjätunnus tai salasana.";

            res.render("login", { "virhe" : virhe });
        }

    });





});

app.post("/tallenna/", (req, res) => {

    let uusiKommentti = {
                            "uutisId" : req.body.uutisId,
                            "nimimerkki" : req.body.nimimerkki,
                            "kommentti" : req.body.kommentti,
                            "paivamaara" : new Date().getTime()
                        };

    uutissovellus.lisaaKommentti(uusiKommentti, () => {

        res.redirect("/uutinen/");

    });
});

app.get("/", (req, res) => {

    uutissovellus.haeUutiset( (uutisia) => {

        res.render("index", { "uutisia" : uutisia });
    });
});

app.get("/uutinen/", (req, res) => {

    uutissovellus.haeUutiset( (uutisia) => {

        res.render("uutinen", { "uutisia" : uutisia, "kommentit" : kommentit });
    });

});

app.get("/login/", (req,res) => {

    let otsikko = "Kirjaudu sisään";

    res.render("login", { "virhe" : null } );
});




app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin: ${portti}`);

});