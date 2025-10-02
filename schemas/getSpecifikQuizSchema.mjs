export const getSpecificQuizSchema = {
  type: "object",
  required: ["pathParameters", "queryStringParameters"],
  properties: {
    pathParameters: {
      type: "object",
      required: ["quizId"],
      properties: {
        quizId: { type: "string", minLength: 1 },
      },
    },
    queryStringParameters: {
      type: "object",
      required: ["userId"],
      properties: {
        userId: { type: "string", minLength: 1 },
      },
    },
  },
};

// export const getSpecificQuizSchema = {
//   type: "object",
//   required: ["pathParameters"],
//   properties: {
//     pathParameters: {
//       type: "object",
//       required: ["quizId"],
//       properties: {
//         quizId: { type: "string", minLength: 1 },
//       },
//     },
//   },
// };
