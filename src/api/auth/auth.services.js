import bcrypt from "bcrypt";
import User from "../../models/user";

export async function getResetLinkedUser(resetLink) {
  return User.query().where("reset_link", resetLink).first();
}

export async function updateUserPassword(password, resetLink) {
  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, salt);

  return await User.query()
    .where("reset_link", resetLink)
    .patch({
      password: bcryptPassword,
      reset_link: null,
    })
    .returning("*")
    .first();
}

export async function updateUserResetLink(email, token) {
  return await User.query()
    .where("email", email)
    .patch({
      reset_link: token,
    })
    .returning("*")
    .first();
}

export async function getUser(email) {
  return User.query().where("email", email).returning("*").first();
}
