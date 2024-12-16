const mysql = require('mysql');

class Mysql {
    constructor(poolConfig) {
        this.pool = mysql.createPool(poolConfig);
    }

    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, params, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err) {
                    return reject(err);
                }
                console.log('Connection pool closed.');
                resolve();
            });
        });
    }
}

module.exports = Mysql;
