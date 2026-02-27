/**
 * Datos del menú de navegación y mega-menú
 * Extraídos de PublicHeader.tsx para mantener SRP
 * Futuro: estos datos vendrán de la API de Laravel
 */

export interface MenuItem {
    label: string;
    href: string;
    icon?: string;
    children?: MenuItem[];
}

export interface MegaCategoryData {
    icons: { title: string; img: string; href: string }[];
    cols: { h: string; items: string[] }[];
}

export const megaMenuData: Record<string, MegaCategoryData> = {
    'Bebés y recién nacidos': {
        icons: [
            { title: 'De paseo y en el coche', img: '/img/Productos/Bebes/1.webp', href: '/productos/bebes/paseo' },
            { title: 'Alimentación', img: '/img/Productos/Bebes/2.webp', href: '/productos/bebes/alimentacion' },
            { title: 'Juguetes', img: '/img/Productos/Bebes/3.webp', href: '/productos/bebes/juguetes' },
            { title: 'Ropa', img: '/img/Productos/Bebes/4.webp', href: '/productos/bebes/ropa' },
            { title: 'Calzado', img: '/img/Productos/Bebes/5.webp', href: '/productos/bebes/calzado' },
            { title: 'Lactancia y chupetes', img: '/img/Productos/Bebes/6.webp', href: '/productos/bebes/lactancia' },
        ],
        cols: [
            { h: 'ALIMENTACIÓN', items: ['Menaje infantil', 'Suplementos nutricionales', 'Tronas y elevadores'] },
            { h: 'CALZADO', items: ['Bebé (0–2 años)', 'Infante (2–4 años)'] },
            { h: 'DE PASEO Y EN EL COCHE', items: ['De paseo', 'En el coche'] },
            { h: 'DESCANSO', items: ['Accesorios para dormitorio', 'Cunas y moisés', 'Proyectores', 'Relax y juego'] },
            { h: 'ROPA', items: ['Bebé (0–2 años)', 'Infante (2–4 años)'] },
        ],
    },
    'Belleza': {
        icons: [
            { title: 'Hombres', img: '/img/Productos/Belleza/1.webp', href: '/productos/belleza/hombres' },
            { title: 'Mujeres', img: '/img/Productos/Belleza/2.webp', href: '/productos/belleza/mujeres' },
            { title: 'Adolescentes, Niños y bebes', img: '/img/Productos/Belleza/3.webp', href: '/productos/belleza/jovenes' },
        ],
        cols: [
            { h: 'ADOLESCENTES', items: ['Aseo e higiene personal', 'Coloración', 'Cuidado corporal', 'Cuidado del cabello', 'Cuidado facial', 'Maquillaje'] },
            { h: 'HOMBRE', items: ['Aseo e higiene personal', 'Coloración', 'Cuidado del cabello', 'Cuidado facial', 'Maquillaje'] },
            { h: 'MUJER', items: ['Aseo e higiene personal', 'Coloración', 'Cuidado corporal', 'Cuidado del cabello', 'Cuidado facial', 'Maquillaje'] },
        ],
    },
    'Bienestar emocional y medicina natural': {
        icons: [
            { title: 'Sistema Nervioso', img: '/img/Productos/Bienestar/1.webp', href: '/productos/bienestar/nervioso' },
            { title: 'Sistema Digestivo', img: '/img/Productos/Bienestar/2.webp', href: '/productos/bienestar/digestivo' },
            { title: 'Sistema Circulatorio', img: '/img/Productos/Bienestar/3.webp', href: '/productos/bienestar/circulatorio' },
            { title: 'Sistema Oseo', img: '/img/Productos/Bienestar/4.webp', href: '/productos/bienestar/oseo' },
            { title: 'Sistema Muscular', img: '/img/Productos/Bienestar/5.webp', href: '/productos/bienestar/muscular' },
            { title: 'Sistema Inmunologico', img: '/img/Productos/Bienestar/6.webp', href: '/productos/bienestar/inmune' },
        ],
        cols: [
            { h: 'RELAX', items: ['Aromas', 'Velas', 'Difusores'] },
            { h: 'SUEÑO', items: ['Melatonina', 'Tés', 'Rutina nocturna'] },
            { h: 'MEDICINA NATURAL', items: ['Extractos', 'Plantas', 'Jarabes'] },
            { h: 'MENTE', items: ['Mindfulness', 'Journaling'] },
            { h: 'BIENESTAR', items: ['Packs', 'Promos'] },
        ],
    },
    'Bienestar físico y deportes': {
        icons: [
            { title: 'Calzado Mujer', img: '/img/Productos/BienestarF/1.webp', href: '/productos/deportes/calzado-mujer' },
            { title: 'Ropa mujer', img: '/img/Productos/BienestarF/2.webp', href: '/productos/deportes/ropa-mujer' },
            { title: 'Calzado Hombre', img: '/img/Productos/BienestarF/3.webp', href: '/productos/deportes/calzado-hombre' },
            { title: 'Ropa Hombre', img: '/img/Productos/BienestarF/4.webp', href: '/productos/deportes/ropa-hombre' },
            { title: 'Deportes Niños', img: '/img/Productos/BienestarF/5.webp', href: '/productos/deportes/ninos' },
            { title: 'Deportes Hombre', img: '/img/Productos/BienestarF/6.webp', href: '/productos/deportes/deportes-hombre' },
        ],
        cols: [
            { h: 'CALZADO MUJER', items: ['Basquet', 'Calzado plataforma', 'Chimpunes', 'Gimnasio', 'Running', 'Sandalias'] },
            { h: 'ACCESORIOS MUJER', items: ['Balones', 'Mochilas', 'Gorras', 'Guantes', 'Medias'] },
            { h: 'DEPORTES', items: ['Basquet', 'Buceo', 'Ciclismo', 'Futbol', 'Gimnasio', 'Natacion', 'Running'] },
            { h: 'ROPA MUJER', items: ['Bras', 'Buzos', 'Camisetas', 'Casacas', 'Faldas', 'Licras', 'Pantalones'] },
            { h: 'CALZADO HOMBRE', items: ['Basquet', 'Calzado plataforma', 'Chimpunes', 'Gimnasio', 'Running', 'Sandalias'] },
        ],
    },
    'Digestión saludable': {
        icons: [
            { title: 'Abarrotes', img: '/img/Productos/Digestion/1.webp', href: '/productos/digestion/abarrotes' },
            { title: 'Desayunos', img: '/img/Productos/Digestion/2.webp', href: '/productos/digestion/desayunos' },
            { title: 'Lácteos y frescos', img: '/img/Productos/Digestion/3.webp', href: '/productos/digestion/lacteos' },
            { title: 'Bebidas', img: '/img/Productos/Digestion/4.webp', href: '/productos/digestion/bebidas' },
            { title: 'Dulces y snacks', img: '/img/Productos/Digestion/5.webp', href: '/productos/digestion/dulces' },
            { title: 'Panadería', img: '/img/Productos/Digestion/6.webp', href: '/productos/digestion/panaderia' },
        ],
        cols: [
            { h: 'ABARROTES', items: ['Aceites', 'Arroz', 'Cereales', 'Conservas', 'Harinas', 'Pastas'] },
            { h: 'BEBIDAS', items: ['Jugos', 'Refrescos', 'Aguas', 'Tés'] },
            { h: 'LÁCTEOS', items: ['Leche', 'Yogurt', 'Quesos', 'Mantequilla'] },
            { h: 'DULCES', items: ['Chocolates', 'Galletas', 'Caramelos'] },
            { h: 'PANADERÍA', items: ['Pan', 'Tortillas', 'Bizcochos'] },
        ],
    },
    'Equipos y dispositivos médicos': {
        icons: [
            { title: 'Diagnóstico', img: '/img/Productos/Equipos/1.webp', href: '/productos/equipos/diagnostico' },
            { title: 'Tratamiento', img: '/img/Productos/Equipos/2.webp', href: '/productos/equipos/tratamiento' },
            { title: 'Rehabilitación', img: '/img/Productos/Equipos/3.webp', href: '/productos/equipos/rehabilitacion' },
            { title: 'Movilidad', img: '/img/Productos/Equipos/4.webp', href: '/productos/equipos/movilidad' },
            { title: 'Cuidado en casa', img: '/img/Productos/Equipos/5.webp', href: '/productos/equipos/casa' },
            { title: 'Emergencias', img: '/img/Productos/Equipos/6.webp', href: '/productos/equipos/emergencias' },
        ],
        cols: [
            { h: 'DIAGNÓSTICO', items: ['Básculas', 'Glucómetros', 'Oxímetros', 'Termómetros', 'Tensiómetros'] },
            { h: 'TRATAMIENTO', items: ['Nebulizadores', 'Concentrador de oxígeno', 'Bombas de infusión'] },
            { h: 'REHABILITACIÓN', items: ['Ejercitadores', 'Fisioterapia', 'Terapias'] },
            { h: 'MOVILIDAD', items: ['Sillas de ruedas', 'Bastones', 'Andadores', 'Grúas'] },
            { h: 'EMERGENCIAS', items: ['Kits de primeros auxilios', 'Desfibriladores'] },
        ],
    },
    'Mascotas': {
        icons: [
            { title: 'Perros', img: '/img/Productos/Mascotas/1.webp', href: '/productos/mascotas/perros' },
            { title: 'Gatos', img: '/img/Productos/Mascotas/2.webp', href: '/productos/mascotas/gatos' },
            { title: 'Aves', img: '/img/Productos/Mascotas/3.webp', href: '/productos/mascotas/aves' },
            { title: 'Peces', img: '/img/Productos/Mascotas/4.webp', href: '/productos/mascotas/peces' },
            { title: 'Otros', img: '/img/Productos/Mascotas/5.webp', href: '/productos/mascotas/otros' },
        ],
        cols: [
            { h: 'PERROS', items: ['Alimento', 'Juguetes', 'Camas', 'Collares', 'Medicamentos'] },
            { h: 'GATOS', items: ['Alimento', 'Juguetes', 'Camas', 'Arena', 'Medicamentos'] },
            { h: 'AVES', items: ['Alimento', 'Jaulas', 'Juguetes', 'Suplementos'] },
            { h: 'PECES', items: ['Alimento', 'Acuarios', 'Filtros', 'Decoración'] },
            { h: 'OTROS', items: ['Roedores', 'Reptiles', 'Suplementos'] },
        ],
    },
    'Protección limpieza y desinfección': {
        icons: [
            { title: 'Limpieza Hogar', img: '/img/Productos/Limpieza/1.webp', href: '/productos/limpieza/hogar' },
            { title: 'Desinfección', img: '/img/Productos/Limpieza/2.webp', href: '/productos/limpieza/desinfeccion' },
            { title: 'Protección Personal', img: '/img/Productos/Limpieza/3.webp', href: '/productos/limpieza/proteccion' },
            { title: 'Antibacteriales', img: '/img/Productos/Limpieza/4.webp', href: '/productos/limpieza/antibacteriales' },
        ],
        cols: [
            { h: 'LIMPIEZA HOGAR', items: ['Detergentes', 'Suavizantes', 'Limpiadores', 'Escobas', 'Trapeadores'] },
            { h: 'DESINFECCIÓN', items: ['Cloro', 'Alcohol', 'Gel antibacterial', 'Sprays'] },
            { h: 'PROTECCIÓN', items: ['Guantes', 'Mascarillas', 'Cofias', 'Batas'] },
            { h: 'ANTIBACTERIALES', items: ['Jabón líquido', 'Toallas húmedas', 'Desinfectantes'] },
        ],
    },
    'Suplementos vitamínicos': {
        icons: [
            { title: 'Vitaminas', img: '/img/Productos/Suplementos/1.webp', href: '/productos/suplementos/vitaminas' },
            { title: 'Minerales', img: '/img/Productos/Suplementos/2.webp', href: '/productos/suplementos/minerales' },
            { title: 'Proteínas', img: '/img/Productos/Suplementos/3.webp', href: '/productos/suplementos/proteinas' },
            { title: 'Aminoácidos', img: '/img/Productos/Suplementos/4.webp', href: '/productos/suplementos/aminoacidos' },
            { title: 'Hierbas', img: '/img/Productos/Suplementos/5.webp', href: '/productos/suplementos/hierbas' },
            { title: 'Deportivos', img: '/img/Productos/Suplementos/6.webp', href: '/productos/suplementos/deportivos' },
        ],
        cols: [
            { h: 'VITAMINAS', items: ['Vitamina A', 'Vitamina C', 'Vitamina D', 'Vitamina E', 'Vitamina B'] },
            { h: 'MINERALES', items: ['Hierro', 'Calcio', 'Magnesio', 'Zinc', 'Potasio'] },
            { h: 'PROTEÍNAS', items: ['Whey', 'Caseína', 'Vegetal', 'BCAA'] },
            { h: 'HIERBAS', items: ['Ginseng', 'Valeriana', 'Té verde', 'Espirulina'] },
            { h: 'DEPORTIVOS', items: ['Pre-workout', 'Creatina', 'Glutamina', 'Carnitina'] },
        ],
    },
};

