import type { ComponentType, ReactNode } from "react";
import { Instagram, Ticket, Youtube } from "lucide-react";

import codeGif from "@/assets/images/events/eventPage_Animation/code.gif";
import neuralGif from "@/assets/images/events/eventPage_Animation/neural.gif";
import IeeeTechUncut from "@/assets/images/events/event_poster/IEEE_tech_uncut.jpeg";

export type EventCTA = {
  label: string;
  href: string;
  variant: "primary" | "secondary";
  icon: ComponentType<{ className?: string }>;
};

export type EventSpeaker = {
  name: string;
  headline: string;
  bio: string;
  links: {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
  }[];
};

export type EventScheduleItem = {
  time: string;
  title: string;
  description?: string;
};

export type EventContact = {
  role: string;
  name: string;
  phone: string;
};

export type Event = {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  badge?: string;
  date: string;
  time?: string;
  venue?: string;
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  image?: string;
  posterOrientation?: "portrait" | "landscape";
  shortDescription: string;
  description: ReactNode;
  highlights?: string[];
  schedule?: EventScheduleItem[];
  contacts?: EventContact[];
  speaker?: EventSpeaker;
  ctas?: EventCTA[];
};

const LOVE_BABBAR: EventSpeaker = {
  name: "Love Babbar",
  headline: "Software Engineer • YouTuber • Co-founder, CodeHelp",
  bio: "Love Babbar is a software engineer and YouTuber known for coding and software engineering education. He has worked at Amazon and Microsoft and has built a large student community through practical content around programming, placement preparation, interview experiences, and career growth.",
  links: [
    {
      label: "@LoveBabbar",
      href: "https://www.youtube.com/@LoveBabbar",
      icon: Youtube,
    },
    {
      label: "@lovebabbar1",
      href: "https://www.instagram.com/lovebabbar1/",
      icon: Instagram,
    },
  ],
};

export const UPCOMING_EVENTS = [
  {
    id: "ieee-day-2026",
    title: "IEEE DAY 2026",
    subtitle: "TECH PE CHARCHA with Love Babbar",
    category: "IEEE Day",
    badge: "Flagship Keynote",
    date: "21 October",
    time: "12:00 PM – 3:15 PM",
    venue: "VIT Pune Bibwewadi Campus (Auditorium - Sharad Arena)",
    mode: "OFFLINE",
    image: IeeeTechUncut.src,
    posterOrientation: "portrait",
    highlights: [
      "Podcast-style dialogue on engineering careers, tech shifts & startup building",
      "Actionable placement guidance, DSA preparation & industry perspective",
      "Live interactive audience Q&A with Love Babbar",
      "Network with passionate peers and IEEE Student Branch members",
    ],
    schedule: [
      {
        time: "12:00 PM – 12:30 PM",
        title: "Auditorium Entry & Crowd Settlement",
        description: "Sharad Arena entry opens for registered students.",
      },
      {
        time: "12:30 PM – 1:00 PM",
        title: "Formal Welcome & Lamp Lighting",
        description: "Dignitary welcome, introduction of Mr. Love Babbar & opening activity.",
      },
      {
        time: "1:00 PM – 2:30 PM",
        title: "Podcast: Tech Pe Charcha with Love Babbar",
        description: "Engaging fireside conversation on real-world tech and engineering careers.",
      },
      {
        time: "2:30 PM – 2:45 PM",
        title: "Live Audience Q&A",
        description: "Direct interaction between attendees and the speaker.",
      },
      {
        time: "2:45 PM – 3:15 PM",
        title: "Felicitation & Escort",
        description: "Token of appreciation and wrap-up.",
      },
    ],
    contacts: [
      {
        role: "Vice Chairperson",
        name: "Shalvi Maheshwari",
        phone: "+91 8669881079",
      },
      {
        role: "Curation Head",
        name: "Saumya Dhorje",
        phone: "+91 9529604447",
      },
    ],
    shortDescription:
      "TECH PE CHARCHA is an industry-focused IEEE DAY experience featuring a podcast-style conversation with Love Babbar, practical technology and career insights, and an interactive audience Q&A.",
    speaker: LOVE_BABBAR,
    description: (
      <div className="space-y-7">
        <section className="space-y-3">
          <h3>About IEEE DAY</h3>
          <p>
            IEEE DAY is being conducted by <strong>IEEE Student Branch VIT Pune</strong>{" "}
            to give students direct exposure to real industry experiences and
            evolving technology trends.
          </p>
          <p>
            The event is designed to bridge the gap between classroom learning
            and professional practice, offering practical guidance for career
            growth while encouraging innovation, critical thinking, and
            confidence to pursue ambitious projects.
          </p>
        </section>

        <section className="space-y-3">
          <h3>Theme — TECH PE CHARCHA</h3>
          <p>
            The event brings students into an open, practical conversation about
            technology, careers, and the changing tech landscape.
          </p>
        </section>

        <section className="space-y-3">
          <h3>About Love Babbar</h3>
          <p>
            Love Babbar is a software engineer and YouTuber known for his coding
            and software engineering content. He is the co-founder of CodeHelp
            and has built an extensive student-focused learning community.
          </p>
          <p>
            His work focuses on making programming, placement preparation,
            interview experiences, and career guidance more approachable for
            students and aspiring software engineers. He has also worked at
            Amazon and Microsoft.
          </p>
        </section>


        <section className="space-y-3">
          <h3>What to Expect</h3>
          <ul>
            <li>
              Podcast-style sessions led by accomplished industry
              professionals sharing real-world technology and career insights.
            </li>
            <li>
              Practical advice, expert perspectives, and trend analysis to help
              students understand the evolving technology landscape.
            </li>
            <li>
              Interactive Q&A segments where participants can engage directly
              with speakers and get personalized guidance.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3>Event Flow</h3>
          <ul>
            <li>
              <strong>12:00 PM – 12:30 PM:</strong> Auditorium filling, crowd
              settlement, and preparation for the event.
            </li>
            <li>
              <strong>12:30 PM – 1:00 PM:</strong> Formal welcome, lamp lighting
              ceremony, introduction of Mr. Love Babbar, followed by an
              interactive opening activity.
            </li>
            <li>
              <strong>1:00 PM – 2:30 PM:</strong> Podcast with Mr. Babbar.
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
        </section>

        <section className="space-y-3">
          <h3>Why Attend?</h3>
          <ul>
            <li>
              Gain valuable knowledge on emerging technologies and career
              guidance.
            </li>
            <li>
              Connect with a role model and gain mentorship and inspiration.
            </li>
            <li>
              Network with peers who share similar interests and build a
              collaborative learning community.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3>Contact</h3>
          <p>
            Vice Chairperson – Shalvi Maheshwari
            <br />
            +91 8669881079
          </p>
          <p>
            Curation Head – Saumya Dhorje
            <br />
            +91 9529604447
          </p>
        </section>
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
    badge: "Archived Session",
    date: "13th March",
    time: "1:00 PM",
    venue: "VIT Pune",
    mode: "OFFLINE",
    image: neuralGif.src,
    posterOrientation: "landscape",
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
    badge: "Competitive Hackathon",
    date: "13th March",
    time: "Offline",
    venue: "VIT Pune",
    mode: "OFFLINE",
    image: codeGif.src,
    posterOrientation: "landscape",
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
