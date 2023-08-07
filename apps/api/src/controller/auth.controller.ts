import { Request, Response } from "express";
import UserService from "../services/user.service";
import MfaService from "../services/mfa.service";
import User from "../model/user.model";
import JwtService from "../services/jwt.service";

class AuthController {


  static async getUserSession(req: Request, res: Response) {
    const email = req.query?.email.toString();

    const user = UserService.getUser(email);

    if (!user) {
      UserService.setUser({
        email: email.toString(),
        password: ''
      })
      const session = await UserService.createUserSession(email)
      res.send({ session: session.session, challenge: 'validate-email' });

    }else{
      const session = await UserService.getUserSession(email);

      if (!session) {
        const session = await UserService.createUserSession(email)
        await MfaService.getMfaSession(email);
        res.send({ session: session.session, challenge: 'validate-email' });
      } else {
        if(!user){
          res.send({ session: session.session, challenge: 'new-password' });
        } else {
          res.send({ session: session.session, challenge: 'password' });
        }
      }
    }
  }

  static async validateOTP(req: Request, res: Response) {
    const { session, secret } = req.body;
    const isValidMFA = await MfaService.validateMFA(session, secret);
    if(isValidMFA){
      const userSession = UserService.getUserBySession(session);
      if(userSession){
        res.send({ session: session, challenge: 'new-password' });
      } else {
        res.send({ session: session, challenge: 'password' });
      }
    } else {
      res.status(401).send({ message: 'Invalid OTP.' });
    }
  }

  
  static createPassword(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = UserService.setUser({
      email: email,
      password: password
    })
    const token = JwtService.createJwtToken(user);
    res.status(201).json({ token });
  }

  static login(req: Request, res: Response){
    const { email, password } = req.body;
    if(UserService.canLogin({email, password} as User)){
      res.json({ token: 'JWT' })
    } else {
      res.status(401).json({message: 'User or Password wrong'});
    }
  }
}

export default AuthController;