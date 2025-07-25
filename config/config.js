require('dotenv').config()

module.exports = {
    development: {
        username : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        host : process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect : 'postgres',
        logging: console.log
    },
    production: {
    use_env_variable: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}