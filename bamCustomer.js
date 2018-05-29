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
  
  // connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    userPrompt();
    // displayItems()
});



function userPrompt() {

    connection.query("SELECT * FROM bamazon_db.products", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
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
                message: "How many *products* would you like to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            // get the information of the chosen item
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
              if (results[i].item_id == answer.itemID) {
                chosenItem = results[i];
              }
            }
            
            console.log(chosenItem.quantity)
            console.log(answer.numUnits)
  
            console.log(chosenItem.item_id)
            var newQuantity = chosenItem.quantity - answer.numUnits

            // determine if there is enough of the item in stock
            if (chosenItem.quantity >= parseInt(answer.numUnits)) {
                // bid was high enough, so update db, let the user know, and start over
                connection.query(
                    "UPDATE bamazon_db.products SET ? WHERE ?",
                    [
                        { quantity: newQuantity },
                        { item_id: chosenItem.item_id }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("Your purchase was successful.");
                        console.log("Your total purchase is $" + (parseInt(answer.numUnits) * chosenItem.price));
                    }
                );
            }
            else {
                console.log("We do not have enough of this item in stock at this time. Please try again soon.");
            }
        });
    });
}
    




  

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
        connection.end();
    });
};


/*
if (chosenItem.quantity >= parseInt(answer.numUnits)) {
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
            // console.log("Your purchase was successful.")
            // function(error) {
            //     if (error) throw err;
            //     console.log("Your purchase was successful.")
            //     //   start();
            // }
        );
}
else {
  // bid wasn't high enough, so apologize and start over
  console.log("We do not have enough of this item in stock. Please try again.");
//   start();
}
*/