import bcrypt from "bcrypt";
import User from "../model/user";
import jwt from "jsonwebtoken";
import { Validator } from "node-input-validator"


export default class Authentication {
    static async register(req: any, res: any) {
        try {
            let TOKEN_KEY: string = process.env.TOKEN_KEY || 'x'
            const validate = new Validator(req.body, {
                email: 'required|email',
                password: 'required|minLength:5',
                first_name: 'required|string',
                last_name: 'required|string'
            });
            validate.check().then((matched) => {
                if (!matched) {
                    res.status(422).send(validate.errors);
                }
            });
            const { first_name, last_name, email, password } = req.body;

            const oldUser = await User.findOne({ email });

            if (oldUser) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            //Encrypt user password
            let encryptedPassword = await bcrypt.hash(password, 10);

            // Create user in our database
            const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(), // sanitize: convert email to lowercase
                password: encryptedPassword,
            });

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;

            // return new user
            res.status(201).json(user);
        } catch (err) {
            console.log(err);
        }
    }
    static async login(req: any, res: any) {
        try {
            let TOKEN_KEY: string = process.env.TOKEN_KEY || 'x'
            // Get user input
            const { email, password } = req.body;

            // Validate user input
            if (!(email && password)) {
                res.status(400).send("All input is required");
            }
            // Validate if user exist in our database
            const user = await User.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                // save user token
                user.token = token;

                // user
                res.status(200).json(user);
            } else {
                res.status(400).send("Invalid Credentials");
            }
        } catch (err) {
            console.log(err);
        }
    }
} 