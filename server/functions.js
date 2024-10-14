const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const newDate = () => Date().split(" (")[0];

const createConnectionObj = (userObj) => {
  const { _id, name, role, email } = userObj;
  return {
    id: _id,
    name: name,
    role: role,
    email: email,
  };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = bcrypt.hash(password, salt);
  return hashedPassword;
};
const verifyPassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
const authMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        if (refreshToken) {
          const data = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
          if (data.myId) {
            const newToken = generateAccessToken(data.myId);

            res.cookie("accessToken", newToken, {
              httpOnly: true,
              secure: true,
              maxAge: 1000 * 60 * 15,
              sameSite: "None",
            });

            req.user = data;
            next();
          } else {
            res.status(403);
            return res.send({ message: "Invalid refresh-token" });
          }
        } else {
          res.status(403);
          return res.send({ message: "No refresh-token provided" });
        }
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    if (refreshToken) {
      const data = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      if (data.myId) {
        const newToken = generateAccessToken(data.myId);

        res.cookie("accessToken", newToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 15,
          sameSite: "None",
        });

        req.user = data;
        next();
      } else {
        res.status(403);
        return res.send({ message: "Invalid refresh-token" });
      }
    } else {
      res.status(403);
      return res.send({ message: "No refresh-token provided" });
    }
  }
};

const generateAccessToken = (id) => {
  const token = jwt.sign({ myId: id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};
const generateRefreshToken = (id) => {
  const token = jwt.sign({ myId: id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const getCookies = (cookie) => {
  const cookieArray = cookie.split("; ").map((cookie) => cookie.split("="));
  let cookies = {};
  cookieArray.map((cookie) => (cookies[`${cookie[0]}`] = cookie[1]));
  return cookies;
};

module.exports = {
  createConnectionObj,
  newDate,
  hashPassword,
  verifyPassword,
  authMiddleware,
  generateAccessToken,
  generateRefreshToken,
  getCookies
};
