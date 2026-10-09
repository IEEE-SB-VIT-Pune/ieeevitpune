"use client";

import { motion } from "motion/react";

import { EventCard, FeaturedEventShowcase } from "./event-card";
import { PREVIOUS_EVENTS, UPCOMING_EVENTS } from "./events";

export default function EventsPage() {
  return (
    <div className="relative">
      {/* Hero Header Section */}
      <section className="relative px-4 pb-12 pt-16 sm:pb-16 sm:pt-24">
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              IEEE Student Branch VIT Pune
            </p>

            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Events
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Discover upcoming sessions and explore past community milestones.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Spotlight Section */}
      <section className="relative border-y border-border/50 bg-card/10 px-4 py-12 sm:py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Upcoming <span className="text-primary">Events</span>
            </h2>
          </div>

          <div className="mx-auto w-full">
            {UPCOMING_EVENTS.map((event) => (
              <FeaturedEventShowcase key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Previous Events Archive Section */}
      <section className="relative px-4 py-12 sm:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Previous <span className="text-primary">Events</span>
            </h2>
          </div>

          <div className="mx-auto grid w-full gap-5 sm:grid-cols-2 lg:gap-6">
            {PREVIOUS_EVENTS.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
