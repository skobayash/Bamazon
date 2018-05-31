# Bamazon

## Overview
Bamazon is a MySQL- and Node.JS-based Amazon-like storefront app. It takes in information
at customer, manager, and supervisor levels to modify the store's inventory. It also 
tracks product and department sales.

## Installation

To clone Bamazon to your local repository, enter the following in your terminal/bash window:
``` git clone https://github.com/skobayash/Bamazon.git ```

Install the following dependencies for Bamazon:
* inquirer
* cli-table
* mysql

``` npm install ```

## How It Works

### Customer View
Run the customer view by entering the following into your terminal/bash window:
``` node bamCustomer.js ```
A table containing the store's items and prices will automatically be logged to your
terminal.

You will then be prompted with two questions regarding the item and quantity
of the item you would like to purchase.

<img src="/assets/images/customer.gif" />

### Manager View
Run the manager view by entering the following into your terminal/bash window:
``` node bamManager.js ```

You will be prompted with 5 options:
1. View products for sale

⋅⋅⋅This will generate a table of all of the store's inventory including each product's ID, Name, Price, and the stock Quantity.
2. View low inventory items

⋅⋅⋅This will display the items with a stock Quantity under 5.
3. Add inventory

⋅⋅⋅This will prompt you with two questions regarding the item id of the item and amount you would like to restock.
4. Add new product

⋅⋅⋅This will prompt you with three questions regarding the name of the product, the department it falls into, and the number of products you would like to add to the store's inventory.
5. Exit

⋅⋅⋅This will exit from the manager view.


<img src="/assets/images/manager.gif" />

### Supervisor View
Run the supervisor view by entering the following into your terminal/bash window:
``` node bamSupervisor.js ```

You will be prompted with 3 options:
1. View product sales by department

⋅⋅⋅This will generate a table of individual departments, their ID's, overhead costs, product sales, and total profit.
2. Create new department

⋅⋅⋅This will prompt you for the name of the new department and its overhead costs before adding it to the departments table.
3. Exit

⋅⋅⋅This will exit from the supervisor view.

<img src="/assets/images/supervisor.gif" />