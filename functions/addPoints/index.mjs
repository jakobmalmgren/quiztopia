import middy from "@middy/core";
import { transpileSchema } from "@middy/validator/transpile";
import validator from "@middy/validator";
import { client } from "../../utils/dbClient.mjs";
import createError from "http-errors";
import { errorHandler } from "../../middlewares/errorHandler.mjs";
import { addPointsSchema } from "../../schemas/addPointsSchema.mjs";
import { PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { verifyToken } from "../../middlewares/authHandler.mjs";

const addPointHandler = async (event) => {
  try {
    // const { answers, questionId } = event.body;
    const { answers, quizId } = event.body;

    const userId = event.user.userId;

    const queryQuestionsCommand = new QueryCommand({
      TableName: "QuizTable",
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: `QUIZ#${quizId}` },
        ":skPrefix": { S: "QUESTION#" },
      },
    });

    const queryQuestionResult = await client.send(queryQuestionsCommand);
    const questions = queryQuestionResult.Items;

    console.log("RESULLL I ADDPOUIUNS", questions);

    if (!questions || questions.length === 0) {
      throw new createError.NotFound("Quiz not found or no questions");
    }
    let score = 0;

    // for (const q of questions) {
    //   const userAnswers = answers.find((a) => {
    //     return a.questionId === q.sk.S.replace("QUESTION#", "");
    //   });
    //   if (userAnswers === q.answer.S) {
    //     score++;
    //   }
    // }
    // kolla!
    for (const q of questions) {
      const userAnswer = answers.find(
        (a) => a.questionId === q.sk.S.replace("QUESTION#", "")
      );

      if (userAnswer && userAnswer.answer === q.answer.S) {
        score++;
      }
    }
    const putScoreCommand = new PutItemCommand({
      TableName: "QuizTable",
      Item: {
        pk: { S: `QUIZ#${quizId}` },
        sk: { S: `SCORE#${userId}` },
        entityType: { S: "SCORE" },
        userName: { S: userId },
        quizId: { S: quizId },
        score: { N: score.toString() },
      },
    });
    await client.send(putScoreCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "score added!",
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

export const handler = middy(addPointHandler)
  .use(verifyToken())
  .use(httpJsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(addPointsSchema) }))
  .use(errorHandler());
