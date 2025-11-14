import Joi from "joi";

export const subscribeSchema = Joi.object({
  planId: Joi.string().length(24).hex().required(),
});
