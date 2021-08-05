import to from "await-to-js";
import bcrypt from "bcrypt";
import jwtGenerator from "../../utils/jwtGenerator";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  getResetLinkedUser,
  getUser,
  updateUserPassword,
  updateUserResetLink,
} from "./auth.services";

const errorMessages = {
  invalidLogin: "Kullanıcı adı veya şifre yanlış.",
  dbError: "Bağlantı hatası daha sonra tekrar deneyiniz.",
  emailInUse: "E-mail şuanda kullanılıyor.",
  name: "Kullanıcı ismi mevcut.",
};

let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export async function login(req, res) {
  const { email, password } = req.body;
  const [err, user] = await to(User.query().where({ email }).first());

  if (err)
    return res.status(422).json({
      status: false,
      message: errorMessages.dbError,
      stack: err.message,
    });

  if (!user) {
    return res.status(422).json({
      status: false,
      message: errorMessages.invalidLogin,
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(422).json({
      status: false,
      message: errorMessages.invalidLogin,
    });
  }

  const jwtToken = jwtGenerator(user);

  return res.json({
    token: jwtToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      is_superuser: user.is_super_admin,
    },
  });
}

export async function register(req, res) {
  const { email, password, username } = req.body;
  const [err, existingEmail] = await to(User.query().where({ email }).first());

  if (err) {
    return res.status(503).json({
      status: false,
      message: errorMessages.dbError,
      stack: err.message,
    });
  }

  if (existingEmail) {
    return res.status(422).json({
      status: false,
      message: errorMessages.emailInUse,
    });
  }

  const [existingErr, existingUsername] = await to(
    User.query().where({ username }).first()
  );

  if (existingErr) {
    return res.status(503).json({
      status: false,
      message: errorMessages.dbError,
      stack: err.message,
    });
  }

  if (existingUsername) {
    return res.status(422).json({
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
    return res.status(422).json({
      status: false,
      message: "Validasyon hatası",
    });
  }

  return res.status(200).json({ status: true });
}

export function me(req, res) {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({ msg: "authorization denied" });
  }

  try {
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;
    res.json(req.user);
  } catch (err) {
    res.status(401).json({ status: false, message: "Token is not valid" });
  }
}

export async function resetPassword(req, res) {
  const { resetLink, newPassword } = req.body;

  jwt.verify(
    resetLink,
    process.env.jwtResetSecret,
    async (err, decodedData) => {
      if (err) {
        return res.status(422).json({
          status: false,
          message:
            "Şifre yenilemek için süreniz doldu veya hatalı yenileme linki.",
        });
      }

      // Get user from reset link
      const [resetLinkedErr, resetLinkedUser] = await to(
        getResetLinkedUser(resetLink)
      );

      if (resetLinkedErr) {
        return res.status(503).json({
          status: false,
          message:
            "Beklenmeyen bir hata oluştu lütfen daha sonra tekrar deneyiniz.",
        });
      }

      if (!resetLinkedUser) {
        return res.status(422).json({
          status: false,
          message: "Token geçerli değil",
        });
      }

      const [updatedUserErr, updatedUser] = await to(
        updateUserPassword(newPassword, resetLink)
      );
      // Save user password and reset reset_link

      if (updatedUserErr) {
        return res.status(503).json({
          status: false,
          message:
            "Şifreyi kayıt ederken bir hata oldu. Lütfen tekrar deneyiniz.",
        });
      }
      res.json({
        status: true,
        message: "Şifre başarılı bir şekilde değiştirildi.",
      });
    }
  );
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const [userErr, user] = await to(getUser(email));

  if (userErr || !user) {
    return res.status(400).json({
      status: false,
      message:
        "Beklenmeyen bir hata oluştu lütfen daha sonra tekrar deneyiniz.",
    });
  }

  const token = jwt.sign({ id: user.id }, process.env.jwtResetSecret, {
    expiresIn: "20m",
  });

  const [updatedUserErr, updatedUser] = await to(
    updateUserResetLink(email, token)
  );

  if (updatedUserErr) {
    return res.status(400).json({
      status: false,
      message:
        "Beklenmeyen bir hata oluştu lütfen daha sonra tekrar deneyiniz.",
    });
  }

  let mailOptions = {
    from: "onlineydt@gmail.com",
    to: email,
    subject: "Şifre Yenileme",
    html: `
     <h2>Şifrenizini yenilemek için aşağdaki linke tıklayınız.</h2>
     <a href="http://localhost:3000/reset-password/${token}"> Şifremi Yenile </a>
    `,
  };

  transporter
    .sendMail(mailOptions)
    .then((data) => {
      return res.json({
        status: true,
        message: "Mesaj gönderildi. Lütfen spam kutunuzu kontrol ediniz.",
      });
    })
    .catch((err) => {
      return res.status(409).json({
        status: false,
        message: "Mesaj gönderilirken bir hata oldu",
      });
    });
}
