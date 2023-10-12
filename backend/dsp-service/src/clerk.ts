import clerk from '@clerk/clerk-sdk-node';


export async function userList() {
  const users = clerk.users.getUserList();
  return users;
}

export async function sessions() {
  const sessions = clerk.sessions.getSessionList();
  return sessions;
}