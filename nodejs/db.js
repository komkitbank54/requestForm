const sql = require('mssql');

const config = {
    user: 'stbank',
    password: 'Bankit2023',
    server: '192.168.10.29',
    database: 'db_traning',
    options: {
        encrypt: false
    }
};

const poolPromise = sql.connect(config)
    .then(pool => {
        console.log('Connected to the database.');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err);
    });

module.exports = {
    sql,
    poolPromise
};
