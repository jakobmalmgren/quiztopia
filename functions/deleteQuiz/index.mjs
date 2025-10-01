import middy from "@middy/core";
import { transpileSchema } from "@middy/validator/transpile";
import validator from "@middy/validator";
import { client } from "../../utils/dbClient.mjs";
import createError from "http-errors";
import { verifyToken } from "../../middlewares/authHandler.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { deleteQuizSchema } from "../../schemas/deleteQuizSchema.mjs";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const deleteQuizHandler = async (event) => {
  try {
    const { quizId } = event.pathParameters;
    const pkUserId = event.user.userId;

    const deleteItemCommand = new DeleteItemCommand({
      TableName: "QuizTable",
      Key: {
        pk: { S: pkUserId },
        sk: { S: `QUIZ#${quizId}` },
      },
      ReturnValues: "ALL_OLD",
    });

    console.log("deleeeeee", deleteItemCommand);

    const result = await client.send(deleteItemCommand);

    const deletedItem = result.Attributes;

    if (!result.Attributes) {
      throw new createError.NotFound(`quiz med ID ${quizId} not found!`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "deleted succesfully!",
        deletedData: deletedItem,
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

export const handler = middy(deleteQuizHandler)
  .use(verifyToken())
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(deleteQuizSchema) }))
  .use(errorHandler());
