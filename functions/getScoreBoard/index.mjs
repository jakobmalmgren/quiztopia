import middy from "@middy/core";
import { client } from "../../utils/dbClient.mjs";
import createError from "http-errors";
import { verifyToken } from "../../middlewares/authHandler.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { getScoreBoardSchema } from "../../schemas/getScoreBoardSchema.mjs";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";

const getScoreBoardHandler = async (event) => {
  const quizId = event.pathParameters.quizId;
  try {
    const queryCommand = new QueryCommand({
      TableName: "QuizTable",
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: `QUIZ#${quizId}` },
        ":skPrefix": { S: "SCORE#" },
      },
    });

    const result = await client.send(queryCommand);
    console.log("RESULLLLLL HEJ", result);

    const data = result.Items.map((item) => {
      return {
        userName: item.userName.S.replace("USER#", ""),
        score: item.score.N,
      };
    });

    data.sort((a, b) => {
      return b.score - a.score;
    });

    const topFiveRank = data.slice(0, 5);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "got the scoreBoard succesfully!",
        data: topFiveRank,
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

export const handler = middy(getScoreBoardHandler)
  .use(verifyToken())
  .use(validator({ eventSchema: transpileSchema(getScoreBoardSchema) }))
  .use(errorHandler());
