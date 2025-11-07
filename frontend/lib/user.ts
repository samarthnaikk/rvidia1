import prisma from "../lib/prisma";

export async function createUser({
  email,
  username,
  password,
  googleId,
  name,
}: {
  email: string;
  username: string;
  password: string;
  googleId?: string;
  name?: string;
}) {
  try {
    // If name is not provided, use username as the display name
    const displayName = name || username;

    return await prisma.user.create({
      data: {
        email,
        username,
        password,
        googleId,
        name: displayName,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    // Use Prisma's findUnique for cleaner query
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}

export async function getUserByUsername(username: string) {
  try {
    // Try to find the user with the username field
    return await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { name: username }, // Backward compatibility
        ],
      },
    });
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
}

export async function getUserById(id: string | number) {
  try {
    // Convert string id to number if necessary
    const userId = typeof id === "string" ? parseInt(id, 10) : id;

    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
}

export async function getUserByIdentifier(identifier: string) {
  // Try to find user by email first
  const userByEmail = await getUserByEmail(identifier);
  if (userByEmail) return userByEmail;

  // If not found, try by username
  return await getUserByUsername(identifier);
}

export async function updateUser(
  id: number,
  data: {
    password?: string;
    googleId?: string;
    name?: string;
    username?: string;
  }
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}