export const menuItems: MenuItem[] = [
    {
        label: 'PRODUCTOS',
        href: '/productos',
        icon: 'shopping-bag',
        children: [
            { label: 'Bebés y recién nacidos', href: '/productos/bebes' },
            { label: 'Belleza', href: '/productos/belleza' },
            { label: 'Bienestar emocional y medicina natural', href: '/productos/bienestar' },
            { label: 'Bienestar físico y deportes', href: '/productos/deportes' },
            { label: 'Digestión saludable', href: '/productos/digestion' },
            { label: 'Equipos y dispositivos médicos', href: '/productos/equipos' },
            { label: 'Mascotas', href: '/productos/mascotas' },
            { label: 'Protección limpieza y desinfección', href: '/productos/limpieza' },
            { label: 'Suplementos vitamínicos', href: '/productos/suplementos' },
        ],
    },
    {
        label: 'SERVICIOS',
        href: '/servicios',
        icon: 'headset',
        children: [
            { label: 'Consultas médicas', href: '/servicios/consultas' },
            { label: 'Terapias alternativas', href: '/servicios/terapias' },
            { label: 'Análisis de laboratorio', href: '/servicios/laboratorio' },
            { label: 'Programas de bienestar', href: '/servicios/bienestar' },
            { label: 'Asesoría nutricional', href: '/servicios/nutricional' },
        ],
    },
    {
        label: 'NOSOTROS',
        href: '/nosotros',
        icon: 'info',
    },
    {
        label: 'REGISTRA TU TIENDA',
        href: '/login-tienda',
        icon: 'storefront',
    },
    {
        label: 'TIENDAS REGISTRADAS',
        href: '/tiendas',
        icon: 'buildings',
    },
    {
        label: 'CONTÁCTANOS',
        href: '/contacto',
        icon: 'phone-call',
    },
    {
        label: 'BIOBLOG',
        href: '/bioblog',
        icon: 'newspaper',
    },
    {
        label: 'BIOFORO',
        href: '/bioforo',
        icon: 'chats-circle',
    },
];
