import jwt from "jsonwebtoken";

export function me(req, res) {
  // TODO: Get user info from db
  const token = req.header("token");

  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  try {
    const verify = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;
    res.json(req.user);
  } catch (err) {
    res.status(401).json({ status: false, message: "Token is not valid" });
  }
}
