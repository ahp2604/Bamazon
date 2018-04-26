DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL auto_increment,
    products_name VARCHAR(80) NULL,
    department_name VARCHAR(80) NULL,
    price FLOAT NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);