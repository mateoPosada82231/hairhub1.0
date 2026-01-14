"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] text-white shadow-lg shadow-[var(--primary-500)]/25 hover:shadow-xl hover:shadow-[var(--primary-500)]/30 hover:from-[var(--primary-600)] hover:to-[var(--primary-700)]",
                secondary:
                    "bg-[var(--gray-100)] text-[var(--gray-900)] hover:bg-[var(--gray-200)] dark:bg-[var(--gray-800)] dark:text-[var(--gray-100)] dark:hover:bg-[var(--gray-700)]",
                outline:
                    "border-2 border-[var(--border)] bg-transparent hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)]",
                ghost:
                    "bg-transparent hover:bg-[var(--gray-100)] dark:hover:bg-[var(--gray-800)]",
                accent:
                    "bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] text-white shadow-lg shadow-[var(--accent-500)]/25 hover:shadow-xl hover:shadow-[var(--accent-500)]/30",
                destructive:
                    "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30",
            },
            size: {
                sm: "h-9 px-4 text-sm",
                default: "h-11 px-6 text-base",
                lg: "h-13 px-8 text-lg",
                xl: "h-14 px-10 text-xl",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
