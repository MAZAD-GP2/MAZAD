// authRoutes.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.decodeToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            console.log("No token found");
            return res.status(401).json({ message: "Unauthorized" });
        }
        // return the decoded token
        let decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return res.send(decodedToken);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};
