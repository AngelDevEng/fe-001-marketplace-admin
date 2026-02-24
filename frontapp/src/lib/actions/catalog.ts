'use server';

import { revalidateTag } from 'next/cache';
import { parseWPProduct, parseWPProducts, Product } from '../adapters/wp-product.adapter';

/**
 * Server Action: Obtener productos del catálogo
 * Usa el adapter Zod para limpiar datos de WooCommerce
 */
export async function getProducts(vendorId?: string): Promise<Product[]> {
  // Por ahora usamos mock data - en producción sería:
  // const response = await fetch(`${process.env.WC_API_URL}/products?author=${vendorId}`);
  // const raw = await response.json();
  // return parseWPProducts(raw);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Import mock data y parsear (simulando respuesta WP)
  const { MOCK_CATALOG_DATA } = await import('../mocks/mockCatalogData');
  return MOCK_CATALOG_DATA as Product[];
}

/**
 * Server Action: Buscar productos con filtros
 */
export async function searchProducts(
  query: string,
  category?: string
): Promise<Product[]> {
  const products = await getProducts();
  
  let filtered = products;
  
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  return filtered;
}

/**
 * Server Action: Eliminar producto
 */
export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // En producción:
    // const response = await fetch(`${process.env.WC_API_URL}/products/${productId}`, {
    //   method: 'DELETE',
    //   headers: { 'Authorization': `Basic ${auth}` }
    // });
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Revalidar cache
    revalidateTag('seller-catalog', 'max');
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: 'No se pudo eliminar el producto. Intenta de nuevo.' 
    };
  }
}

/**
 * Server Action: Actualizar precio de producto (para Optimistic UI)
 */
export async function updateProductPrice(
  productId: string, 
  newPrice: number
): Promise<{ success: boolean; data?: { id: string; price: number }; error?: string }> {
  try {
    // Validar
    if (!productId) {
      return { success: false, error: 'ID de producto requerido' };
    }
    
    if (newPrice < 0) {
      return { success: false, error: 'El precio debe ser positivo' };
    }
    
    // Simular llamada a WC API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Revalidar cache
    revalidateTag('seller-catalog', 'max');
    
    return { 
      success: true, 
      data: { id: productId, price: newPrice } 
    };
  } catch (error) {
    return { 
      success: false, 
      error: 'No se pudo actualizar el precio. Intenta de nuevo.' 
    };
  }
}

/**
 * Server Action: Crear/Actualizar producto
 */
export async function saveProduct(
  product: Partial<Product>
): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    // Validar que tenga datos mínimos
    if (!product.name || product.name.trim() === '') {
      return { success: false, error: 'El nombre del producto es requerido' };
    }
    
    // En producción: llamada a WC API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Revalidar cache
    revalidateTag('seller-catalog', 'max');
    
    const savedProduct: Product = {
      id: product.id || Date.now().toString(),
      name: product.name,
      category: product.category || 'Sin categoría',
      price: product.price || 0,
      stock: product.stock || 0,
      description: product.description || '',
      image: product.image || '/placeholder.png',
      sticker: product.sticker || null,
      mainAttributes: product.mainAttributes || [],
      additionalAttributes: product.additionalAttributes || [],
      createdAt: new Date().toISOString(),
    };
    
    return { success: true, data: savedProduct };
  } catch (error) {
    return { 
      success: false, 
      error: 'Error al guardar el producto' 
    };
  }
}
