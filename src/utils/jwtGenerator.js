import jwt from "jsonwebtoken";

export default function (user) {
  const payload = {
    user: {
      id: user.user_id,
      username: user.name,
      email: user.email,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "6h" });
}
