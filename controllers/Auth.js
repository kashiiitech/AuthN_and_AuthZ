const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config()

// signup route handler

exports.signup = async (req, res) => {
    try{
        // get data
        const {name, email, password, role} = req.body;
        // check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json(
                {
                    success: false,
                    message: "user already exists",
                }
            );
        }

        // secure password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10); // 10 no of rounds 10 is optimal number

        }
        catch(err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        // Create User (create entry)
        const user = await User.create({
            name, email, password: hashedPassword, role
        });

        return res.status(200).json({
            success: true,
            message: "User created Successfully",
        })
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cann't be registered, please try again later",
        });
    }
}


// login

exports.login = async (req, res) => {
    try {
        // data fetch
        const {email, password} = req.body;
        //validation on email and password
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully"
            })
        }

        // check user available or not
        let user = await User.findOne({email});
        // if not a regestired user
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered"
            })
        }

        const payload = {
            emai: user.email,
            id: user._id,
            role: user.role,
        }

        // verify password and generate a JWT token
        if (await bcrypt.compare(password, user.password)) {
            // password match

            let token = jwt.sign(payload, process.env.JWT_SECRET, 
                {
                    expiresIn: "2h",
                });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            // creating a cookie
            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,

            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "user logged in successfully"
            })


        } else {
            // password do not match
            return res.status(403).json({
                success: false,
                message: "Password Incorrect"
            })
        }

    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login Failure",
        })

    }
}