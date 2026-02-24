/**
 * GET /api/rapifac/invoices?seller_id=xxx
 * ---------------------------------------------------------------
 * Devuelve las facturas del store compartido.
 *
 * Parámetros de query:
 *   seller_id  (opcional) — filtra solo las facturas de ese vendedor.
 *                Si se omite, devuelve TODAS (uso del admin).
 * ---------------------------------------------------------------
 */

import { NextResponse } from 'next/server';
import { invoiceStore } from '@/lib/rapifac/invoiceStore';

export async function GET(request: Request) {
    // TODO: implementar autenticación real antes de producción
    // TODO: verificar que el usuario tenga permisos para ver facturas
    console.warn(`[${new Date().toISOString()}] ⚠️ API /api/rapifac/invoices llamada sin auth real - Origen: ${request.headers.get('origin') || 'desconocido'}`);

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');

    const invoices = sellerId
        ? invoiceStore.getBySeller(sellerId)
        : invoiceStore.getAll();

    return NextResponse.json({ success: true, data: invoices });
}
