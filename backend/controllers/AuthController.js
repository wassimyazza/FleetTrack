import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


class AuthController{
    
    async login(req, res){
        const {email, password} = req.body;
        const errors = [];
        if(!email){
            errors.push({field: "email", error: "Email field is required!"});
        }
        if(!password){
            errors.push({field: "password", error: "Password field is required!"});
        }

        if(errors.length > 0){
            return res.status(400).json(errors)
        }
        const checkEmail = await User.findOne({email});
        if(!checkEmail){
            return res.status(400).json({
                message:"Invalid Email or Password"
            })
        }
        const isMatch = await bcrypt.compare(password, checkEmail.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid Email or Password"
            })
        }

        const token = jwt.sign({id:checkEmail.id,firstname: checkEmail.firstname, email: checkEmail.email, role:checkEmail.role},process.env.JWT_SECRET_KEY, {expiresIn:'1h'});

        return res.status(200).json({
            message:'Login successfuly!',
            user: checkEmail,
            token: token
        })
    }
}


export default new AuthController();