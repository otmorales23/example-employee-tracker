USE employees_db;

INSERT INTO department (deptName) VALUES
("Marketing"),
("Legal");

INSERT INTO role (title, salary, department_id) VALUES
("Web Designer", 120000, 1),
("Attorney", 80000, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
("Andy", "Bernstein", 1, 1),
("Harvey", "Specter", 2, 1);