import middy from "@middy/core";
import { transpileSchema } from "@middy/validator/transpile";
import validator from "@middy/validator";
import { client } from "../../utils/dbClient.mjs";
import createError from "http-errors";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { getSpecificQuizSchema } from "../../schemas/getSpecifikQuizSchema.mjs";
import { GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const getSpecificQuizHandler = async (event) => {
  try {
    const { quizId } = event.pathParameters;
    const userId = event.queryStringParameters.userId;
    // const getItemcCommand = new GetItemCommand({
    //   TableName: "QuizTable",
    //   Key: {
    //     pk: { S: `USER#${userId}` }, // användarens PK
    //     sk: { S: `QUIZ#${quizId}` }, // quizets SK
    //   },
    // });

    const getItemcCommand = new GetItemCommand({
      TableName: "QuizTable",
      Key: {
        pk: { S: `USER#${userId}` },
        sk: { S: `QUIZ#${quizId}` },
      },
    });

    const getResult = await client.send(getItemcCommand);
    console.log("GEEEEEEEEEE", getResult);

    const queryCommand = new QueryCommand({
      TableName: "QuizTable",
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: `QUIZ#${quizId}` },
        ":skPrefix": { S: "QUESTION#" },
      },
    });

    // const result = await client.send(getItemcCommand);
    const result = await client.send(queryCommand);
    // console.log("RESULÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖÖ,", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "get specific quiz, successfully arrived!",
        quiz: result.Items,
        moreInfo: getResult.Item,
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
  .use(validator({ eventSchema: transpileSchema(getSpecificQuizSchema) }))
  .use(errorHandler());
