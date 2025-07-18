import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access", success: false });
    }

    // ✅ VERIFY the token instead of signing
    const decoded = jwt.verify(token, "mySecretKey123");

    // ✅ Attach user ID to request object
    req.id = decoded.id;
    console.log("🍪 Incoming cookies:", req.cookies);


    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

export default authenticate;
