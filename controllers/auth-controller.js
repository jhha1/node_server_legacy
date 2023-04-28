const ResponseUtil = require('../utils/response-util');
const LoginService = require('../services/login-service');

exports.login = async (req, res, cb) => {
    let { id } = req.body;
    try {
        let userInfo = await LoginService.getUserInfo(id);

        return res.json(ResponseUtil.toJson(userInfo));
    } catch (err) {
        return res.status(500).json(err);
    }
}
