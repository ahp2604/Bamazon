
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
    managerView();
})

function managerView() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please choose of the following options:",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add to Inventory":
                    addStocks();
                    break;
                case "Add New Product":
                    addME();
                    break;
            }

        })
};
function viewProducts() {
    connection.query("SELECT item_id, products_name, department_name, price, stock_quantity   FROM products", function (err, res) {
        if (err) throw err;
        console.log(`\n*---------------- PRODUCT LISTS ----------------*\n`)
        console.table(res);
        managerView();
    })
};

function lowInventory() {
    connection.query("SELECT item_id AS 'Item ID', products_name AS 'Product Name', price AS 'Price', stock_quantity AS 'Units In Stock' FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        if (res.length == 0) {
            console.log("All products have 5 Units or more!")
            managerView();
        } else {
            console.table(res);
            managerView();
        };
    })
    
};

function addStocks() {
    connection.query("SELECT item_id AS 'Item ID', products_name AS 'Product Name', price AS 'Price', stock_quantity AS 'Units In Stock' FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer
            .prompt([
                {
                    name: "itemID",
                    type: "input",
                    message: "Please provide the item ID you would like to Update inventory",
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
                    message: "Please provide the amount of this product you would like to add to invetory",
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
                    var selectedItem = res[0];
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: (selectedItem.stock_quantity + parseInt(answer.amount))
                            },
                            {
                                item_id: answer.itemID
                            }
                        ], function (error, response) {
                            if (error) throw error;
                            console.log(`---------- \nYou have succesfully added ${answer.amount} Units of ${selectedItem.products_name}! \n---------- `)
                            managerView();

                        });
                });

            });
    });
};

function addME() {
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "Please enter in Name of the product"
            },
            {
                name: "deptName",
                type: "input",
                message: "Please enter the Department's name this product belong to"
            },
            {
                name: "price",
                type: "input",
                message: "Please provide Price Per Unit",
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
                name: "stock",
                type: "input",
                message: "Please provide available Units for this product",
                validate: function (value) {
                    if ((isNaN(value) === false) && (value % 1 == 0)) {
                        return true;
                    }
                    else if (value % 1 !== 0) {
                        return `Please enter a whole Number`;
                    }

                }
            }
        ]).then(function (answer) {
            connection.query("INSERT INTO products SET ?", [

                {
                    products_name: answer.productName
                    ,

                    department_name: answer.deptName
                    ,

                    price: answer.price
                    ,

                    stock_quantity: answer.stock
                }

            ], function (err, res) {
                if (err) throw err;
                console.log(`You have added ${answer.stock} Units of ${answer.productName} to ${answer.deptName} Department. The pricing for each of these Unit is $${answer.price}. `)
                managerView();

            })
        })
}