
export const DEFAULT_SCHEMA = `
-- Table: employees
CREATE TABLE employees (
  employee_id INT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  phone_number VARCHAR(20),
  hire_date DATE,
  job_id VARCHAR(10),
  salary DECIMAL(10, 2),
  manager_id INT,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(department_id),
  FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

-- Table: departments
CREATE TABLE departments (
  department_id INT PRIMARY KEY,
  department_name VARCHAR(50) NOT NULL,
  location_id INT
);

-- Table: jobs
CREATE TABLE jobs (
  job_id VARCHAR(10) PRIMARY KEY,
  job_title VARCHAR(50) NOT NULL,
  min_salary DECIMAL(10, 2),
  max_salary DECIMAL(10, 2)
);
`;