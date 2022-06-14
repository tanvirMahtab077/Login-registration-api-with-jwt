const passport = require('passport')
const httpStatus = require('http-status')

module.exports = (req, res, next) => {
    passport.authenticate('jwt', function (err, user, info) {
        if (err) {
            console.log(err)
            console.log(info)
            return next(err);
        }
        if(!user){
             return res.status(httpStatus.UNAUTHORIZED).json({
                message: "Authentication Failed"
            })
        }

        req.user = user
        return next()


    })(req, res, next);
}