import Sequelize from "sequelize";

//========== Conexión a la base de datos ==========
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || "ormprueba",
  process.env.MYSQL_USER || "ocarrillo",
  process.env.MYSQL_PASSWORD || "cruz4das",
  {
    dialect: "mysql",
    host: process.env.MYSQL_HOST || "mysql-service",
    port: process.env.MYSQL_PORT || 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: console.log
  }
);

export default sequelize;
