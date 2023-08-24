const mysql = require("mysql2")
const inquirer = require("inquirer")

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        //TODO: Add MySQL password here
        database: 'employees_db'
    },
    console.log('Successfuly connected to the employees_db database.')
);