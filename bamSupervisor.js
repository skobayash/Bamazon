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
    start();
});


/* Start (Function) */
function start() {
    // Main menu prompt list
    inquirer.prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ["View product sales by department", "Create new department", "Exit"]
    })
    .then(function(answer) {

        switch (answer.action) {
            case "View product sales by department":
                viewSales();
                break;
            case "Create new department":
                createDepartment();
                break;
            case "Exit":
                exitSupervisor();
                break;
        }

    });
}

/* View Sales (Function) */
function viewSales() {

    var table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Costs($)', 'Product Sales($)', 'Total Profit($)']
    });


    var query = "SELECT departments.dep_id, departments.dep_name, departments.overhead_costs, "
    query += "SUM(products.product_sales) AS product_sales, (-departments.overhead_costs + "
    query += "SUM(products.product_sales)) AS total_profit FROM departments LEFT JOIN products "
    query += "ON departments.dep_name = products.department_name GROUP BY departments.dep_id ASC;"
 
    connection.query(query, function(err, results) {
        if (err) throw err;
        // push information into CLI table and log table to terminal 

        // console.log(results);
        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].dep_id, results[i].dep_name, results[i].overhead_costs, results[i].product_sales, results[i].total_profit]
            );
        }
        console.log("\n" + table.toString() + "\n");
        start();
    });

};



/* Create New Department (Function) */
function createDepartment() {
    // Prompt for info about name and overhead costs of new department
    inquirer.prompt([
        {
            name: "newDepartment",
            type: "input",
            message: "What department would you like to add?"
        },
        {
            name: "newCosts",
            type: "input",
            message: "What are the overhead costs for this department?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer) {
        // Insert user input into SQL departments table
        connection.query(
            "INSERT INTO bamazon_db.departments SET ?",
            {
                dep_name: answer.newDepartment,
                overhead_costs: answer.newCosts,
            },
            function(err) {
                if (err) throw err;
                console.log("\n" + answer.newDepartment + " was added as a department \n");
                start();
            }
        )
    });
}




/* Exit node supervisor.js (Function) */
function exitSupervisor() {
    console.log("Exited successfully.")
    connection.end();
}