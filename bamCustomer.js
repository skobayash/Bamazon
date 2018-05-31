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
  
// Connect to MySQL server & SQL database
connection.connect(function(err) {
    if (err) throw err;
    displayItems()
    userPrompt();
});


/* Prompt User About Purchase (Function)*/
function userPrompt() {
    // Main menu list prompt
    connection.query("SELECT * FROM bamazon_db.products", function(err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "itemID",
                type: "input",
                message: "what is the item ID of the product you would like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "numUnits",
                type: "input",
                message: "How many would you like to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            // Local variable for storing results
            var chosenItem;

            // Loop through results until they match the user input
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id == answer.itemID) {
                    chosenItem = results[i];
                }
            }

            // Local variables to store sale and updated stock quantity info
            var newQuantity = chosenItem.quantity - answer.numUnits
            var totalSale = (parseInt(answer.numUnits) * chosenItem.price)

            // Determine if there is enough of the item in stock
            if (chosenItem.quantity >= parseInt(answer.numUnits)) {
                // Update stock quantity
                connection.query(
                    "UPDATE bamazon_db.products SET ? WHERE ?",
                    [
                      {
                        quantity: newQuantity
                      },
                      {
                        item_id: chosenItem.item_id
                      }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("You purchased " + answer.numUnits + " " + chosenItem.product_name + ".")
                        console.log("Your total purchase is $" + totalSale + ".");
                    },
                );
                // Update total sales amount
                connection.query(
                    "UPDATE bamazon_db.products SET ? WHERE ?",
                    [
                        {
                            product_sales: chosenItem.product_sales + totalSale
                        },
                        {
                            item_id: chosenItem.item_id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                    },
                );
                connection.end();
            }
            else {
                console.log("We do not have enough of this item in stock at this time. Please try again soon.");
            }
        });
    });
}
    
  
/* Display Store Items (Function) */
function displayItems() {
    connection.query("SELECT * FROM bamazon_db.products", function(err, results) {
        if (err) throw err;
        
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Price ($)']
        });
         
        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].item_id, results[i].product_name, results[i].price]
            );
        }

        console.log(table.toString());
        // connection.end();
    });
};




