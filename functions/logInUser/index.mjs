import { logInUserSchema } from "../../schemas/logInUserSchema.mjs";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import createError from "http-errors";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { findUserName } from "../../utils/findUserName.mjs";
import { comparePassword } from "../../utils/bcrypt.mjs";
import { signToken } from "../../utils/jwthelpers.mjs";

const logInHandler = async (event) => {
  try {
    // schemat har hand om valideringen så behöver ingen check
    const { password, userName } = event.body;
    const foundUser = await findUserName(userName);
    console.log("OFOUNDUSER o log in:", foundUser);
    // är inge användarnamn som är hittat men vill inte ge för mycke info till front så skriver såhär!
    if (!foundUser.Item) {
      throw new createError.Unauthorized("wrong credentials!");
    }
    const hashedDbPassword = foundUser.Item.password.S;

    const match = await comparePassword(password, hashedDbPassword);
    console.log("MATCHHH!!!", match);
    // fel lösen till användare men vill inte ge för mycke info till front så skriver såhär!
    if (!match) {
      throw new createError.Unauthorized("wrong credentials!");
    }
    const token = signToken({
      userId: foundUser.Item.pk.S,
      userName: foundUser.Item.userName.S,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "logged in successfully",
        token: token,
      }),
    };
    // måste kolla detta mer
  } catch (error) {
    if (createError.isHttpError(error)) {
      throw error;
    } else {
      throw new createError.InternalServerError(
        `Failed to log in: ${error.message}`
      );
    }
  }
};

export const handler = middy(logInHandler)
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(logInUserSchema) }))
  .use(errorHandler());
