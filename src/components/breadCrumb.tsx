// components/Breadcrumb.tsx
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && (
                        <ChevronRight className="mx-1 text-gray-400" size={16} />
                    )}
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-[#979207] transition-colors whitespace-nowrap"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-700 font-medium whitespace-nowrap">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
