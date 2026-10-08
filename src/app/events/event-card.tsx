"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "@/components/ui/button";
import type { Event } from "./events";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const [active, setActive] = useState<Event | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        setActive(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => {
    if (active) {
      setActive(null);
    }
  });

  const hasImage = Boolean(event.image);
  const layoutKey = `${event.id}-${id}`;

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
        className="group w-full cursor-pointer overflow-hidden rounded-2xl border border-border/70 bg-card/70 text-left shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <motion.div
          layoutId={`event-image-${layoutKey}`}
          className="relative aspect-[3/2] w-full overflow-hidden bg-muted/40"
        >
          {hasImage ? (
            <Image
              src={event.image!}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm font-medium text-muted-foreground">
              No event image
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
            />

            <div className="fixed inset-0 z-[100] grid place-items-center p-2 sm:p-4">
              <motion.div
                layoutId={`event-card-${layoutKey}`}
                ref={ref}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:rounded-3xl"
              >
                <div className="absolute right-3 top-3 z-20">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Close event details"
                    onClick={() => setActive(null)}
                    className="rounded-full border-border/80 bg-background/80 backdrop-blur hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <motion.div
                  layoutId={`event-image-${layoutKey}`}
                  className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-muted/40 sm:max-h-[44vh]"
                >
                  {hasImage ? (
                    <Image
                      src={event.image!}
                      alt={event.title}
                      fill
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                  ) : null}
                </motion.div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="space-y-4 border-b border-border/70 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                        {event.category}
                      </span>

                      <span className="rounded-full bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {event.mode}
                      </span>
                    </div>

                    <motion.h2
                      layoutId={`event-title-${layoutKey}`}
                      className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl"
                    >
                      {event.title}
                    </motion.h2>

                    <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                          Date
                        </p>
                        <p className="mt-1 font-semibold text-foreground">
                          {event.date}
                        </p>
                      </div>

                      {event.time ? (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                            Time
                          </p>
                          <p className="mt-1 font-semibold text-foreground">
                            {event.time}
                          </p>
                        </div>
                      ) : null}

                      {event.venue ? (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
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
                    <div className="prose prose-invert max-w-none text-sm leading-7 text-muted-foreground sm:text-[15px]">
                      {event.description}
                    </div>
                  </div>

                  {event.ctas?.length ? (
                    <div className="flex shrink-0 flex-wrap gap-3 border-t border-border/70 bg-card/95 px-5 py-4 backdrop-blur sm:px-7">
                      {event.ctas.map((cta) => {
                        const Icon = cta.icon;

                        return (
                          <Button
                            key={`${event.id}-${cta.label}`}
                            asChild
                            variant={cta.variant === "secondary" ? "outline" : "default"}
                            className="min-w-[150px] flex-1 sm:flex-none"
                          >
                            <a
                              href={cta.href}
                              target={cta.href.startsWith("http") ? "_blank" : undefined}
                              rel={cta.href.startsWith("http") ? "noreferrer" : undefined}
                              onClick={(clickEvent) => clickEvent.stopPropagation()}
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              {cta.label}
                            </a>
                          </Button>
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
