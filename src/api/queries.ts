import axios, { AxiosInstance, AxiosResponse } from "axios";

export const baseUrl = "https://tgshka-back.testbotbot.site";
// export const socketBaseUrl = "wss://back.alotprojectb.sitetrade/socket";

// Mock function since we don't have the actual Telegram launch params
const retrieveLaunchParams = () => ({ initDataRaw: "" });

const { initDataRaw } = retrieveLaunchParams();
export const initData = `tma ${initDataRaw}`;
// export const initData = "";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: initData,
  },
});