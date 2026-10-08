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
    id: "ieee-day-2026",
    title: "IEEE Day — Tech Pe Charcha",
    category: "IEEE Day",
    date: "2026-10-21",
    time: "12:00 PM – 3:15 PM",
    venue:
      "Vishwakarma Institute of Technology, Bibwewadi Campus, Pune - 411037 (Auditorium - Sharad Arena)",
    mode: "OFFLINE",
    image: aiAgentsWorkshop.src,
    shortDescription:
      "IEEE Day 2026, themed TECH PE CHARCHA, brings students together with an industry professional for real-world technology and career insights through a podcast-style session and interactive Q&A.",
    description: (
      <div className="space-y-6">
        <div className="space-y-3">
          <p>
            <strong>IEEE Day 2026</strong> is being conducted by IEEE Student
            Branch VIT Pune to give students direct exposure to real industry
            experiences and evolving technology trends.
          </p>
          <p>
            The event aims to bridge classroom learning with professional
            practice, providing practical guidance for career growth while
            encouraging innovation, critical thinking, and confidence to pursue
            ambitious projects.
          </p>
        </div>

        <div>
          <h3>Theme</h3>
          <p>
            <strong>TECH PE CHARCHA</strong>
          </p>
        </div>

        <div>
          <h3>What to Expect</h3>
          <ul>
            <li>
              A dynamic podcast-style session with accomplished industry
              professionals sharing real-world technology and career insights.
            </li>
            <li>
              Practical advice, expert perspectives, and trend analysis to help
              students understand the evolving tech landscape.
            </li>
            <li>
              An interactive Q&A segment where participants can engage directly
              with the speaker and seek personalized guidance.
            </li>
          </ul>
        </div>

        <div>
          <h3>Guest</h3>
          <p>
            <strong>Mr. Love Babbar</strong>
          </p>
        </div>

        <div>
          <h3>Event Flow</h3>
          <ul>
            <li>
              <strong>12:00 PM – 12:30 PM:</strong> Auditorium filling, crowd
              settlement, and preparation for the event.
            </li>
            <li>
              <strong>12:30 PM – 1:00 PM:</strong> Formal welcome, lamp lighting
              ceremony, introduction of Mr. Love Babbar, and an interactive
              opening activity.
            </li>
            <li>
              <strong>1:00 PM – 2:30 PM:</strong> Podcast with Mr. Babbar,
              including a 1 hour 15 minute podcast segment.
            </li>
            <li>
              <strong>2:30 PM – 2:45 PM:</strong> Interactive Q&A session with
              the audience.
            </li>
            <li>
              <strong>2:45 PM – 3:15 PM:</strong> Token of appreciation and
              guest escort.
            </li>
          </ul>
        </div>

        <div>
          <h3>Expected Outcomes</h3>
          <ul>
            <li>
              Gain valuable knowledge on emerging technologies and career
              guidance.
            </li>
            <li>
              Connect with role models to gain mentorship and inspiration.
            </li>
            <li>
              Network with peers who share similar interests and contribute to
              a collaborative learning community.
            </li>
          </ul>
        </div>

        <div>
          <h3>Organized By</h3>
          <p>
            IEEE Student Branch VIT Pune
          </p>
        </div>
      </div>
    ),
    ctas: [
      {
        label: "Register on VIERP",
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
