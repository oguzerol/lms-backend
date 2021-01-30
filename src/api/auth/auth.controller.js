import to from "await-to-js";
import bcrypt from "bcrypt";
import jwtGenerator from "../../utils/jwtGenerator";
import User from "../users/users.model";

const errorMessages = {
  invalidLogin: "Invalid Credential.",
  dbError: "There is an error when trying to connect to the db",
  emailInUse: "Email in use.",
};

export async function login(req, res) {
  const { email, password } = req.body;
  const [err, user] = await to(User.query().where({ email }).first());

  if (err)
    return res.status(401).json({
      status: false,
      message: errorMessages.dbError,
      stack: err.message,
    });

  if (!user) {
    return res.status(401).json({
      status: false,
      message: errorMessages.invalidLogin,
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      status: false,
      message: errorMessages.invalidLogin,
    });
  }

  const jwtToken = jwtGenerator(user);
  return res.json(jwtToken);
}
