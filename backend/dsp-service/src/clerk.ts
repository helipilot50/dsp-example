import clerkClient, { User, verifyJwt, decodeJwt, hasValidSignature } from '@clerk/clerk-sdk-node';
import jwt from 'jsonwebtoken';
import { logger } from './logger';
export { JwtPayload } from 'jsonwebtoken';
export { User } from '@clerk/clerk-sdk-node';


export async function userList() {
  const users = clerkClient.users.getUserList();
  return users;
}

export async function sessions() {
  const sessions = clerkClient.sessions.getSessionList();
  return sessions;
}

export async function userByToken(token: string): Promise<User> {
  const decodedToken: any = decodeToken(token);
  if (!decodedToken) {
    throw new Error('No decoded token');
  }
  if (!decodedToken.sub) {
    throw new Error('No decodedToken.sub');
  }
  return userById(decodedToken.sub as string);
}

export async function userById(id: string): Promise<User> {
  const user = await clerkClient.users.getUser(id);
  return user;
}

export function decodeToken(token: string) {
  const decoded = decodeJwt(token);
  // try {
  //   // const verified = jwt.verify(token,
  //   //   process.env.CLERK_JWT_PUBLIC_KEY as string,
  //   // );
  //   logger.info('token verify', verified);
  // } catch (err) {
  //   logger.error('token verify', err);
  // }

  return decoded;
}