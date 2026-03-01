export interface NavItem {
    label: string;
    href: string;
    icon?: string;
    badge?: string | number;
    children?: NavItem[];
}

export interface NavSection {
    title: string;
    items: NavItem[];
}

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface UserMenuProps {
    user: {
        name: string;
        email: string;
        avatar?: string;
        role: 'admin' | 'seller';
    };
}

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
}
