const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET =
  'O9njWRmG>T&U$5qkURXy[cv%Ii]LOq#G[N./k@|Ww:VMMK:UW9"!0x+EVq^~SQ%';

// ROUTE 1: Create user using method POST at "/api/auth". Login not required
router.post(
  "/signup",
  [
    // Express validator validations.
    body("email", "Enter valid email.").isEmail(),
    body("password", "Your password must be minimum 8 characters.").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // Express validator throws error if values are not matching.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Encrypting password using bcryptjs.
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    try {
      // Cheack weather email is already exist.
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email already exist." });
      }
      // Express validator creates user if all values are same.
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
      });

      // Taking user id for authentication token.
      const data = {
        user: user.id,
      };

      // Generating authentication token using "jsonwebtoken".
      const authtoken = jwt.sign(data, JWT_SECRET);

      // Sending authentication token to user.
      res.json({ authtoken });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 2: Authenticate user and login into website using method POST at "/api/auth/login". Login not required
router.post(
  "/login",
  [
    // Express validator validations.
    body("email", "Enter valid email.").isEmail(),
    body("password", "Password cannot be blank.").exists(),
  ],
  async (req, res) => {
    // Express validator throws error if values are not matching.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring getting email and password from req.body .
    const { email, password } = req.body;
    try {
      // Fetching user from databse.
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login correct credentials." });
      }

      // Comparing password using bcryptjs.
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login correct credentials." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      // Compare authentication token using "jsonwebtoken".
      const authtoken = jwt.sign(data, JWT_SECRET);

      // Sending authentication token to user.
      res.json({ authtoken });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Get loggedin user details using POST at "/api/auth/getuser". Login required.
router.post("/getuser", fetchuser, async (req, res) => {
    try {
      user_id = req.user.id;
      let user = await User.findById(user_id).select("-password");
      res.send(user);
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);
module.exports = router;
