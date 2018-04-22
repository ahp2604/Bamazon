var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql. createConnection({
    host: localhost,
    port: 3306,
    user: "Root",
    password: "pionner123",
    database: "bamazon"
});