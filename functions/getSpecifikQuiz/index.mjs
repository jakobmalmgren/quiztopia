import middy from "@middy/core";
import { transpileSchema } from "@middy/validator/transpile";
import validator from "@middy/validator";
import { client } from "../../utils/dbClient.mjs";
import createError from "http-errors";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { getSpecificQuizSchema } from "../../schemas/getSpecifikQuizSchema.mjs";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

const getSpecificQuizHandler = async (event) => {
  try {
    const { quizId } = event.pathParameters;
    const userId = event.queryStringParameters.userId;
    const getItemcCommand = new GetItemCommand({
      TableName: "QuizTable",
      Key: {
        pk: { S: `USER#${userId}` }, // användarens PK
        sk: { S: `QUIZ#${quizId}` }, // quizets SK
      },
    });

    const result = await client.send(getItemcCommand);
    console.log("RESULÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖ,", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "get specific quiz, successfully arrived!",
      }),
    };
  } catch (error) {
    if (createError.isHttpError(error)) {
      throw error;
    } else {
      throw new createError.InternalServerError(
        `something went wrong!: ${error.message}`
      );
    }
  }
};

export const handler = middy(getSpecificQuizHandler)
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(getSpecificQuizSchema) }))
  .use(errorHandler());
