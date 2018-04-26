
var mysql = require('mysql');
var inquirer = require('inquirer');
var consoleTable = require("console.table")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "pioneer123",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    populateALL();
})

function populateALL() {

    console.log(`\n\n\n----- Here are all products available at this time ----- \n`);
    connection.query("SELECT * FROM products;", function (err, res) {
        if (err) throw err;
        console.table(res);
    })
    customerOrder();
};

function customerOrder() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "itemID",
                    type: "input",
                    message: "Please provide the item ID you would like to buy",
                    validate: function (value) {
                        if (isNaN(value)) {
                            return "Please enter a Number!";
                        }
                        else if (isNaN(value) == false) {
                            return true;
                        }
                    }
                },
                {
                    name: "amount",
                    type: "input",
                    message: "Please provide the amount of this product you would like to buy",
                    validate: function (value) {
                        if ((isNaN(value) === false) && (value % 1 == 0)) {
                            return true;
                        }
                        else if (value % 1 !== 0) {
                            return `Please enter a whole Number`;
                        }

                    }
                }
            ])
            .then(function (answer) {
                var query = "SELECT products_name, department_name, price, stock_quantity FROM products WHERE ?";
                connection.query(query, { item_id: answer.itemID }, function (err, res) {
                    if (err) throw err;
                    if (answer.amount > res[0].stock_quantity) {
                        console.log(`---------- \nAlert: We don't have enough to supply. \nMaximum amount of ${res[0].products_name}'s quantity we could supply at this time is ${res[0].stock_quantity} Units.\n---------- \nPlease re-enter item ID and modify you order quanity! \n`)
                        customerOrder();
                    }
                    else {
                        var selectedItem = res[0];
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: (selectedItem.stock_quantity - answer.amount)
                                },
                                {
                                    item_id: answer.itemID
                                }
                            ], function (error, response) {
                                if (error) throw error;
                                console.log(`---------- \nYou have succesfully bought ${answer.amount} Units of ${selectedItem.products_name}! \nYour Total is: $${selectedItem.price * answer.amount}\n---------- `)

                                connection.end();

                            }
                        )
                    }

                });
            })

    })
};

