const mysql = require("mysql2")

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "RootLocalHost1.",
    database: "sigeas"
})

connection.connect(function(err) {
    if(err) {
        throw err
    } else {
        console.log("Mysql conectado")
    }
})

module.exports = connection