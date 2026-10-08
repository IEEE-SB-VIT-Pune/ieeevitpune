"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useMouse } from "@/hooks/use-mouse";
import { cn } from "@/lib/utils";

export const GradientCard = ({
  title,
  description,
  icon,
  points,
  withArrow = false,
  circleSize = 400,
  className,
  children,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  points?: string[];
  withArrow?: boolean;
  circleSize?: number;
  children?: ReactNode;
  className?: string;
}) => {
  const [mouse, parentRef] = useMouse();

  return (
    <div
      className="group relative transform-gpu overflow-hidden rounded-[20px] bg-white/10 p-2 transition-transform hover:scale-[1.01] active:scale-90 border-4 border-stone-300"
      ref={parentRef}
      style={{ boxShadow: `0 0 12px rgba(200, 200, 200, 0.25), 4px 4px 0 rgba(0, 0, 0, 0.5)` }}
    >
      {withArrow && (
        <ArrowUpRightIcon className="absolute top-2 right-2 z-10 size-5 translate-y-4 text-neutral-700 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 dark:text-neutral-300" />
      )}
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 absolute transform-gpu rounded-full transition-transform duration-500 group-hover:scale-[3]",
          mouse.elementX === null || mouse.elementY === null
            ? "opacity-0"
            : "opacity-100"
        )}
        style={{
          maskImage: `radial-gradient(${circleSize / 2}px circle at center, white, transparent)`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          left: `${mouse.elementX}px`,
          top: `${mouse.elementY}px`,
          background:
            "linear-gradient(135deg, #3BC4F2, #7A69F9, #F26378, #F5833F)",
        }}
      />
      <div className="absolute inset-px rounded-[19px] bg-neutral-100/80 dark:bg-neutral-900/80" />
      {children && (
        <div
          className={cn(
            "grid relative h-40 place-content-center overflow-hidden rounded-[15px] border-white bg-white/70 dark:border-neutral-950 dark:bg-black/50",
            className
          )}
        >
          {children}
        </div>
      )}
      <div className="relative px-5 pt-5 pb-5">
  {icon && (() => {
  const Icon = icon;

  return (
    <Icon
      className="mb-4 h-10 w-10 text-primary"
      strokeWidth={1.8}
    />
  );
})()}

  <h3 className="font-semibold text-xl text-neutral-800 dark:text-neutral-300">
    {title}
  </h3>

  {description && (
    <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      {description}
    </p>
  )}

  {points && (
    <div className="mt-4 flex flex-wrap gap-2">
      {points.map((point) => (
        <span
          key={point}
          className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-600 dark:border-neutral-700 dark:text-neutral-400"
        >
          {point}
        </span>
      ))}
    </div>
  )}
</div>
    </div>
  );
};

export default GradientCard;
