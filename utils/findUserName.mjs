import { client } from "./dbClient.mjs";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

export const findUserName = async (userName) => {
  try {
    const getItemCommand = new GetItemCommand({
      TableName: "QuizTable",
      Key: { pk: { S: `USER#${userName}` }, sk: { S: "PROFILE" } },
    });
    const result = await client.send(getItemCommand);
    console.log("RESULT from findusername funk!!!", result);

    return result;
  } catch (error) {
    console.log("ERROOOOOR i findusername funk!", error);
  }
};
