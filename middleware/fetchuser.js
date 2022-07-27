const jwt = require("jsonwebtoken");

const JWT_SECRET =
  'O9njWRmG>T&U$5qkURXy[cv%Ii]LOq#G[N./k@|Ww:VMMK:UW9"!0x+EVq^~SQ%';

const fetchuser = (req, res, next) => {
  // Get user from jwt token and add id to req object.
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    // Verifing token and getting data of user.
    const user_data = jwt.verify(token, JWT_SECRET);

    // Appending user data to req.
    req.user = user_data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
