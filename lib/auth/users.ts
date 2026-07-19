import type { AuthUser } from "@/lib/types/auth";

interface StoredUser extends AuthUser {
  password: string;
}

const mockUsers: StoredUser[] = [];

function toAuthUser(user: StoredUser): AuthUser {
  const { password: _password, ...authUser } = user;
  return authUser;
}

export function findUserByCredentials(
  username: string,
  password: string,
): AuthUser | null {
  const user = mockUsers.find(
    (entry) =>
      entry.username.toLowerCase() === username.trim().toLowerCase() &&
      entry.password === password,
  );

  if (!user) {
    return null;
  }

  return toAuthUser(user);
}

export function usernameExists(username: string): boolean {
  const normalized = username.trim().toLowerCase();
  return mockUsers.some((entry) => entry.username.toLowerCase() === normalized);
}

export function createUser(input: {
  name: string;
  username: string;
  password: string;
}): AuthUser {
  const user: StoredUser = {
    id: String(mockUsers.length + 1),
    username: input.username.trim(),
    name: input.name.trim(),
    role: "user",
    password: input.password,
  };

  mockUsers.push(user);
  return toAuthUser(user);
}
