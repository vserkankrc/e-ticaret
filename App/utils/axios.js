import axios from "axios";
import { Platform } from "react-native";
import { API_BASE_URL } from "@env";

let baseURL = API_BASE_URL;
if (Platform.OS === "android" && baseURL.includes("localhost")) {
  baseURL = baseURL.replace("localhost", "10.0.2.2");
}

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default api;
