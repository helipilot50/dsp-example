import clerk, { User } from '@clerk/clerk-sdk-node';
import jwt, { JwtPayload } from 'jsonwebtoken';


export async function userList() {
  const users = clerk.users.getUserList();
  return users;
}

export async function sessions() {
  const sessions = clerk.sessions.getSessionList();
  return sessions;
}

export async function user(token: string): Promise<User> {
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    throw new Error('No decoded token');
  }
  if (!decodedToken.sub) {
    throw new Error('No decodedToken.sub');
  }
  const user = await clerk.users.getUser(decodedToken.sub as string);
  return user;
}

export function decodeToken(token: string) {
  const decoded = jwt.decode(token);
  return decoded;
}