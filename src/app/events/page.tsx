"use client";

import { motion } from "motion/react";

import { EventCard } from "./event-card";
import { EVENTS } from "./events";

const upcomingEvents = EVENTS.slice(0, 1);
const previousEvents = EVENTS.slice(1);

export default function EventsPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden px-4 py-20 sm:py-24">
        <div className="container relative z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              IEEE Student Branch VIT Pune
            </p>

            <h1 className="text-4xl font-black sm:text-5xl md:text-6xl">
              Event <span className="text-primary glow-text">Highlights</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover upcoming sessions and revisit the events that brought
              the IEEE community together.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-card/10 px-4 py-14 sm:py-16">
        <div className="container mx-auto">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              What&apos;s next
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl">
              Upcoming <span className="text-primary">Events</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Open an event to view the full details and available actions.
            </p>
          </div>

          <div className="mx-auto w-full max-w-4xl">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              From the archive
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl">
              Previous <span className="text-primary">Events</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Explore highlights from recent IEEE Student Branch activities.
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
            {previousEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
