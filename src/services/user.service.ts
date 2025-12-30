import bcrypt from 'bcrypt';
import UserModel, { UserCreationAttributes, UserInstance } from "../models/user.model";
import { User, UserResponse, LoginRequest, AuthResponse, JWTPayload } from "../types";
import { generateTokens, verifyRefreshToken } from './jwt.service';

const SALT_ROUNDS = 12;

export const createUser = async (userData: UserCreationAttributes): Promise<UserResponse> => {
  // Check if user already exists
  const existingUser = await UserModel.findOne({ where: { email: userData.email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

  const userDataWithHashedPassword: UserCreationAttributes = {
    ...userData,
    password: hashedPassword
  };

  const user: UserInstance = await UserModel.create(userDataWithHashedPassword);
  const userJson = user.toJSON() as User;

  // Return user without password
  const { password, ...userResponse } = userJson;
  return userResponse;
};

export const authenticateUser = async (loginData: LoginRequest): Promise<AuthResponse> => {
  // Find user by email
  const user = await UserModel.findOne({
    where: { email: loginData.email }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const userJson = user.toJSON() as User;

  // Compare provided password with stored hash
  const isPasswordValid = await bcrypt.compare(loginData.password, userJson.password!);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    userId: userJson.id,
    email: userJson.email
  };

  const token = generateTokens(payload);

  return {
    token
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  try {
    const decoded = verifyRefreshToken(refreshToken) as JWTPayload;

    // Verify user still exists
    const user = await UserModel.findByPk(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: decoded.userId,
      email: decoded.email
    };

    const { accessToken } = generateTokens(payload);
    return { accessToken };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export const getUserById = async (userId: string): Promise<UserResponse> => {
  const user = await UserModel.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const userJson = user.toJSON() as User;

  // Return user without password
  const { password, ...userResponse } = userJson;
  return userResponse;
};

