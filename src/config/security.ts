import crypto from 'crypto';

class resultCrypto{
    salt:string;
    password:string;
    constructor(password:string, salt:string){
        this.password = password;
        this.salt = salt;
    };
}

function createSalt(){
    return new Promise<string>((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });
}

function createHashedPassword(plainPassword:string){
    return new Promise<resultCrypto>(async (resolve, reject) => {
    const salt:string = await createSalt();
    crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
        if (err) reject(err);
        resolve( new resultCrypto(key.toString('base64'), salt));
    });
})};
//#endregion

export default {createHashedPassword};