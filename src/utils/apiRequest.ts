"use server";
import { cookies } from "next/headers";
import axios from "axios";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export default async function apiRequest(
  method: HttpMethod,
  path: string,
  data: Record<string, unknown> | null = null
) {
  try {
    const cookie = (await cookies()).get("Access");
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
    const headers = {
      "Content-Type": "application/json",
      // Origin: "https://localhost:3000",
      ...(cookie?.value && { Authorization: `Bearer ${cookie.value}` }),
    };

    const response = await axios({
      method,
      url,
      headers,
      data: data ?? undefined,
      timeout: 30000,
    });

    return {
      success: true,
      status: response.status,
      ...response.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return {
          success: false,
          status: 408,
          message: "Request timed out after 30 seconds",
          isTimeout: true,
        };
      } else if (error.response?.status !== 500) {
        return {
          success: false,
          status: error.response?.status,
          message:
            error.response?.data?.message ||
            error.response?.data.errorMessage ||
            "Unknown Error, Try again later.",
        };
      } else if (error.response?.status === 500) {
        return {
          success: false,
          status: error.response?.status || 500,
          message:
            error.response?.data?.message ||
            error.response?.data.errorMessage ||
            "Internal Server Error, Please contact support.",
        };
      }
    }
    return {
      success: false,
      status: 500,
      message: "Server Error",
    };
  }
}
