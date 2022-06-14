const router = require('express').Router();
const userModel = require('../model/User');
const {registerValidation,loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/validUser')

// Register
router.post('/register',auth,async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const emailExist = await userModel.findOne({
        email: req.body.email
    })
    if (emailExist) return res.status(400).send("Email already exists")
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {

        await user.save()
        return res.send("User created succesfully")
    } catch (error) {
        return res.status(400).send(error);
    }
})


// Login
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const user = await userModel.findOne({
        email: req.body.email
    })
    if (!user) return res.send("email does't exists")

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Password does not match')
    const token = jwt.sign({id:user._id,email:user.email},process.env.SECRET)
    res.status(httpStatus.OK).json({
        message:"login successfull",
        token: `bearer ${token}`
    })
    
})



module.exports = router;