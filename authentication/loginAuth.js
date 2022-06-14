const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const res = require('express/lib/response');
const User = require('../model/User')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
module.exports = (passport)=>{passport.use(new JwtStrategy(opts, function(payload, done) {
    console.log(payload);
    User.findOne({_id: payload.id})
    .then((user)=>{
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    })
    .catch(err=>{
        return done(err)
    })
    
}))
}