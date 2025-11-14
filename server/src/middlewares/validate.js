import { ApiError } from "../utils/ApiError.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      throw new ApiError(400, error.details[0].message);
    }
    next();
  };
};
