export const addQuestionToQuizSchema = {
  type: "object",
  required: ["body"],
  properties: {
    body: {
      type: "object",
      //   required: ["quizName", "question", "answer", "location", "quizId"],
      required: ["question", "answer", "location", "quizId"],
      properties: {
        name: { type: "string", minLength: 1 },
        question: { type: "string", minLength: 1 },
        answer: { type: "string", minLength: 1 },
        // quizName: { type: "string", minLength: 1 },
        quizId: { type: "string", minLength: 1 },
        location: {
          type: "object",
          required: ["longitude", "latitude"],
          properties: {
            longitude: { type: "string", minLength: 1 },
            latitude: { type: "string", minLength: 1 },
          },
        },
      },
    },
  },
};
