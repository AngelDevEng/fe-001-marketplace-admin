import SellerNavbar from '@/components/layout/seller/SellerNavbar';
import Icon from '@/components/ui/Icon';

export default function SellerDashboard() {
    return (
        <>
            <SellerNavbar
                title="Dashboard Vendedor"
                breadcrumbs={[
                    { label: 'Seller', href: '/seller' },
                    { label: 'Dashboard' },
                ]}
                actions={
                    <>
                        <button className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            Ver Reportes
                        </button>
                    </>
                }
            />

            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Ventas Hoy
                            </h3>
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <Icon name="DollarSign" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">$1,234.50</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% vs ayer</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pedidos Pendientes
                            </h3>
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <Icon name="AlertCircle" className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">5 requieren atención</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Productos Activos
                            </h3>
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Icon name="Package" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">3 con stock bajo</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Valoración
                            </h3>
                            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                                <Icon name="Star" className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Basado en 234 reseñas</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Acciones Rápidas
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            Panel de vendedor listo para usar
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
