"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
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
  const [active, setActive] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const layoutKey = `${event.id}-${id}`;

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        setActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);

  useOutsideClick(ref, () => {
    if (active) {
      setActive(false);
    }
  });

  return (
    <>
      <motion.article
        layoutId={`event-card-${layoutKey}`}
        role="button"
        tabIndex={0}
        aria-expanded={active}
        aria-label={`View details for ${event.title}`}
        onClick={() => setActive(true)}
        onKeyDown={(keyboardEvent) => {
          if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
            keyboardEvent.preventDefault();
            setActive(true);
          }
        }}
        className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/75 text-left shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_18px_50px_rgba(0,217,255,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <motion.div
          layoutId={`event-image-${layoutKey}`}
          className="relative aspect-[3/2] w-full overflow-hidden bg-muted/40"
        >
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm font-medium text-muted-foreground">
              Event image coming soon
            </div>
          )}
        </motion.div>

        <div className="flex flex-1 flex-col space-y-3 p-5 sm:p-6">
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

          {!active && event.ctas?.length ? (
            <div className="mt-auto flex flex-wrap justify-end gap-2 pt-4">
              {event.ctas.map((cta) => {
                const Icon = cta.icon;

                return (
                  <motion.a
                    key={`${event.id}-${cta.label}`}
                    layoutId={`event-cta-${layoutKey}-${cta.label}`}
                    href={cta.href}
                    target={cta.href.startsWith("http") ? "_blank" : undefined}
                    rel={cta.href.startsWith("http") ? "noreferrer" : undefined}
                    onClick={(clickEvent) => clickEvent.stopPropagation()}
                    onKeyDown={(keyboardEvent) => keyboardEvent.stopPropagation()}
                    className={cn(
                      buttonVariants({
                        variant:
                          cta.variant === "secondary" ? "outline" : "default",
                        size: "lg",
                      }),
                      "min-w-[150px] sm:min-w-[160px]"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {cta.label}
                  </motion.a>
                );
              })}
            </div>
          ) : null}
        </div>

        
      </motion.article>

      <AnimatePresence>
        {active ? (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActive(false)}
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
                className="relative max-h-[94vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:rounded-3xl"
              >
                <button
                  type="button"
                  aria-label="Close event details"
                  onClick={() => setActive(false)}
                  className="absolute right-3 top-3 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-background/90 text-primary shadow-[0_0_18px_rgba(0,217,255,0.18)] backdrop-blur-md transition-all sm:right-4 sm:top-4"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="relative max-h-[94vh] overflow-y-auto overscroll-contain [scrollbar-color:rgba(0,217,255,0.42)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar-thumb]:hover:bg-primary/60">
                  <motion.div
                    layoutId={`event-image-${layoutKey}`}
                    className="relative aspect-[3/2] w-full overflow-hidden bg-muted/40"
                  >
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm font-medium text-muted-foreground">
                        Event image coming soon
                      </div>
                    )}
                  </motion.div>

                  <div className="space-y-4 border-b border-border/70 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex flex-wrap items-center gap-2 pr-12">
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

                  {event.speaker ? (
                    <section className="border-b border-border/70 px-5 py-5 sm:px-7 sm:py-6">
                      <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                          Featured Speaker
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-foreground">
                          {event.speaker.name}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-primary">
                          {event.speaker.headline}
                        </p>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-[15px]">
                          {event.speaker.bio}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                          {event.speaker.links.map((link) => {
                            const Icon = link.icon;

                            return (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(clickEvent) =>
                                  clickEvent.stopPropagation()
                                }
                                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                              >
                                <Icon className="h-4 w-4" />
                                {link.label}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  ) : null}

                  <div className="px-5 py-5 pb-36 sm:px-7 sm:py-6 sm:pb-40">
                    <div className="text-sm leading-7 text-muted-foreground sm:text-[15px] [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_li]:leading-7 [&_p+p]:mt-4 [&_strong]:font-bold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                      {event.description}
                    </div>
                  </div>
                </div>

                {active && event.ctas?.length ? (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-end p-3 sm:p-5">
                    <div className="pointer-events-auto relative">
                      <div className="absolute -inset-x-8 -bottom-4 -top-8 bg-gradient-to-t from-card via-card/90 to-transparent blur-xl" />
                      <div className="relative flex max-w-full flex-wrap justify-end gap-2 rounded-2xl sm:rounded-full">
                        {event.ctas.map((cta) => {
                          const Icon = cta.icon;

                          return (
                            <motion.a
                              key={`${event.id}-${cta.label}`}
                              layoutId={`event-cta-${layoutKey}-${cta.label}`}
                              href={cta.href}
                              target={
                                cta.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                cta.href.startsWith("http")
                                  ? "noreferrer"
                                  : undefined
                              }
                              onClick={(clickEvent) =>
                                clickEvent.stopPropagation()
                              }
                              className={cn(
                                buttonVariants({
                                  variant:
                                    cta.variant === "secondary"
                                      ? "outline"
                                      : "default",
                                  size: "lg",
                                }),
                                "min-w-[150px] sm:min-w-[160px]",
                              )}
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              {cta.label}
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
