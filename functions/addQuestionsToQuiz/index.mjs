import httpJsonBodyParser from "@middy/http-json-body-parser";
import middy from "@middy/core";
import { transpileSchema } from "@middy/validator/transpile";
import validator from "@middy/validator";
import { v4 as uuidv4 } from "uuid";
import createError from "http-errors";
import { verifyToken } from "../../middlewares/authHandler.mjs";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../../utils/dbClient.mjs";
import { addQuestionToQuizSchema } from "../../schemas/addQuestionsToQuizSchema.mjs";

const addQuestionToQuizHandler = async (event) => {
  console.log("event i addqusion.!!!!!", event);
  try {
    const pkUserId = event.user.userId;
    const id = uuidv4();
    // const { quizName, question, answer, location, quizId } = event.body;
    const { question, answer, location, quizId } = event.body;
    // tog väck quizName här..behöv väl ej?
    const { longitude, latitude } = location;

    // konrolerra quizet tillhör denna anv:
    // checkar om pkUserID som skickas som jwt machar medd :  sk: { S: `QUIZ#${quizId}` },
    const getItemCommand = new GetItemCommand({
      TableName: "QuizTable",
      Key: {
        pk: { S: pkUserId },
        sk: { S: `QUIZ#${quizId}` },
      },
    });
    console.log("HEJJ!!!!", getItemCommand);

    const quizItem = await client.send(getItemCommand);

    if (!quizItem.Item) {
      throw new createError.Forbidden("Du får bara ändra dina egna quiz");
    }

    const putItemCommand = new PutItemCommand({
      TableName: "QuizTable",
      Item: {
        // ska ja göra såhär?? för
        pk: { S: `QUIZ#${quizId}` },
        sk: { S: `QUESTION#${id}` },
        // name: { S: quizName },
        entityType: { S: "QUESTION" },
        question: { S: question },
        answer: { S: answer },
        location: {
          M: {
            longitude: { S: longitude },
            latitude: { S: latitude },
          },
        },
      },
    });
    await client.send(putItemCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "added question in quiz succesfully!",
        success: true,
      }),
    };
  } catch (error) {
    if (createError.isHttpError(error)) {
      throw error;
    } else {
      throw new createError.InternalServerError("failed to add a question!");
    }
  }
};

export const handler = middy(addQuestionToQuizHandler)
  .use(verifyToken())
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(addQuestionToQuizSchema) }))
  .use(errorHandler());
