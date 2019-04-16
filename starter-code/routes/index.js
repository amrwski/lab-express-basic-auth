const express = require("express")
const router = express.Router()

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index")
})

module.exports = router

router.post("/register", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const salt = bcrypt.genSaltSync()
  const hashPassword = bcrypt.hashSync(password, salt)

  if (username === "" || password === "") {
    res.render("auth/register", {
      errorMessage: "You need a username and a password to register"
    })
    return
  }
  const passwordStrength = zxcvbn(password)
  if (password.length < 6) {
    res.render("auth/register", {
      errorMessage: "Your password needs 6 or more characters"
    })
    return
  }
  if (passwordStrength.score === 0) {
    res.render("auth/register", {
      errorMessage: passwordStrength.feedback.warning
    })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/register", {
          errorMessage: "There is already a registered user with this username"
        })
        return
      }
      User.create({ username, password: hashPassword })
        .then(() => {
          res.redirect("/secret")
        })
        .catch(err => {
          console.error("Error while registering new user", err)
          next()
        })
    })
    .catch(err => {
      console.error("Error while looking for user", err)
    })
})
