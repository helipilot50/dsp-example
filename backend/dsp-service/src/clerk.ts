import clerkClient, { User } from '@clerk/clerk-sdk-node';
import jwt from 'jsonwebtoken';
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
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    throw new Error('No decoded token');
  }
  if (!decodedToken.sub) {
    throw new Error('No decodedToken.sub');
  }
  return userById(decodedToken.sub as string);
}

export async function userById(id: string): Promise<User> {
  const user = await clerkClient.users.getUser(id as string);
  return user;
}

export function decodeToken(token: string) {
  const decoded = jwt.decode(token);
  // const decoded = jwt.verify(token, process.env.CLERK_JWT_PUBLIC_KEY as string);

  return decoded;
}