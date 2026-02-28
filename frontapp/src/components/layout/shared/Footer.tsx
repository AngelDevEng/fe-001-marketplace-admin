import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-[#111A15] border-t border-gray-200 dark:border-[#2A3F33] mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-600 dark:text-[#9BAF9F]">
                        © {currentYear} MarketPlace. Todos los derechos reservados.
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/terms"
                            className="text-sm text-gray-600 dark:text-[#9BAF9F] hover:text-gray-900 dark:hover:text-[#E8EDE9] transition-colors"
                        >
                            Términos
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-600 dark:text-[#9BAF9F] hover:text-gray-900 dark:hover:text-[#E8EDE9] transition-colors"
                        >
                            Privacidad
                        </Link>
                        <Link
                            href="/support"
                            className="text-sm text-gray-600 dark:text-[#9BAF9F] hover:text-gray-900 dark:hover:text-[#E8EDE9] transition-colors"
                        >
                            Soporte
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
