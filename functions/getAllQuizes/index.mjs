import createError from "http-errors";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { client } from "../../utils/dbClient.mjs";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import middy from "@middy/core";

const getAllQuizzesHandler = async (event) => {
  try {
    // skapat GSI för o kunna hämta alla quiz
    const queryCommand = new QueryCommand({
      TableName: "QuizTable",
      IndexName: "EntityTypeIndex",
      KeyConditionExpression: "entityType = :type",
      ExpressionAttributeValues: { ":type": { S: "QUIZ" } },
    });

    const result = await client.send(queryCommand);
    console.log("RESULWIIIIIIIII:", result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Got all quizes successfully!",
        data: result.Items,
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

export const handler = middy(getAllQuizzesHandler).use(errorHandler());
