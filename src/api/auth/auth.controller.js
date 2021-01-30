import to from "await-to-js";
import bcrypt from "bcrypt";
import jwtGenerator from "../../utils/jwtGenerator";
import User from "../users/users.model";

const errorMessages = {
  invalidLogin: "Kullanıcı adı veya şifre yanlış.",
  dbError: "Bağlantı hatası daha sonra tekrar deneyiniz.",
  emailInUse: "E-mail şuanda kullanılıyor.",
  name: "Kullanıcı ismi mevcut.",
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

export async function register(req, res) {
  const { email, password, username } = req.body;
  const [err, existingEmail] = await to(User.query().where({ email }).first());

  if (err) {
    return res.status(400).json({
      status: false,
      message: errorMessages.dbError,
      stack: err.message,
    });
  }

  if (existingEmail) {
    return res.status(401).json({
      status: false,
      message: errorMessages.emailInUse,
    });
  }

  const [existingErr, existingUsername] = await to(
    User.query().where({ username }).first()
  );

  if (existingErr) {
    return res.status(400).json({
      status: false,
      message: errorMessages.dbError,
      stack: err.message,
    });
  }

  if (existingUsername) {
    return res.status(401).json({
      status: false,
      message: errorMessages.emailInUse,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const user = {
    email,
    username,
    password: await bcrypt.hash(password, salt),
  };

  const newUser = await User.query().insert(user);
  if (!(newUser instanceof User)) {
    return res.status(400).json({
      status: false,
      message: "Validasyon hatası",
    });
  }

  const jwtToken = jwtGenerator(user);
  return res.json(jwtToken);
}
