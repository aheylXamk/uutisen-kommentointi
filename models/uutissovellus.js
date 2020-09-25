const fs = require("fs");
const kommentit = "./models/kommentit.json";
const uutiset = "./models/uutiset.json";
const kayttajat = "./models/kayttajat.json";


module.exports = {

    "haeUutiset" : (callback) => {

        fs.readFile(uutiset, "utf-8", (err, data) => {

            if (err) throw err;

            let uutisia = JSON.parse(data);

            callback(uutisia);

        });
    },


    "lisaaKommentti" : (uusi, callback) => {

        fs.readFile(kommentit, "utf-8", (err, data) => {

            if (err) throw err;

            let kirjoitukset = JSON.parse(data);

            kirjoitukset.push(uusi);

            fs.writeFile(kommentit, JSON.stringify(kirjoitukset), (err) => {

                if (err) throw err;

                callback();
            });
        });
    },

    "haeKayttaja" : (tunnus, callback) => {

        fs.readFile(kayttajat, "utf-8", (err, data) => {

            if (err) throw err;

            let kayttajat = JSON.parse(data);

            let indeksi = kayttajat.findIndex((kayttaja) => {

                return kayttaja.tunnus == tunnus;

            });

            if (indeksi >= 0) {

                callback(kayttajat[indeksi]);

            } else {

                callback(null);
            }
            
        });

    }

};