import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  ConfirmToken,
  RequestConfirmationCodeForm,
  UserLoginForm,
  UserRegistrationForm,
} from "../types";

export async function createAccount(formatDate: UserRegistrationForm) {
  try {
    const url = "/auth/create-account";
    const { data } = await api.post<string>(url, formatDate);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function confirmAccount(formatDate: ConfirmToken) {
  try {
    const url = "/auth/confirm-account";
    const { data } = await api.post<string>(url, formatDate);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function requestConfirmationCode(
  formatDate: RequestConfirmationCodeForm
) {
  try {
    const url = "/auth/request-code";
    const { data } = await api.post<string>(url, formatDate);
    return data;
  } catch (error) { 
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function AuthenticateUsers(
  formatDate: UserLoginForm
) {
  try {
    const url = "/auth/login";
    const { data } = await api.post<string>(url, formatDate);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}