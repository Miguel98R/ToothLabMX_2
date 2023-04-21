const mongoose = require('mongoose');

let dbname = process.env.DB_NAME || 'ToothLabMX2'
let dbProd = process.env.URL_SERVER || "mongodb+srv://admin:admin%401998@toothlabmx2.bvx3g5s.mongodb.net"

mongoose.connect(dbProd + '/' + dbname).then(() => {

    if (dbProd.includes('admin')) {

        console.log('Se conecto a la DB PRODUCION', dbname)

    } else {
        console.log('Se conecto a la DB Local', dbname)

    }

}).catch((e) => {
    console.error('Error al conetarse a a db', e)

});


module.exports = mongoose




