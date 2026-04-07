const mongoose = require("mongoose");

const dbConnection = () =>{
    mongoose
      .connect(process.env.DB_URI)
      .then((connect) => {
        console.log(`Database Connected ${connect.connection.host}`);
      })
      .catch((error) => {
        console.log(`Database Error: ${error}`);
        process.exit(1);
      });
    
}


module.exports = dbConnection;