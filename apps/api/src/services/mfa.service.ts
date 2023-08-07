import { rejects } from "assert";

class MfaService {

    static getMfaSession(email): Promise<any> {
        // TODO implment MFA and email api's
        const token = '123456';
        console.log('TOKEN GENERATED: ' + token);
        return new Promise((resolve) => {
            resolve({
                email: email,
                session: 'Hash',
            })
        })
    }

    static validateMFA(session, secret): Promise<boolean> {
        return new Promise((resolve) => {
            if (secret === '123456') {
                resolve(true);
            }else {
                resolve(false);
            }
        })
    }
}

export default MfaService;