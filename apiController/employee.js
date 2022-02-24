
const EmployeeWorkspace = require("../oracle/employee").EmployeeWorkspace;
const employeeWorkspace = new EmployeeWorkspace();

class EmployeeController {
    constructor() {
    }

    list = async (req, res, next) => {
        console.log('hi');
        let employees = await employeeWorkspace.findAll();
        if (!employees.success)
            return res.status(500).json({code: "E0001", description: "Internal Error"});
        else
            return res.status(200).json(employees.data);
    };
    fetch = async (req, res, next) => {
        let id = req.params.id;
        let employee = await employeeWorkspace.findOne(id);
        if (!employee.success)
            return res.status(404).json({code: "E0002", description: "Internal Server Error"});
        else if (employee.data.length === 0)
            return res.status(500).json({code: "E0002", description: "Employee with id:" + id + " not found."});
        else
            { 
                const rows=employee.data;
                // const func=(row)=>{
                //      return {
                //          id:row.employee_id,
                //          firstName:row.first_name,
                //          lastName:row.last_name,
                //      }
                // }
               for(let i=0;i<rows.length;i++)
               {
                   console.log('employee_name = ',rows[i].FIRST_NAME);
               }
                // res.status(200).json(
                //     rows.map((row)=>func(row))
                //     );
                return res.status(200).json(employee.data);
            }
    };
};


exports.EmployeeController = EmployeeController;