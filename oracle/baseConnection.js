const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OBJECT;
class Workspace {
  constructor() {
    this.connection = undefined;
  }

  query = async function (query, params, options) {
    if (this.connection === undefined) {
      this.connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectionString: process.env.DB_CONNECT_STRING,
      });
    }
    try {
      let result = await this.connection.execute(query, params, options);
      return {
        success: true,
        data: result.rows,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  };
  Query = async function (query, params) {
    if (this.connection === undefined) {
      this.connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        connectionString: process.env.DB_CONNECT_STRING,
      });
    }
    await this.connection.execute(query, params, function (err, result) {
      if (err) {
        console.log("error occurs");
        return {
          success: false,
          err,
        };
      } else {
        console.log("Rows inserted: " + result.rowsAffected); // 1
        this.connection.commit((error) => {
          return {
            success: false,
            err,
          };
        });
        return {
          success: true,
          data: result.rowsAffected,
        };
      }
    });
  };
}

exports.Workspace = Workspace;
