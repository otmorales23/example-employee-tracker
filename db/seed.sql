USE employees_db;

INSERT INTO department(deptName) VALUES
("Management"),
("Design"),
("Legal");

INSERT INTO role(title, salary, department_id) VALUES
("Manager", 120000, 1),
("Web Designer", 80000, 2),
("Attorney", 100000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
("Andy", "Bernstein", 2, 1),
("Harvey", "Specter", 3, 2);

INSERT INTO manager(first_name, last_name, role_id) VALUES
("Arthur", "Bradley", 1),
("Judy", "Hopps", 1);