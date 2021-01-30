import jwt from "jsonwebtoken";

export default function (user) {
  const payload = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
      is_superuser: user.is_super_admin,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "6h" });
}
