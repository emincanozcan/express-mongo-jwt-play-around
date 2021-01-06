const express = require('express')
const router = express.Router();
const User = require("../models/User")
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const { authTokenSecret } = require("../config");

router.post('/login', async (req, res) => {
  let { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ 'message': 'Email is not found' })

  bcrypt.compare(password, user.password, (err, match) => {
    if (err) res.json(500).json(err)
    else if (match) res.json({ token: generateToken(user) })
    else res.status(404).json({ 'message': 'Passwords dont match' })
  });
})
router.post('/register', async (req, res) => {
  let { email, password } = req.body
  if (await User.findOne({ email })) return res.json({ message: "Email is in use" })

  try {
    password = await bcrypt.hash(password, 10);
    user = await User({ email, password }).save()
    res.json({ token: generateToken(user) })
  } catch (e) {
    return res.json(e)
  }
})

function generateToken(user) {
  return jwt.sign({ data: user }, authTokenSecret, { expiresIn: "24h" })
}

module.exports = router;