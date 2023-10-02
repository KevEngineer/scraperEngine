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
            knex('proxies').limit(100).orderBy('proxyId', 'desc').then((response) => {

                resolve(response)
            }).catch((error) => {
                reject(error)
            })

        })


    },
    insertNewsItem: function (newsTitle, newsDescription, newsLink, newsAuthor,newsTime) {
        return new Promise((resolve, reject) => {
            knex.select().from('news').where({ newsLink }).then((results) => {
                if (results.length == 0) {
                    knex.insert({ newsTitle,newsDescription, newsLink,newsAuthor,newsTime}).into('news').then((response) => {
                        console.log("inserted item")
                        resolve()
                    }).catch((error) => {
                        reject(error)
                    })
                }
                else{
                    console.log("item exists!")
                    resolve()}

            }).catch((error) => {
                resolve(error)
            })

        })

    }
}