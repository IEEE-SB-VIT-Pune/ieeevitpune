"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Ticket,
  X,
  Maximize2,
  Phone,
  ArrowRight,
  Info,
} from "lucide-react";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Event } from "./events";

// ---------------------------------------------------------------------------
// Real Fullscreen Poster Lightbox (Expands to fill viewport height & width)
// ---------------------------------------------------------------------------
export function PosterLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Floating Controls */}
          <div className="fixed right-3 top-3 z-30 flex items-center gap-2 sm:right-6 sm:top-6">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open original</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-black hover:text-primary sm:h-10 sm:w-10"
              aria-label="Close fullscreen view"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Fullscreen Poster: Fills 92% of screen height and up to 94% width */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 h-[90vh] sm:h-[92vh] w-[94vw] max-w-4xl"
          >
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="100vw"
              className="object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Simplistic, Clean Featured Event Showcase (Spotlight)
// ---------------------------------------------------------------------------
export function FeaturedEventShowcase({ event }: { event: Event }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <article className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-primary/40 sm:rounded-3xl sm:p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8 lg:gap-10">
          {/* Vertical Poster Section */}
          <div className="w-full shrink-0 md:w-[280px] lg:w-[320px]">
            <div className="relative mx-auto max-w-[240px] sm:max-w-[260px] md:max-w-none">
              {/* Subtle ambient backlight */}
              {event.image ? (
                <div className="absolute -inset-2 -z-10 overflow-hidden rounded-2xl opacity-35 blur-xl">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    aria-hidden="true"
                    className="scale-110 object-cover"
                  />
                </div>
              ) : null}

              {/* Poster frame with click-to-fullscreen */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setLightboxOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxOpen(true);
                  }
                }}
                className="group/poster relative aspect-[921/1536] w-full cursor-zoom-in overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Click to view full poster in fullscreen"
              >
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 260px, 320px"
                    className="object-contain transition-transform duration-500 group-hover/poster:scale-[1.02]"
                  />
                ) : null}

                {/* Minimalist Hover Hint */}
                <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-black/80 px-2.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md opacity-90 transition-opacity group-hover/poster:opacity-100 sm:opacity-0 sm:group-hover/poster:opacity-100">
                  <Maximize2 className="h-3 w-3 text-primary" />
                  <span>Click for fullscreen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean, Simplistic Details Section */}
          <div className="flex flex-1 flex-col justify-center space-y-4">
            {/* Clean Category & Mode Line */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <span>{event.category}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-muted-foreground">{event.mode}</span>
            </div>

            {/* Main Title & Subtitle */}
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {event.title}
              </h3>
              {event.subtitle ? (
                <p className="mt-1 text-sm font-semibold text-primary/90 sm:text-base">
                  {event.subtitle}
                </p>
              ) : null}
            </div>

            {/* Short 1-2 sentence description */}
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {event.shortDescription}
            </p>

            {/* Clean Metadata Line (Date, Time, Venue) */}
            <div className="flex flex-wrap gap-y-2 gap-x-5 border-y border-border/50 py-3.5 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                {event.date}
              </span>

              {event.time ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {event.time}
                </span>
              ) : null}

              {event.venue ? (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {event.venue}
                </span>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:items-center sm:gap-3">
              {event.ctas?.map((cta) => {
                const Icon = cta.icon;
                return (
                  <a
                    key={cta.label}
                    href={cta.href}
                    target={cta.href.startsWith("http") ? "_blank" : undefined}
                    rel={cta.href.startsWith("http") ? "noreferrer" : undefined}
                    className={cn(
                      buttonVariants({
                        variant: cta.variant === "secondary" ? "outline" : "default",
                        size: "default",
                      }),
                      "w-full sm:w-auto font-bold gap-2 shadow-[0_0_15px_rgba(0,217,255,0.3)] transition-all hover:shadow-[0_0_25px_rgba(0,217,255,0.45)]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {cta.label}
                  </a>
                );
              })}

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "default",
                  }),
                  "w-full sm:w-auto gap-1.5 border-border/80 bg-card/60 hover:border-primary hover:text-primary"
                )}
              >
                <Info className="h-4 w-4" />
                Full Schedule & Details
              </button>

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                View Fullscreen
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Details Dialog */}
      <EventDetailDialog
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onOpenPoster={() => {
          setModalOpen(false);
          setLightboxOpen(true);
        }}
      />

      {/* Fullscreen Poster Lightbox */}
      {event.image ? (
        <PosterLightbox
          src={event.image}
          alt={event.title}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Standard Event Card (Archive / Previous Events)
// ---------------------------------------------------------------------------
export function EventCard({ event }: { event: Event }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isPortrait = event.posterOrientation === "portrait";

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/60 text-left shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(0,217,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {/* Media Box */}
        <div
          className={cn(
            "relative w-full overflow-hidden bg-muted/40",
            isPortrait ? "aspect-[4/5] bg-black/80" : "aspect-[16/9]"
          )}
        >
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={cn(
                "transition-transform duration-500 group-hover:scale-[1.02]",
                isPortrait ? "object-contain p-2" : "object-cover object-center"
              )}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm font-medium text-muted-foreground">
              Event image coming soon
            </div>
          )}

          {/* Clean Subtle Top Mode Badge (Optional, only if mode) */}
        </div>

        {/* Content Box */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {event.date}
            </span>
            {event.time ? (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {event.time}
              </span>
            ) : null}
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-xl">
            {event.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {event.shortDescription}
          </p>

          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50 text-xs font-semibold text-primary">
            <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View Recap & Details <ArrowRight className="h-3.5 w-3.5" />
            </span>
            {isPortrait ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Maximize2 className="h-3 w-3" />
                Poster
              </button>
            ) : null}
          </div>
        </div>
      </article>

      {/* Details Dialog */}
      <EventDetailDialog
        event={event}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onOpenPoster={() => {
          setModalOpen(false);
          setLightboxOpen(true);
        }}
      />

      {/* Poster Lightbox */}
      {event.image ? (
        <PosterLightbox
          src={event.image}
          alt={event.title}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Unified Event Details Dialog (Mobile Responsive & Premium Sidebar)
// ---------------------------------------------------------------------------
function EventDetailDialog({
  event,
  isOpen,
  onClose,
  onOpenPoster,
}: {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onOpenPoster: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isPortrait = event.posterOrientation === "portrait";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useOutsideClick(dialogRef, () => {
    if (isOpen) onClose();
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div
            className="fixed inset-0 z-[120] grid place-items-center p-2 sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`${event.title} details`}
          >
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "relative max-h-[92vh] w-full overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl sm:rounded-3xl",
                isPortrait ? "max-w-5xl lg:max-w-6xl" : "max-w-3xl"
              )}
            >
              {/* Close Button */}
              <button
                type="button"
                aria-label="Close event details"
                onClick={onClose}
                className="absolute right-3 top-3 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-md backdrop-blur-md transition-colors hover:border-primary hover:text-primary sm:right-5 sm:top-5"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Scrollable Container */}
              <div
                className={cn(
                  "max-h-[92vh] overflow-y-auto overscroll-contain",
                  isPortrait ? "md:grid md:grid-cols-12" : ""
                )}
              >
                {/* ---------------- LEFT: BIGGER POSTER COLUMN ---------------- */}
                {isPortrait ? (
                  <div className="relative border-b border-border/70 bg-black/50 p-5 md:col-span-5 lg:col-span-5 md:border-b-0 md:border-r md:p-7 flex flex-col items-center justify-start">
                    <div className="sticky top-6 flex w-full flex-col items-center">
                      {/* Ambient Glow Backdrop */}
                      {event.image ? (
                        <div className="absolute -inset-2 -z-10 overflow-hidden rounded-3xl opacity-35 blur-2xl">
                          <Image
                            src={event.image}
                            alt=""
                            fill
                            aria-hidden="true"
                            className="scale-110 object-cover"
                          />
                        </div>
                      ) : null}

                      {/* Poster Container: Larger max-width for clear visibility */}
                      <div className="relative mx-auto aspect-[921/1536] w-full max-w-[340px] lg:max-w-[380px] overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_12px_45px_rgba(0,0,0,0.8)]">
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 90vw, 400px"
                            className="object-contain"
                          />
                        ) : null}
                      </div>

                      {event.image ? (
                        <button
                          type="button"
                          onClick={onOpenPoster}
                          className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary shadow-[0_0_15px_rgba(0,217,255,0.15)] transition-all hover:bg-primary hover:text-black"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                          View Fullscreen Poster
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="relative aspect-[16/9] w-full max-h-[320px] overflow-hidden bg-muted/40">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="100vw"
                        className="object-cover object-center"
                      />
                    ) : null}
                  </div>
                )}

                {/* ---------------- RIGHT: BEAUTIFULLY STYLED SIDEBAR ---------------- */}
                <div
                  className={cn(
                    "flex flex-col p-6 sm:p-8 md:p-9 space-y-6",
                    isPortrait ? "md:col-span-7 lg:col-span-7" : ""
                  )}
                >
                  {/* Category & Status Badges */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                      <span>{event.category}</span>
                      <span className="text-muted-foreground/60">•</span>
                      <span className="text-emerald-400">{event.mode}</span>
                    </div>

                    <h2 className="mt-1.5 text-2xl font-black uppercase tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                      {event.title}
                    </h2>
                    {event.subtitle ? (
                      <p className="mt-1 text-sm font-semibold text-primary/90 sm:text-base">
                        {event.subtitle}
                      </p>
                    ) : null}
                  </div>

                  {/* Clean Metadata Info Cards */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card/60 p-3 backdrop-blur-sm">
                      <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Date
                        </p>
                        <p className="text-xs font-semibold text-foreground sm:text-sm">
                          {event.date}
                        </p>
                      </div>
                    </div>

                    {event.time ? (
                      <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card/60 p-3 backdrop-blur-sm">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Time
                          </p>
                          <p className="text-xs font-semibold text-foreground sm:text-sm">
                            {event.time}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {event.venue ? (
                      <div className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card/60 p-3 backdrop-blur-sm sm:col-span-3 lg:col-span-1">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Venue
                          </p>
                          <p className="text-xs font-semibold leading-snug text-foreground">
                            {event.venue}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Featured Speaker Card */}
                  {event.speaker ? (
                    <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/80 to-card/60 p-5 shadow-sm backdrop-blur-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          Featured Keynote Speaker
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-foreground">
                          {event.speaker.name}
                        </h4>
                        <p className="text-xs font-semibold text-primary">
                          {event.speaker.headline}
                        </p>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {event.speaker.bio}
                      </p>

                      {event.speaker.links?.length ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {event.speaker.links.map((link) => {
                            const Icon = link.icon;
                            return (
                              <a
                                key={link.href}
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
                              >
                                <Icon className="h-3.5 w-3.5" />
                                {link.label}
                              </a>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Event Schedule Timeline */}
                  {event.schedule?.length ? (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-primary">
                        Event Flow &amp; Timeline
                      </h4>

                      <div className="relative ml-2 space-y-4 border-l-2 border-primary/30 pl-5">
                        {event.schedule.map((item, idx) => (
                          <div key={idx} className="group relative">
                            {/* Glowing Timeline Dot */}
                            <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background shadow-[0_0_10px_rgba(0,217,255,0.6)] transition-colors group-hover:bg-primary" />

                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                              <span className="shrink-0 font-mono text-xs font-bold text-primary">
                                {item.time}
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                {item.title}
                              </span>
                            </div>

                            {item.description ? (
                              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Description Section */}
                  <div className="border-t border-border/60 pt-5 text-sm leading-relaxed text-muted-foreground [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-foreground [&_li]:leading-relaxed [&_p+p]:mt-3 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4">
                    {event.description}
                  </div>

                  {/* Student Coordinators */}
                  {event.contacts?.length ? (
                    <div className="border-t border-border/60 pt-5 space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
                        Student Coordinators
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {event.contacts.map((contact, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl border border-border/70 bg-card/60 p-3"
                          >
                            <div>
                              <p className="text-xs font-bold text-foreground">
                                {contact.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {contact.role}
                              </p>
                            </div>
                            <a
                              href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-black"
                            >
                              <Phone className="h-3 w-3" />
                              Call
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Bottom Register CTA */}
                  {event.ctas?.length ? (
                    <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 border-t border-border/70 bg-card/95 p-4 backdrop-blur-md sm:-mx-8 sm:-mb-8 md:-mx-9 md:-mb-9">
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        {event.ctas.map((cta) => {
                          const Icon = cta.icon;
                          return (
                            <a
                              key={cta.label}
                              href={cta.href}
                              target={
                                cta.href.startsWith("http") ? "_blank" : undefined
                              }
                              rel={
                                cta.href.startsWith("http")
                                  ? "noreferrer"
                                  : undefined
                              }
                              className={cn(
                                buttonVariants({
                                  variant:
                                    cta.variant === "secondary"
                                      ? "outline"
                                      : "default",
                                  size: "lg",
                                }),
                                "w-full sm:w-auto font-bold shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:shadow-[0_0_30px_rgba(0,217,255,0.45)]"
                              )}
                            >
                              <Icon className="mr-2 h-4 w-4" />
                              {cta.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
