import jwt from "jsonwebtoken";

export const genToken = async (id, email, name) => {
  return await jwt.sign({ id, email, name }, process.env.jwt_SECRET, {
    expiresIn: "7d",
  });
};
