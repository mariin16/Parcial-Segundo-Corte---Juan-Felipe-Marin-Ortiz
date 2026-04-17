const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig2');

const pool = mysql.createPool(config);

module.exports = pool;