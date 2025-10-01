export const getSpecificQuizSchema = {
  type: "object",
  required: ["pathParameters"], // säkerställer att event.body finns
  properties: {
    pathParameters: {
      type: "object",
      required: ["quizId", "userId"], // säkerställer att body har dessa fält
      properties: {
        quizId: { type: "string", minLength: 1 },
        userId: { type: "string", minLength: 1 },
      },
    },
  },
};
// måse fixa de för  ja ska ha queryparams!!!!!!
// sen se som de sammer i yaml filen..
//sen också i getSpecificQuizHandler lös de så d går in bra via query..
// för all bli massa fel annars
