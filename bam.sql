DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  quantity INT(11) NULL,
  product_sales INT(11) default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, quantity, price)
VALUES 
("hoodies", "clothing", 30, 25), 
("t-shirts", "clothing", 35, 20), 
("stickers", "accessories", 3, 3), 
("water bottles", "kitchen", 40, 12),
("beanies", "clothing", 1, 15),
("bumper stickers", "accessories", 25, 7),
("travel mugs", "kitchen", 25, 1),
("backpacks", "clothing", 30, 45),
("mugs", "kitchen", 20, 10),
("baseball caps", "clothing", 20, 15);


CREATE TABLE departments(
  dep_id INT NOT NULL AUTO_INCREMENT,
  dep_name VARCHAR(100) NULL,
  overhead_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (dep_id)
);


INSERT INTO departments (dep_name, overhead_costs)
VALUES 
("clothing", 50), 
("accessories", 25),
("kitchen", 50);


SELECT * FROM bamazon_db.products LIMIT 1000;