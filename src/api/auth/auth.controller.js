import jwtGenerator from "../../utils/jwtGenerator";

export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    // const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    //   email,
    // ]);

    // if (user.rows.length === 0) {
    //   return res.status(401).json("Invalid Credential");
    // }

    // const validPassword = await bcrypt.compare(password, user.rows[0].password);

    // if (!validPassword) {
    //   return res.status(401).json("Invalid Credential");
    // }
    // const jwtToken = jwtGenerator(user.rows[0]);
    return res.json("jwtToken");
  } catch (err) {
    res.status(500).send("Server error");
  }
}
