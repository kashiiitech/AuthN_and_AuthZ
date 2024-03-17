const express = require("express");
const router = express.Router();

// handlers for login and signup

const {login ,signup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);

// testing protected routes for single middleware
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for TESTS"
    });
})

// protected route -> to check whether someone has that role to access or not.
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Wellcome to the protected route for Students",
    })
});

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Wellcome to the protected route for Students",
    })
});

module.exports = router;