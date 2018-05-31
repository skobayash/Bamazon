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
    start();
});


function start() {
    inquirer
      .prompt({
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
                // createDepartment();
                break;
            case "Exit":
                // exitSupervisor();
                break;
        }

    });
}

// dep_id || dep_name || overhead_costs || product_sales || total_profit

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
        
         
        for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].dep_id, results[i].dep_name, results[i].overhead_costs, results[i].product_sales]
            );
        }
        console.log(table.toString());
    });

    connection.end();
};


function exitSupervisor() {
    console.log("Exited successfully.")
    connection.end();
}