import jwt from 'jsonwebtoken';

// just in test environment
const secretKey = process.env.jwt || 'secretKey';

class JwtService {
    static createJwtToken(payload) {
        return jwt.sign(payload, secretKey, {expiresIn: '7 days'});
    }

    validateToken(token: string){
        return jwt.verify(token, secretKey);
    }
}

export default JwtService;