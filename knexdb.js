var connectionErrorHandler = function (connection, err) {
    if (connection && err && err.fatal) {
        if (connection.removedFromThePool)
            return;
        connection.removedFromThePool = true;
        knex.client.pool.genericPool.destroy(connection);
    }
};
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'proxyengine',
        charset: 'utf8mb4'

    },
    pool: {
        min: 1, max: 7,
        afterCreate: function (connection, callback) {
            connection.on('error', connectionErrorHandler.bind(null, connection));
            connection.on('end', connectionErrorHandler.bind(null, connection));
            callback();
        }

    }
});

module.exports = {
    fetchProxy: function () {
        return new Promise((resolve, reject) => {
            //check if proxy exists first
            console.log("fetching proxies")
            knex('proxies').limit(4).then((response) => {

                resolve (response)
            }).catch((error)=>{
                reject(error)
            })

        })


    }
}