import createError from "http-errors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = () => {
  return {
    before: async (request) => {
      const authHeader = request.event.headers?.Authorization;
      if (!authHeader) {
        throw new createError.Unauthorized("Missing token");
      }
      const token = authHeader.replace("Bearer ", "");
      // kolla om ja måste ha de..för måstte väl kolla me
      // OM DE FINNS ME SÅ DE E FEL TOKEN!!!!!!!!!!!!!!!!!!!!!!!
      // if (!token) {
      //   throw new createError.Unauthorized("Missing token");
      // }
      try {
        // måste kolla upp!. kan använda detta senare i mina lambda funkitoner för nå de!
        request.event.user = jwt.verify(token, process.env.MY_SECRET_KEY);
      } catch (error) {
        // catch (error) {
        //   console.log("errorrr:", error);
        //   throw createError.InternalServerError("Something went wrong");
        // }
        if (createError.isHttpError(error)) {
          throw error;
        } else {
          //ändra som de andra!!!!!!!!!!!!!!!!!
          throw new createError.InternalServerError(
            `something went wrong!: ${error.message}`
          );
        }
      }
    },
  };
};
