const mongoose = require('mongoose');

let dbname = process.env.DB_NAME || 'ToothLabMX2'
let dbProd = process.env.URL_SERVER || 'mongodb+srv://admin:admin%401998@toothlabmx2.bvx3g5s.mongodb.net'


mongoose.connect(dbProd + '/' + dbname).then(() => {

    if (process.env.URL_SERVER.includes('admin')) {

        console.log('Se conecto a la DB PRODUCION', process.env.DB_NAME)

    } else {
        console.log('Se conecto a la DB Local', process.env.DB_NAME)

    }

}).catch((e) => {
    console.error('Error al conetarse a a db', e)

});


module.exports = mongoose




