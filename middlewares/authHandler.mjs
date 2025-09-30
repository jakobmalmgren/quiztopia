import createError from "http-errors";

export const verifyToken = (event) => {
  const authHeader = event.headers?.authorization;
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    throw new createError.Unauthorized("Missing token");
  }
  try {
    return jwt.verify(token, process.env.MY_SECRET_KEY);
  } catch (error) {
    // catch (error) {
    //   console.log("errorrr:", error);
    //   throw createError.InternalServerError("Something went wrong");
    // }
    if (createError.isHttpError(error)) {
      throw error;
    } else {
      throw new createError.InternalServerError(
        `something went wrong!: ${error.message}`
      );
    }
  }
};
