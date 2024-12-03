import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  ConfirmToken,
  ForgotPasswordForm,
  NewPasswordForm,
  RequestConfirmationCodeForm,
  UserLoginForm,
  UserRegistrationForm,
} from "../types";

export async function createAccount(formatData: UserRegistrationForm) {
  try {
    const url = "/auth/create-account";
    const { data } = await api.post<string>(url, formatData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function confirmAccount(formatData: ConfirmToken) {
  try {
    const url = "/auth/confirm-account";
    const { data } = await api.post<string>(url, formatData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function requestConfirmationCode(
  formatData: RequestConfirmationCodeForm
) {
  try {
    const url = "/auth/request-code";
    const { data } = await api.post<string>(url, formatData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function AuthenticateUsers(formatData: UserLoginForm) {
  try {
    const url = "/auth/login";
    const { data } = await api.post<string>(url, formatData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function forgotPassword(formatData: ForgotPasswordForm) {
  try {
    const url = "/auth/forgot-password";
    const { data } = await api.post<string>(url, formatData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function validateToken(formatData: ConfirmToken) {
  try {
    const url = "/auth/validate-token";
    const { data } = await api.post<string>(url, formatData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
export async function updatePasswordWithToken({
  formatData,
  token,
}: {
  formatData: NewPasswordForm;
  token: ConfirmToken["token"];
}) {
  try {
    const url = `/auth/update-password/${token}`;
    const { data } = await api.post<string>(url, formatData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
