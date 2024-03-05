import jwt from "jsonwebtoken";

export const generateJWT = (email) => {
  return jwt.sign({ email }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyJWT = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};
