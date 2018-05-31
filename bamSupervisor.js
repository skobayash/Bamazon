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
        head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales']
    });

   // SELECT department_name, SUM(product_sales * products.price) FROM products GROUP BY department_name ORDER BY item_id ASC;

    var query = "SELECT departments.dep_id, departments.dep_name, departments.overhead_costs, products.product_sales ";
    query += "FROM departments INNER JOIN products ON departments.dep_name = products.department_name ";
   
    // var query =  " SELECT departments.dep_id, departments.dep_name, departments.overhead_costs," 
    // query += " SUM(products.product_sales) AS total_sales, (SUM(products.product_sales) - departments.overhead_costs) "
    // query += "AS total_profit FROM departments INNER JOIN products ON departments.dep_name=products.department_name "
    // query += "GROUP BY dep_id ORDER BY dep_id ASC";

    connection.query(query, function(err, results) {
        if (err) throw err;
        // push information into CLI table and log table to terminal 
        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].dep_id, results[i].dep_name, results[i].overhead_costs, results[i].product_sales]
            );
        }
        console.log(table.toString());
    });

    connection.end();
};


/* Create New Department (Function) */
function createDepartment() {
    // Prompt for info about name and overhead costs of new department
    inquirer.prompt([
    {
        name: "new-department",
        type: input,
        message: "What is the name of the department you would like to add?"
    },
    {
        name: "overhead-costs",
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
                dep_name: answer.new-department,
                overhead_costs: answer.overhead-costs,
            },
            function(err) {
                if (err) throw err;
                console.log("\n" + answer.new-department + " was added as a department \n");
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