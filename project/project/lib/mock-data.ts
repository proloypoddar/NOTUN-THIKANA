// Mock data for development purposes

export const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: '3',
    name: 'Landlord User',
    email: 'landlord@example.com',
    password: 'landlord123',
    role: 'landlord',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
];

// Function to find a mock user by email
export function findMockUserByEmail(email: string) {
  return mockUsers.find(user => user.email === email);
}

// Function to validate mock user credentials
export function validateMockUserCredentials(email: string, password: string) {
  const user = findMockUserByEmail(email);
  if (!user) return null;
  
  if (user.password === password) {
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}
