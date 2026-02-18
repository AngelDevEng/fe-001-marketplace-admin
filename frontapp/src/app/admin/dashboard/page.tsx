import AdminNavbar from '@/components/layout/admin/AdminNavbar';
import Icon from '@/components/ui/Icon';

export default function AdminDashboard() {
    return (
        <>
            <AdminNavbar
                title="Dashboard Admin"
                breadcrumbs={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Dashboard' },
                ]}
                actions={
                    <>
                        <button className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            Exportar
                        </button>
                        <button className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                            + Nueva Tienda
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
                                Total Ventas
                            </h3>
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Icon name="DollarSign" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">$45,231.89</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">+20.1% desde el mes pasado</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Tiendas Activas
                            </h3>
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <Icon name="Store" className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">+2,350</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">+180 nuevas este mes</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pedidos
                            </h3>
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <Icon name="ShoppingCart" className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">+12,234</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">+19% desde el mes pasado</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Vendedores
                            </h3>
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <Icon name="Users" className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">+573</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">+201 desde el mes pasado</p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Actividad Reciente
                        </h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                            Panel de administración listo para usar
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
