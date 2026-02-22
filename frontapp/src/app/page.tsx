
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
        Bienvenido a Lyrium Marketplace
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          href="/admin/dashboard"
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group"
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 text-blue-400">
            Panel Admin &rarr;
          </h2>
          <p className="text-gray-600 ">
            Gestiona usuarios, productos y configuraciones del sistema.
          </p>
        </Link>

        <Link
          href="/seller/dashboard"
          className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group"
        >
          <h2 className="text-2xl font-semibold mb-2 text-gray-900 group-hover:text-purple-600 text-purple-400">
            Panel Vendedor &rarr;
          </h2>
          <p className="text-gray-600 ">
            Gestiona tu tienda, inventario y pedidos.
          </p>
        </Link>
      </div>
    </main>
  );
}

