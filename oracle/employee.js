const Workspace = require("./baseConnection").Workspace;
class EmployeeWorkspace extends Workspace {
  constructor() {
    super();
  }

  findAll = async function () {
    const query = "SELECT * FROM EMPLOYEES";
    const params = [];
    const result = await this.query(query, params);
    return result;
  };

  findOne = async function (id) {
    // Binding occurs serially as present in the array
    const query =
      "SELECT employee_id, last_name,first_name FROM employees WHERE employee_id > :employee_id AND employee_id < :2 order by employee_id";
    const params = [id, 200];
    const result = await this.query(query, params);
    return result;
  };
}

exports.EmployeeWorkspace = EmployeeWorkspace;
