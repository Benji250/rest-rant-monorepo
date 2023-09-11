const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('jwt')

const { User } = db

  
  
router.post('/', async (req, res) => {
    
    let user = await User.findOne({
        where: { email: req.body.email }
    })

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({ 
            message: `Could not find a user with the provided username and password` 
        })
    } else {
        const result = await jwt.encode(process.env.JWT_SECRET, { id: user.userid })
        // req.session.userid = user.userid
        res.json({ user: user, token: result.value })
    }
})

___
___
___
router.get('/profile', async (req, res) => {
    try {
      
        const [authenticationMethod, token] = req.headers.authorization.split(' ')
        
        if (authenticationMethod == 'Bearer') {

            // Decode the JWT
            const result = await jwt.decode(process.env.JWT_SECRET, token)

            // Get the logged in user's id from the payload
            const { id } = result.value

            // Find the user object using their id:
            let user = await User.findOne({
                where: {
                    userId: id
                }
            })
            res.json(user)
        }
    } catch {
        res.json(null)
    }
})





module.exports = router
