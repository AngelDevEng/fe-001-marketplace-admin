import axios from "axios";
import { Product, ProductCategory, Order, ProductReview, SalesReport, Withdrawal } from "./types";
import { Store } from "./types/stores/store";

// Cliente para Dokan (Tiendas)
const dokanClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://lyriumbiomarketplace.com/wp-json/dokan/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Cliente para WooCommerce (Productos) - Usando Basic Auth (más compatible con CORS/WP)
const wcClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WC_API_URL || "https://lyriumbiomarketplace.com/wp-json/wc/v3",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    const key = process.env.NEXT_PUBLIC_WP_CS_KEY;
    const secret = process.env.NEXT_PUBLIC_WP_CS_SECRET;

    if (!key || !secret) {
      console.error("⚠️ Error: Las llaves de WooCommerce (WP_CS_KEY/SECRET) no están cargadas.");
    }

    // WooCommerce prefiere Basic Auth en el header
    const auth = btoa(`${key}:${secret}`);

    const response = await wcClient.get("/products", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("❌ WC API Error:", error.response.status, error.response.data);
    } else {
      console.error("❌ WC Connection Error:", error.message);
    }
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const key = process.env.NEXT_PUBLIC_WP_CS_KEY;
    const secret = process.env.NEXT_PUBLIC_WP_CS_SECRET;
    const auth = btoa(`${key}:${secret}`);

    const response = await wcClient.get("/orders", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: {
        per_page: 50,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders from WC:", error);
    throw error;
  }
};

export const getCategories = async (): Promise<ProductCategory[]> => {
  try {
    const key = process.env.NEXT_PUBLIC_WP_CS_KEY;
    const secret = process.env.NEXT_PUBLIC_WP_CS_SECRET;
    const auth = btoa(`${key}:${secret}`);

    const response = await wcClient.get("/products/categories", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: {
        per_page: 100,
        hide_empty: false
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories from WC:", error);
    throw error;
  }
};

export const getStores = async (): Promise<Store[]> => {
  try {
    const response = await dokanClient.get("/stores");
    return response.data;
  } catch (error) {
    console.error("Error fetching stores from Dokan:", error);
    throw error;
  }
};

export const getReviews = async (): Promise<ProductReview[]> => {
  try {
    const key = process.env.NEXT_PUBLIC_WP_CS_KEY;
    const secret = process.env.NEXT_PUBLIC_WP_CS_SECRET;
    const auth = btoa(`${key}:${secret}`);

    const response = await wcClient.get("/products/reviews", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: {
        per_page: 50,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews from WC:", error);
    throw error;
  }
};

export const getSalesReport = async (period: string = "month"): Promise<SalesReport[]> => {
  try {
    const key = process.env.NEXT_PUBLIC_WP_CS_KEY;
    const secret = process.env.NEXT_PUBLIC_WP_CS_SECRET;
    const auth = btoa(`${key}:${secret}`);

    const response = await wcClient.get("/reports/sales", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: {
        period: period,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales reports from WC:", error);
    throw error;
  }
};

export const getWithdrawals = async (): Promise<Withdrawal[]> => {
  try {
    const response = await dokanClient.get("/withdraw");
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawals from Dokan:", error);
    throw error;
  }
};

export const getDetailStore = async (id: string = "1126"): Promise<Store> => {
  const response = await dokanClient.get(`/stores/${id}`);
  return response.data;
};