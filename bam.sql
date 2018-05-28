DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT(11) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT(11) default 0,
  quantity INT(11) default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES 
("hoodies", "clothing", 30, 25), 
("t-shirts", "clothing", 35, 20), 
("stickers", "accessories", 50, 3), 
("water bottles", "kitchen", 40, 12),
("beanies", "clothing", 30, 15),
("bumper stickers", "accessories", 25, 7),
("travel mugs", "kitchen", 25, 12),
("backpacks", "clothing", 30, 45),
("mugs", "kitchen", 20, 10),
("baseball caps", "clothing", 20, 15);



