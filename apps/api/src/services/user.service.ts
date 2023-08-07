import Session from "../model/session.model";
import User from "../model/user.model";

const db: Array<Session> = [];
const users: Array<User> = [];

class UserService {

    static getUserSession(email): Promise<Session> {
        const session = db.find(session => session.email === email)
        return new Promise((resolve) => {
            resolve(session);
        })
    }

    static getUserBySession(session: number) {
        return db.find(user => user.session === session)
    }

    static createUserSession(email): Promise<Session> {
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
            const code = email.charCodeAt(i);
            hash = ((hash << 5) - hash) + code;
            hash = hash & hash;
        }

        return new Promise((resolve) => {
            resolve({
                email: email,
                session: hash,
                ttl: 60
            })
        })
    }

    static canLogin(user: User) {
        const dbUser = users.find(dbUser => dbUser.email === user.email);
        if (!dbUser) {
            return false;
        } else {
            return dbUser.password == user.password;
        }
    }

    static saveSessiononDB(session: Session) {
        db.push(session);
    }

    static getUser(email: string) {
        return users.find(user => user.email === email);
    }

    static setUser(user: User) {
        users.push(user);
        return user;
    }

    static updateUser(user: User) {
        const index = users.findIndex(val => val.email === user.email);
        users[index] = user;
        return user;
    }
}

export default UserService;
