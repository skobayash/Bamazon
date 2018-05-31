var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});
  
// Connect to the MySQL server & SQL database
connection.connect(function(err) {
    if (err) throw err;
    start();
});


/* Start (Function) */
function start() {
    // Prompt Main Menu List
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"]
    })
    .then(function(answer) {

        switch (answer.action) {
            case "View products for sale":
                viewProducts();
                break;
            case "View low inventory":
                lowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                newProduct();
                break;
            case "Exit":
                exitManager();
                break;
        }

    });
}


/* View Products (Function) */
function viewProducts() {
    connection.query(
        "SELECT * FROM bamazon_db.products", 
        function(err, results) 
        {
            // Table variable
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Price ($)', 'Quantity']
            });

            // For each result, push info into table
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].price, results[i].quantity]
                );
            }

            // Log table in terminal
            console.log("\n" + table.toString() + "\n");
   
            if (err) throw err;
            start();

        }
    );
};



/* Display Low Inventory (Function) */
function lowInventory() {
    connection.query("SELECT * FROM bamazon_db.products", function(err, results) {        
       
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Quantity']
        });
        
        // For each result, push info into table if stock quantity is under 5
        for (var i = 0; i < results.length; i++) {
            if (results[i].quantity < 5) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].quantity]
                );
            }
        }

        console.log("\n" + table.toString() + "\n");
        if (err) throw err;

        start();
    });
}



/* Add Inventory (Function) */
function addInventory() {

    connection.query("SELECT * FROM bamazon_db.products", function(err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "addItem",
                type: "input",
                message: "what is the item ID of the product you would like to add?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "addUnits",
                type: "input",
                message: "How many would you like to add?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            
            // Local variable to store results info
            var chosenItem;

            // Loop through results until they match the user input
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id == answer.addItem) {
                    chosenItem = results[i];
                }
            }

            // Local variable to store updated stock quantity
            var newQuantity = parseInt(chosenItem.quantity) + parseInt(answer.addUnits)
            
            connection.query(
                "UPDATE bamazon_db.products SET ? WHERE ?",
                [
                    { quantity: newQuantity },
                    { item_id: chosenItem.item_id }
                ],
                function(error) {
                    if (error) throw err;
                    console.log("\nItems added successfully.");
                    console.log("The total number of " + chosenItem.product_name + " is now " + newQuantity + "\n");
                    start();
                }
            );
            
        });
    });
}



/* Add New Product (Function) */
function newProduct() {
    // prompt for info about the item being put up for auction
    inquirer.prompt([
        {
            name: "newItem",
            type: "input",
            message: "What new product would you like to add?"
        },
        {
            name: "newDepartment",
            type: "input",
            message: "What department does this fall under?"
        },
        {
            name: "newPrice",
            type: "input",
            message: "What is the price of this item?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        },
        {
            name: "newQuantity",
            type: "input",
            message: "How many would you like to add?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        // Insert new info into products table
        connection.query(
          "INSERT INTO bamazon_db.products SET ?",
          {
            product_name: answer.newItem,
            department_name: answer.newDepartment,
            price: answer.newPrice,
            quantity: answer.newQuantity
          },
          function(err) {
            if (err) throw err;
            console.log("\n" + answer.newItem + " were successfully added to the store.\n");
            start();
          }
        );
    });
}

    
/* Exit (Function) */
function exitManager() {
    console.log("Exited successfully.")
    connection.end();
}