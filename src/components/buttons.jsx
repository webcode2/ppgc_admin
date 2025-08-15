// components/buttons/SolidButton.jsx
import { twMerge } from "tailwind-merge";

export function SolidButton({ children, className, ...props }) {
    return (
        <button
            className={twMerge(
                "px-4 py-2 rounded-lg font-semibold transition-all bg-[#938E07] text-white hover:bg-[#7c7606]",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function OutlineButton({ children, className, ...props }) {
    return (
        <button
            className={twMerge(
                "px-4 py-2 rounded-lg font-semibold transition-all border-2 border-[#938E07] text-[#938E07] hover:bg-[#938E07] hover:text-white",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}


export function GhostButton({ children, className, ...props }) {
    return (
        <button
            className={twMerge(
                "px-4 py-2 rounded-lg font-semibold transition-all bg-transparent text-[#938E07] hover:bg-[#938E07]/10",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
