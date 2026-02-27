import Icon from '@/components/ui/Icon';

export default function PublicPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Bienvenido a <span className="text-sky-500">Lyrium</span> Biomarketplace
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Tu marketplace de confianza para productos y servicios especializados
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                    <div className="w-14 h-14 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                        <Icon name="ShoppingBag" className="text-2xl text-lime-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Productos</h3>
                    <p className="text-gray-600">Explora nuestra amplia variedad de productos especializados</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                    <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center mb-4">
                        <Icon name="Headset" className="text-2xl text-sky-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Servicios</h3>
                    <p className="text-gray-600">Descubre servicios especializados para tu bienestar</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <Icon name="Storefront" className="text-2xl text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Registra tu tienda</h3>
                    <p className="text-gray-600">Únete a nuestra red de vendedores especializados</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 rounded-3xl p-8 md:p-12 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
                <p className="text-lg mb-6 opacity-90">Únete a miles de usuarios que ya confían en Lyrium</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/login" className="bg-white text-sky-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                        Iniciar Sesión
                    </a>
                    <a href="/loginTienda" className="bg-sky-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-700 transition border border-white/30">
                        Registrar mi Tienda
                    </a>
                </div>
            </div>
        </div>
    );
}
