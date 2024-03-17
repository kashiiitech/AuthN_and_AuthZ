// auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {

        // extract jwt token
        // methods to extract token, header, body & cookie, zaruri nahin sab men ho jis men insert kya hoga usme hoga
        const token = req.body.token;

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing",
            })
        }

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        } catch(err) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            })
        }

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying the user",
        })
    }

}


exports.isStudent = (req, res, next) => {
    try {

        if(req.user.role !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for students",
            });
        }

        next();

    }
    
    catch(error) {

        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified",
        })

    }
}

exports.isAdmin = (req, res, next) => {
    try {

        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is protected route for admin",
            });
        }

        next();

    }
    
    catch(error) {

        return res.status(500).json({
            success: false,
            message: "User Role cannot be verified",
        })

    }
}