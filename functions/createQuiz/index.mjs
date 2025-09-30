import httpJsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import { transpileSchema } from "@middy/validator/transpile";
import validator from "@middy/validator";
import { client } from "../../utils/dbClient.mjs";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import createError from "http-errors";
import { createQuizSchema } from "../../schemas/createQuizSchema.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { verifyToken } from "../../middlewares/authHandler.mjs";
import { v4 as uuidv4 } from "uuid";

const createQuizHandler = async (event) => {
  try {
    //checkar me mitt validatorschema så de finns och hur de ska skrivas
    const { quizName } = event.body;
    console.log("EVENTTT!!!!:", event.user);
    const id = uuidv4();

    const putItemCommand = new PutItemCommand({
      TableName: "QuizTable",
      Item: {
        pk: { S: event.user.userId },
        sk: { S: `QUIZ#${id}` },
        entityType: { S: "QUIZ" },
        quizName: { S: quizName },
        creator: { S: event.user.userName },
      },
    });

    await client.send(putItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "quiz added successfully!",
      }),
    };
  } catch (error) {
    if (createError.isHttpError(error)) {
      throw error;
    } else {
      throw new createError.InternalServerError("failed to add a quiz!");
    }
  }
};

export const handler = middy(createQuizHandler)
  .use(verifyToken())
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(createQuizSchema) }))
  .use(errorHandler());
