import to from "await-to-js";
import User from "./users.model";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const [err, users] = await to(User.query());
  // TODO: Create generic error handler
  if (err)
    return res.status(400).json({
      status: false,
      message: "Kullanıcı bilgileri alınırken bir hata oluştu.",
      stack: err.message,
    });
  res.json(users);
});

module.exports = router;
