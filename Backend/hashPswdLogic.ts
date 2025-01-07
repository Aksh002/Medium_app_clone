import bcrypt from 'bcrypt'

export async function hashPswd(password: string) {
    const saltRounds=10
    const hashed= await bcrypt.hash(password,saltRounds)
    return hashed;
}

export async function verifyPswd(plainPswd: string,hashPswd: string) {
    const isMatch= await bcrypt.compare(plainPswd,hashPswd)
    return isMatch;
}

