import type { ComponentType, ReactNode } from "react";
import { Ticket } from "lucide-react";

import codeGif from "@/assets/images/events/eventPage_Animation/code.gif";
import neuralGif from "@/assets/images/events/eventPage_Animation/neural.gif";
import aiAgentsWorkshop from "@/assets/images/gallery/AI_Agents_workshop.jpeg";

export type EventCTA = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  icon: ComponentType<{ className?: string }>;
};

export type Event = {
  id: string;
  title: string;
  category: string;
  date: string;
  time?: string;
  venue?: string;
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  image?: string;
  shortDescription: string;
  description: ReactNode;
  ctas?: EventCTA[];
};

export const UPCOMING_EVENTS = [
  {
    id: "future-of-ai",
    title: "The Future of AI: From Ideas to Impact",
    category: "Speaker Session",
    date: "20 October 2026",
    time: "5:00 PM",
    venue: "Seminar Hall, E Building, VIT Pune",
    mode: "OFFLINE",
    image: aiAgentsWorkshop.src,
    shortDescription:
      "An engaging speaker session on how artificial intelligence is shaping the future of technology and innovation.",
    description: (
      <div className="space-y-5">
        <p>
          Join IEEE Student Branch VIT Pune for an insightful speaker session
          exploring how artificial intelligence is moving from research and
          experimentation into real-world products, careers, and everyday life.
        </p>

        <div>
          <p className="mb-2 font-semibold text-foreground">What you can expect</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Practical perspectives on the evolving AI landscape.</li>
            <li>Real-world examples of AI-driven innovation.</li>
            <li>Career and learning pathways for students interested in AI.</li>
          </ul>
        </div>

        <p>
          The session is designed to be interactive, practical, and useful for
          students at every stage of their technical journey.
        </p>

        <div>
          <p className="mb-2 font-semibold text-foreground">About the Speaker</p>
          <p>
            A technology professional and AI practitioner will share practical
            lessons from building and working with modern AI systems.
          </p>
        </div>
      </div>
    ),
    ctas: [
      {
        label: "Book Tickets",
        href: "https://example.com/book-tickets",
        variant: "primary",
        icon: Ticket,
      },
    ],
  },
] satisfies readonly Event[];

export const PREVIOUS_EVENTS = [
  {
    id: "gate-smashers",
    title: "Gate Smashers — Varun Singla",
    category: "Tech Talk",
    date: "13th March",
    time: "1:00 PM",
    venue: "VIT Pune",
    mode: "OFFLINE",
    image: neuralGif.src,
    shortDescription:
      "An interactive tech talk covering core CS subjects, AI integration, and practical career skills.",
    description: (
      <div className="space-y-5">
        <p>
          An interactive technical session with Varun Singla, founder of Gate
          Smashers, covering core computer science concepts, AI integration,
          and skills that help students prepare for real-world careers.
        </p>
        <p>
          The session combined practical advice with technical discussions,
          giving students a broader perspective on learning, projects, and
          career preparation.
        </p>
      </div>
    ),
  },
  {
    id: "codezest-26",
    title: "CodeZest'26",
    category: "Hackathon",
    date: "13th March",
    time: "Offline",
    venue: "VIT Pune",
    mode: "OFFLINE",
    image: codeGif.src,
    shortDescription:
      "A high-octane competitive coding hackathon challenging logic, speed, and problem-solving across multiple divisions.",
    description: (
      <div className="space-y-5">
        <p>
          CodeZest&apos;26 was a competitive coding hackathon focused on
          problem-solving, algorithmic thinking, and speed.
        </p>
        <p>
          Participants competed across multiple challenges in an offline
          environment at VIT Pune, putting their coding fundamentals and
          competitive programming skills to the test.
        </p>
      </div>
    ),
  },
] satisfies readonly Event[];
