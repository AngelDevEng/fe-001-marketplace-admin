import axios from "axios";
import { Product } from "./types";
import { Store } from "./types/stores/store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.WP_CS_KEY}:${process.env.WP_CS_SECRET}`,
  },
});

export const getProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get("/products");
  return response.data;
};

export const getStores = async (): Promise<Store[]> => {
  const response = await apiClient.get("/stores");
  return response.data;
};


export const getDetailStore = async (): Promise<Store[]> => {
  const response = await apiClient.get("/stores/1126");
  return response.data;
};