import {
    LayoutDashboard,
    BarChart3,
    Store,
    Users,
    FolderTree,
    Package,
    Boxes,
    Star,
    ShoppingCart,
    RotateCcw,
    Truck,
    CreditCard,
    Percent,
    FileText,
    Settings,
    UserCog,
    Shield,
    Plus,
    TrendingUp,
    Tag,
    Ticket,
    User,
    DollarSign,
    AlertCircle,
    LucideIcon
} from 'lucide-react';


export const Icons: Record<string, LucideIcon> = {
    LayoutDashboard,
    BarChart3,
    Store,
    Users,
    FolderTree,
    Package,
    Boxes,
    Star,
    ShoppingCart,
    RotateCcw,
    Truck,
    CreditCard,
    Percent,
    FileText,
    Settings,
    UserCog,
    Shield,
    Plus,
    TrendingUp,
    Tag,
    Ticket,

    User,
    DollarSign,
    AlertCircle
};

interface IconProps {
    name: string;
    className?: string;
}

export default function Icon({ name, className }: IconProps) {
    const IconComponent = Icons[name];

    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className} />;
}
