const mysql = require("mysql2")
const inquirer = require("inquirer")

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'waffles',
        database: 'employees_db'
    },
    console.log('Successfuly connected to the employees_db database.')
);

async function queryRoles() {
    return new Promise((resolve, reject) => {
        db.query("select * from role", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        })
    })
}

async function queryEmployees() {
    return new Promise((resolve, reject) => {
        db.query("select * from employee", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        })
    })
}

async function queryDepartment() {
    return new Promise((resolve, reject) => {
        db.query("select * from department", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        })
    })
}

async function queryManagers() {
    return new Promise ((resolve, reject) => {
        db.query("select * from manager", function (err, results) {
            if (err) return reject(err);
            resolve(results);
        })
    })
}


function init() {
    inquirer
        .prompt({
            name: "initialQuestion",
            type: "list",
            message: "What do you want to do?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add a manager",
                "add an employee",
                "update an employee role",
                "EXIT",
            ],
        })
        .then((answers) => {
            switch (answers.initialQuestion) {
                case "view all departments":
                    viewAllDepartments();
                    break;   
                case "view all roles":
                    viewAllRoles();
                    break;
                case "view all employees":
                    viewAllEmployees();
                    break;
                case "add a department":
                    addDepartment();
                    break;
                case "add a role":
                    addRole();
                    break;
                case "add a manager":
                    addManager();
                    break;
                case "add an employee":
                    addEmployee();
                    break;
                case "update an employee role":
                    updateEmployeeRole();
                    break;
                case "EXIT":
                    db.end();
                    break;
                default:
                    break;
            }
        });
}

function viewAllDepartments() {
    db.query("select * from department", function (err, res) {
        console.log("Here are all of the current departments:");
        console.table(res);
        init();
    })
}

function viewAllRoles() {
    db.query("select * from role", function (err, res) {
        console.log("Here are all of the current roles:");
        console.table(res);
        init();
    })
}

function viewAllEmployees() {
    db.query("select e1.first_name, e1.last_name, CONCAT(e2.first_name, ' ' , e2.last_name) AS manager from employee e1 INNER JOIN employee e2 ON e1.manager_id = e2.id", function (err, res) {
        console.log("Here are all of the current employees:");
        console.table(res);
        init();
    })
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "deptName",
        message: "What department would you like to add?"
    }).then((response) => {
        console.log(response.deptName);
        db.query("INSERT INTO department SET ?",
            { deptName: response.deptName },
            function (err) {
                if (err) throw err;
                init();
            }
        )
    })
}

async function addRole() {
    const department = await queryDepartment()

    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the role you would like to add?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the new role?"
        },
        {
            type: "list",
            name: "department",
            message: "Which department does this role fall under?",
            choices: department.map((deptName) => ({ name: deptName.deptName, value: deptName.id }))
        },
    ]).then((response) => {
        db.query("INSERT INTO role SET ?",
            {
                title: response.title,
                salary: response.salary,
                department_id: response.department,
            },
            function (err) {
                if (err) throw err;
                init();
            }
        )
    })
}

async function addManager() {
    const roles = await queryRoles()

    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Please enter the manager's first name:"
        },
        {
            name: "lastName",
            type:"input",
            message: "Please enter the manager's last name:"
        },
        {
            name: "roleId",
            type: "list",
            message: "What is the employee's role at the company?",
            choices: roles.map((role) => ({ name: role.title, value: role.id }))
        },
    ]).then((response) => {
        db.query(
            "INSERT INTO manager SET ?",
            {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: response.roleId,
            },
            function (err) {
                if (err) throw err;
                init();
            }
        )
    })
}
async function addEmployee() {
    const roles = await queryRoles()
    const managers = await queryManagers()
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Please enter the employee's first name:"
        },
        {
            name: "lastName",
            type: "input",
            message: "Please enter the employee's last name:"
        },
        {
            name: "roleId",
            type: "list",
            message: "What is the employee's role at the company?",
            choices: roles.map((role) => ({ name: role.title, value: role.id }))
        },
        {
            name: "managerId",
            type: "list",
            message: "What is the the employee's manager ID?",
            choices: managers.map((manager) => ({ name: manager.first_name + " " + manager.last_name, value: manager.id}))
        }
    ]).then((responses) => {
        db.query(
            "INSERT INTO employee SET ?",
            {
                first_name: responses.firstName,
                last_name: responses.lastName,
                role_id: responses.roleId,
                manager_id: responses.managerId,
            },
            function (err) {
                if (err) throw err;
                init();
            }
        )
    })
}


async function updateEmployeeRole() {
    const employees = await queryEmployees();
    const roles = await queryRoles();

    inquirer.prompt([
        {
            name: "employeeToUpdate",
            message: "Which employee's role will you be updating?",
            type: "list",
            choices: employees.map((employee) => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }))
        },
        {
            name: "roleId",
            type: "list",
            message: "What will be the new role for the selected employee?",
            choices: roles.map((role) => ({ name: role.title, value: role.id }),)
        }
    ]).then((responses) => {
        db.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: responses.roleId,
                },
                {
                    id: responses.employeeToUpdate
                }

            ],
            function (err) {
                if (err) throw err;
                init();
            }
        )
    })
}

init();