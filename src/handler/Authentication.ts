import bcrypt from "bcrypt";
import User from "../model/user";
import jwt from "jsonwebtoken";
import { Validator } from "node-input-validator"
import { ResponseFormat } from "../interface";


export default class Authentication {
    static async register(req: any, res: any): Promise<any> {
        try {
            let TOKEN_KEY: string = process.env.TOKEN_KEY || 'x'
            const validate = new Validator(req.body, {
                email: 'required|email',
                password: 'required|minLength:5',
                first_name: 'required|string',
                last_name: 'required|string'
            });
            validate.check().then(async (matched) => {
                if (!matched) {
                    let response: ResponseFormat = {
                        status: 422,
                        message: "Please provide the parameters in correct format!",
                        data: validate.errors
                    }
                    return res.status(422).json(response)
                } else {
                    const { first_name, last_name, email, password } = req.body;

                    const oldUser = await User.findOne({ email });

                    if (oldUser) {
                        let response: ResponseFormat = {
                            status: 409,
                            message: "User Already Exist. Please Login",
                            data: {}
                        }
                        return res.status(409).json(response)
                    }

                    //Encrypt user password
                    let encryptedPassword = await bcrypt.hash(password, 10);

                    // Create user in our database
                    const user = await User.create({
                        first_name,
                        last_name,
                        email: email.toLowerCase(),
                        password: encryptedPassword,
                    });

                    // Create JWT token
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        TOKEN_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );
                    user.token = token;
                    return res.status(201).json(user);
                }
            });
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