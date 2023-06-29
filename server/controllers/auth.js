import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
export const register = async (req, res) => {
    // console.log('REGISTER ENDPOINT ->', req.body);
    const {name, email, password, secret} = req.body;

    //validate
    if(!name) return res.status(400).send('Name is required. Please provide a valid name');
    
    const exist = await User.findOne({ email });
    if(exist) return res.status(400).send("Email already exists");
    
    if(!password || password.length < 8) 
        return res
        .status(400).
        send('Password is required and must be at least 8 characters');

    if(!secret) return res.status(400).send('Answer is required');

    // hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({ name, email, password: hashedPassword, secret });

    try {
        await user.save();
        console.log("USER REGISTERED =>", user);
        return res.json({
            ok: true,
        });
    } catch (err) {
        console.log("REGISTER FAILURE =>", err);
        return res.status(400).send("Error. Try again");
    }
};