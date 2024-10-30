import userServices from "./user.services";
import tokenServices from "./token.services";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { TokenType, User } from '@prisma/client';
import prisma from '../client';
import { encryptPassword, comparePassword } from '../utils/encryption';
import { AuthTokensResponse } from '../types/response';
import exclude from '../utils/exclude';


const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<Omit<User, 'password'>> => {
    const user = await userServices.getUserByEmail(email, [
        'id',
        'email',
        'name',
        'password',
        'role',
        'isEmailVerified',
        'createdAt',
        'updatedAt'
    ]);

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }

    return exclude(user, ['password']);
};

const logout = async (refreshToken: string): Promise<void> => {
    const refreshTokenData = await prisma.token.findFirst({
        where: {
            token: refreshToken,
            type: TokenType.REFRESH,
            blacklisted: false
        }
    });
    if(!refreshTokenData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await prisma.token.delete({
        where: {
            id: refreshTokenData.id
        }
    });
};

const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
    try{
        const refreshTokenData = await tokenServices.verifyToken(refreshToken, TokenType.REFRESH);
        const { userId } = refreshTokenData;
        await prisma.token.delete({ where: { id: refreshTokenData.id } });
        return tokenServices.generateAuthTokens({ id: userId });
    }catch(err){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
}


const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
    try{
        const resetPasswordTokenData = await tokenServices.verifyToken(resetPasswordToken, TokenType.RESET_PASSWORD);

        const user = await userServices.getUserById(resetPasswordTokenData.userId);
        if(!user) {
            throw new Error('No user found');
        }

        const encryptedPassword = await encryptPassword(newPassword);
        await userServices.updateUserById(user.id, { password: encryptedPassword });
        await prisma.token.deleteMany({ where: { userId: user.id, type: TokenType.RESET_PASSWORD } });

    }catch(err){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
}


const verifyEmail = async (verifyEmailToken: string): Promise<void> => {
    try{
        const verifyEmailTokenData = await tokenServices.verifyToken(verifyEmailToken, TokenType.VERIFY_EMAIL);
        await prisma.token.deleteMany({
            where: { userId: verifyEmailTokenData.userId, type: TokenType.VERIFY_EMAIL }
          });
          await userServices.updateUserById(verifyEmailTokenData.userId, { isEmailVerified: true });
    }catch(err){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
    }
}


export default {
    loginUserWithEmailAndPassword,
    comparePassword,
    encryptPassword,
    logout,
    refreshAuth,
    resetPassword,
    verifyEmail
}