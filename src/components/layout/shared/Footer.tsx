import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600">
                        © {currentYear} MarketPlace. Todos los derechos reservados.
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/terms"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Términos
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Privacidad
                        </Link>
                        <Link
                            href="/support"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            Soporte
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
