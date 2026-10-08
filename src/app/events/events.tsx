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
    id: "lover-babar-speaker-session",
    title: "An Evening of Insights with Lover Babar",
    category: "Speaker Session",
    date: "21 October 2026",
    time: "10:00 AM",
    venue: "VIT BIB Auditorium",
    mode: "OFFLINE",
    image: aiAgentsWorkshop.src,
    shortDescription:
      "Join IEEE Student Branch VIT Pune for an engaging speaker session with Lover Babar, featuring insights, experiences, and perspectives for today’s students.",
    description: (
      <div className="space-y-6">
        <div className="space-y-3">
          <p>
            IEEE Student Branch VIT Pune is excited to invite{" "}
            <strong>Lover Babar</strong> for an engaging speaker session
            designed especially for students.
          </p>
          <p>
            The session is an opportunity to hear directly from our guest
            speaker, explore fresh perspectives, ask questions, and take away
            ideas that can be applied to academic, personal, and professional
            growth.
          </p>
        </div>

        <div>
          <h3>What to Expect</h3>
          <ul>
            <li>
              <strong>Insights & Perspectives:</strong> Hear practical ideas,
              experiences, and perspectives from our guest speaker.
            </li>
            <li>
              <strong>Interactive Session:</strong> Take part in a
              student-focused discussion and engage with the speaker.
            </li>
            <li>
              <strong>Connect & Learn:</strong> Meet fellow students, exchange
              ideas, and make the most of the IEEE community experience.
            </li>
          </ul>
        </div>

        <div>
          <h3>Goodies & Refreshments</h3>
          <p>
            Every registered participant will receive{" "}
            <strong>exclusive goodies and refreshments</strong> as part of the
            event experience.
          </p>
        </div>

        <div>
          <h3>Event Details</h3>
          <p>
            <strong>Entry Fee:</strong> ₹200
          </p>
        </div>

        <div>
          <h3>Who Can Attend?</h3>
          <p>
            The session is open to students interested in learning, connecting,
            and experiencing an engaging speaker interaction hosted by IEEE
            Student Branch VIT Pune.
          </p>
        </div>

        <div>
          <h3>Reserve Your Spot</h3>
          <p>
            Seats are limited. Book your ticket and join us at the VIT BIB
            Auditorium for an insightful session with Lover Babar.
          </p>
        </div>
      </div>
    ),
    ctas: [
      {
        label: "Book Tickets",
        href: "https://vierp.in/",
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
