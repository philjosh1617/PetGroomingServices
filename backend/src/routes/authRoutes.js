import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";



const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"})
}


router.get("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        
        if(!username || !email || !password){
            return res.status(400).json({ message: "All fields are required"})
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long"})
        }

        if(username.length < 6) {
            return res.status(400).json({ message: "Username should be at least 6 characters long"})
        }

        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({ message: "Email Address already used"})
        }

        const existingUsername = await User.findOne({ username });
        if(existingUsername) {
            return res.status(400).json({ message: "Username already used"})
        }

        const profileImage = `https://api.dicebear.com/9.x/croodles/svg?seed=${username}`


        const user = new User({
            username,
            email,
            password,
            profileImage,

        });

        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
        });
        
    } catch (error) {
        console.log("Error in register route", error);
        return res.status(500).json({ message: "Internal Server Error"})
    }
});

router.get("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(400).json({message: "All field are required"});

        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "Invalid Credentials"});

        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"})

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            },
        });


    } catch (error) {
        console.log("Error in login route", error);
        return res.status(500).json({ message: "Internal Server Error"})
        
    }
});

export default router; 