import { Request, Response } from "express";
import { createUser, authenticateUser, getUserById, refreshAccessToken } from "../services/user.service";
import { LoginRequest } from "../types";
import { UserCreationAttributes } from "../models/user.model";
import { errorResponse, successResponse } from "../utils/api-response";

export const userRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: UserCreationAttributes = req.body;
    const user = await createUser(userData);
    successResponse(res, 201, "User created successfully", user);
  } catch (error: any) {
    const message = error?.message || "Failed to create user";
    const statusCode = message.includes('already exists') ? 409 : 400;
    errorResponse(res, statusCode, "REQUEST_ERROR", message);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData: LoginRequest = req.body;
    const authResponse = await authenticateUser(loginData);

    successResponse(res, 200, "Login successful", authResponse);
  } catch (error: any) {
    const message = error?.message || "Login failed";
    errorResponse(res, 401, "AUTHENTICATION_ERROR", message);
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      errorResponse(res, 400, "MISSING_TOKEN", "Refresh token is required");
      return;
    }

    const tokens = await refreshAccessToken(refreshToken);
    successResponse(res, 200, "Token refreshed successfully", tokens);
  } catch (error: any) {
    const message = error?.message || "Token refresh failed";
    errorResponse(res, 401, "TOKEN_ERROR", message);
  }
};

export const fetchUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from the authenticated token
    const userId = req.user?.userId;

    if (!userId) {
      errorResponse(res, 401, "UNAUTHORIZED", "User ID not found in token");
      return;
    }

    const user = await getUserById(userId);
    successResponse(res, 200, "User fetched successfully", user);
  } catch (error: any) {
    const message = error?.message || "Failed to fetch user";
    errorResponse(res, 404, "USER_NOT_FOUND", message);
  }
};
