import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import createError from "http-errors";

dotenv.config();

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.MY_SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (event) => {
  const authHeader = event.headers?.authorization;
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    throw new createError.Unauthorized("Missing token");
  }
  try {
    return jwt.verify(token, process.env.MY_SECRET_KEY);
  } catch (error) {
    console.log("error:", error);
    throw createError.InternalServerError("Something went wrong");
  }
};
