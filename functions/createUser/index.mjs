import httpJsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import validator from "@middy/validator";
import { client } from "../../utils/dbClient.mjs";
import { transpileSchema } from "@middy/validator/transpile";
import { createUserSchema } from "../../schemas/createUserSchema.mjs";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { hashPassword } from "../../utils/bcrypt.mjs";
import createError from "http-errors";
import { errorHandler } from "../../middlewares/errorHandler.mjs";

const createUserHandler = async (event) => {
  try {
    const { password, userName } = event.body;
    const hashedPassword = await hashPassword(password);
    // Sätter pk till detta, använder inte uuid, för de blir ändå
    // unikt nu för checkar o kan inte använda samma PK ändå!
    const getItemCommand = new GetItemCommand({
      TableName: "QuizTable",
      Key: { pk: { S: `USER#${userName}` }, sk: { S: "PROFILE" } },
    });

    const resultGet = await client.send(getItemCommand);

    if (resultGet.Item) {
      throw new createError.Conflict("username already exists!");
    }
    const putItemCommand = new PutItemCommand({
      TableName: "QuizTable",
      Item: {
        pk: { S: `USER#${userName}` },
        sk: { S: "PROFILE" },
        entityType: { S: "USER" },
        userName: { S: userName },
        password: { S: hashedPassword },
      },
    });

    await client.send(putItemCommand);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Account created!",
      }),
    };
  } catch (error) {
    if (createError.isHttpError(error)) {
      throw error; // låter errorHandler returnera 409
    }
    throw new createError.InternalServerError(
      `Failed to create user: ${error.message}`
    );
  }
};

export const handler = middy(createUserHandler)
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(createUserSchema) }))
  .use(errorHandler());
