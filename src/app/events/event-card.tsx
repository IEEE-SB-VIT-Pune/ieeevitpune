"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Event } from "./events";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const [active, setActive] = useState<Event | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  useOutsideClick(ref, () => {
    if (active) {
      setActive(null);
    }
  });

  const layoutKey = `${event.id}-${id}`;
  const imageAvailable = Boolean(event.image);

  return (
    <>
      <motion.article
        layoutId={`event-card-${layoutKey}`}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${event.title}`}
        onClick={() => setActive(event)}
        onKeyDown={(keyboardEvent) => {
          if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
            keyboardEvent.preventDefault();
            setActive(event);
          }
        }}
        className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-card/75 text-left shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_50px_rgba(0,217,255,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <motion.div
          layoutId={`event-image-${layoutKey}`}
          className="relative aspect-[3/2] w-full overflow-hidden bg-muted/40"
        >
          {imageAvailable ? (
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm font-medium text-muted-foreground">
              Event image coming soon
            </div>
          )}
        </motion.div>

        <div className="space-y-3 p-5 sm:p-6">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            {event.category}
          </span>

          <motion.h3
            layoutId={`event-title-${layoutKey}`}
            className="text-xl font-bold leading-tight text-foreground sm:text-2xl"
          >
            {event.title}
          </motion.h3>

          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {event.shortDescription}
          </p>
        </div>
      </motion.article>

      <AnimatePresence>
        {active ? (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
              aria-hidden="true"
            />

            <div
              className="fixed inset-0 z-[100] grid place-items-center p-2 sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-label={`${event.title} details`}
            >
              <motion.div
                layoutId={`event-card-${layoutKey}`}
                ref={ref}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:rounded-3xl"
              >
                <button
                  type="button"
                  aria-label="Close event details"
                  onClick={() => setActive(null)}
                  className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-4 sm:top-4"
                >
                  <X className="h-4 w-4" />
                </button>

                <motion.div
                  layoutId={`event-image-${layoutKey}`}
                  className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-muted/40"
                >
                  {imageAvailable ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : null}
                </motion.div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="shrink-0 space-y-4 border-b border-border/70 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex flex-wrap items-center gap-2 pr-10">
                      <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        {event.category}
                      </span>

                      <span className="rounded-full bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {event.mode}
                      </span>
                    </div>

                    <motion.h2
                      layoutId={`event-title-${layoutKey}`}
                      className="max-w-3xl text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-4xl"
                    >
                      {event.title}
                    </motion.h2>

                    <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                          Date
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                          {event.date}
                        </p>
                      </div>

                      {event.time ? (
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                            Time
                          </p>
                          <p className="mt-1 font-semibold text-foreground">
                            {event.time}
                          </p>
                        </div>
                      ) : null}

                      {event.venue ? (
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 sm:col-span-2 lg:col-span-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                            Venue
                          </p>
                          <p className="mt-1 font-semibold text-foreground">
                            {event.venue}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                    <div className="text-sm leading-7 text-muted-foreground sm:text-[15px] [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:leading-7 [&_p+p]:mt-4 [&_strong]:font-bold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                      {event.description}
                    </div>
                  </div>

                  {event.ctas?.length ? (
                    <div className="flex shrink-0 flex-wrap gap-3 border-t border-border/70 bg-card/95 px-5 py-4 backdrop-blur sm:px-7">
                      {event.ctas.map((cta) => {
                        const Icon = cta.icon;

                        return (
                          <a
                            key={`${event.id}-${cta.label}`}
                            href={cta.href}
                            target={cta.href.startsWith("http") ? "_blank" : undefined}
                            rel={cta.href.startsWith("http") ? "noreferrer" : undefined}
                            onClick={(clickEvent) => clickEvent.stopPropagation()}
                            className={cn(
                              buttonVariants({
                                variant:
                                  cta.variant === "secondary"
                                    ? "outline"
                                    : "default",
                                size: "lg",
                              }),
                              "min-w-[150px] flex-1 sm:flex-none"
                            )}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {cta.label}
                          </a>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
