// export const addPointsSchema = {
//   type: "object",
//   required: ["body", "pathParameters"],
//   properties: {
//     body: {
//       type: "object",
//       required: ["answer"],
//       properties: {
//         answer: { type: "string" },
//       },
//     },
//     pathParameters: {
//       type: "object",
//       required: ["quizId"],
//       properties: {
//         quizId: { type: "string" },
//       },
//     },
//   },
// };

// export const addPointsSchema = {
//   type: "object",
//   required: ["body", "pathParameters"],
//   properties: {
//     body: {
//       type: "object",
//       required: ["answers"],
//       properties: {
//         answers: {
//           type: "array",
//           minItems: 1,
//           items: {
//             type: "object",
//             required: ["questionId", "answer"],
//             properties: {
//               questionId: { type: "string" },
//               answer: { type: "string" },
//             },
//             additionalProperties: false,
//           },
//         },
//       },
//       additionalProperties: false,
//     },
//     pathParameters: {
//       type: "object",
//       required: ["quizId"],
//       properties: {
//         quizId: { type: "string" },
//       },
//       additionalProperties: false,
//     },
//   },
//   additionalProperties: false,
// };

export const addPointsSchema = {
  type: "object",
  required: ["pathParameters", "body"],
  properties: {
    pathParameters: {
      type: "object",
      required: ["quizId"],
      properties: {
        quizId: { type: "string", minLength: 1 },
      },
      additionalProperties: false,
    },
    body: {
      type: "object",
      required: ["answers"],
      properties: {
        answers: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            required: ["questionId", "answer"],
            properties: {
              questionId: { type: "string", minLength: 1 },
              answer: { type: "string", minLength: 1 },
            },
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};
