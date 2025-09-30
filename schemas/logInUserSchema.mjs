export const logInUserSchema = {
  type: "object",
  required: ["body"], // säkerställer att event.body finns
  properties: {
    body: {
      type: "object",
      required: ["password", "userName"], // säkerställer att body har dessa fält
      properties: {
        password: { type: "string", minLength: 4 },
        userName: { type: "string", minLength: 6 },
      },
    },
  },
};
