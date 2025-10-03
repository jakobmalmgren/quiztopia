export const addPointsSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: {
      type: "object",
      required: ["quizId", "answers"],
      properties: {
        quizId: { type: "string" },
        answers: {
          type: "array",
          items: {
            type: "object",
            required: ["questionId", "answer"],
            properties: {
              questionId: { type: "string" },
              answer: { type: "string" },
            },
          },
        },
      },
    },
  },
};
