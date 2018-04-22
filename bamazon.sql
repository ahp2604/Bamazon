DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id NOT NULL,
    products_name VARCHAR(80) NULL,
    department_name VARCHAR(80) NULL,
    price FLOAT NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (id) AUTO_INCREMENT,
);