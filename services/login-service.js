const db = require('../database/db');
const UserQueries = require('../queries/user-query');

exports.getUserInfo = async function(id) {
    try {
        let rows = await db.runQuery(UserQueries.selectById(id));

        return rows[0];
    } catch (err) {
        throw err;
    }
}