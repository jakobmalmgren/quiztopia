export const createQuizSchema = {
  type: "object",
  required: ["body"], // säkerställer att event.body finns
  properties: {
    body: {
      type: "object",
      required: ["quizName"], // säkerställer att body har dessa fält
      properties: {
        quizName: { type: "string" },
      },
    },
  },
};
