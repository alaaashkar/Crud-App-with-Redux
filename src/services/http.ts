import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Update the base URL as needed
});
