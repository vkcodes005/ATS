import { Component, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=85",
  who: "https://images.unsplash.com/photo-1527261834078-9b37d35a4a32?auto=format&fit=crop&w=1200&q=85",
  past1: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80",
  past2: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=700&q=80",
  past3: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
  past4: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=700&q=80",
  organizer1: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=85",
  organizer2: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=85",
  organizer3: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=700&q=85",
  organizer4: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=700&q=85"
};

const emptyParticipant = { code: "", name: "", profession: "Dancer", active: true, image: "" };
const emptySport = { name: "", category: "", active: true };
const emptyEvent = { title: "", date: "", venue: "", details: "", active: true };
const emptyBrochure = { id: "", title: "", active: true };
const fallbackImage = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=85";
const fallbackServices = [
  ["Talent Registration", "End-to-end participant onboarding for performers, creators, models, and stage artists.", "how_to_reg", "border-secondary-fixed-dim/30"],
  ["Live Event Production", "Professional stage planning, audience flow, lighting, sound, and backstage coordination.", "stadium", "border-tertiary/40"],
  ["Digital Voting", "Audience engagement, voting-led discovery, and measurable campaign momentum.", "how_to_vote", "border-primary/40"]
];

const impactStats = [
  ["10K+", "Total Participants", "groups"],
  ["18+", "Cities", "location_city"],
  ["25L+", "Prize Pool", "workspace_premium"],
  ["40+", "Events", "event_available"]
];

const testimonials = [
  ["ATS gave our performers a serious stage and a real audience.", "Riya Sharma", "Creative Director"],
  ["The event flow, voting experience, and media coverage felt premium.", "Arjun Malhotra", "Sponsor Partner"],
  ["A strong platform for discovering fresh talent across cities.", "Mehak Sinha", "Talent Mentor"]
];

const sponsors = ["MediaOne", "StagePro", "VoteX", "SoundGrid", "StyleHub", "CreatorLab"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function getAdminToken() {
  try {
    return window.localStorage.getItem("atsAdminToken");
  } catch {
    return "";
  }
}

function setAdminToken(token) {
  try {
    window.localStorage.setItem("atsAdminToken", token);
  } catch {
    window.__atsAdminToken = token;
  }
}

function clearAdminToken() {
  try {
    window.localStorage.removeItem("atsAdminToken");
  } catch {
    window.__atsAdminToken = "";
  }
}

async function api(path, options = {}) {
  const token = getAdminToken() || window.__atsAdminToken;
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function loginAdmin(credentials) {
  return api("/api/login", { method: "POST", body: JSON.stringify(credentials) });
}

function Icon({ children, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{children}</span>;
}

function Header({ onBrochure }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const links = [
    ["Home", "#home"],
    ["Artists", "#artists"],
    ["Sports", "#sports"],
    ["Events", "#events"],
    ["Team", "#team"]
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b0d13]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-container-max items-center justify-between px-margin-mobile md:h-16 md:px-margin-desktop">
        <a href="/" className="flex items-center gap-2 md:gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-secondary-fixed-dim/50 bg-white/5 font-display text-xs font-extrabold text-secondary-fixed-dim md:h-10 md:w-10 md:text-sm">ATS</span>
          <span className="font-display text-lg font-extrabold text-white md:text-xl">ATS 2026</span>
        </a>
        <div className="hidden items-center gap-2 lg:flex">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-white/5 hover:text-secondary-fixed-dim">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onBrochure} className="hidden items-center gap-2 rounded-lg bg-secondary-fixed-dim px-4 py-2 text-sm font-bold text-[#071013] shadow-[0_8px_24px_rgba(0,218,243,0.18)] transition hover:-translate-y-0.5 hover:bg-white sm:inline-flex">
            <Icon className="text-lg">download</Icon>
            <span>Brochure</span>
          </button>
          <button onClick={() => setDrawerOpen(true)} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-on-surface-variant transition hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim lg:hidden" aria-label="Open menu">
            <Icon>menu</Icon>
          </button>
        </div>
      </nav>
      {drawerOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button className="absolute inset-0 bg-black/70" onClick={() => setDrawerOpen(false)} aria-label="Close menu overlay" />
          <aside className="absolute right-0 top-0 flex h-screen w-[min(84vw,340px)] flex-col border-l border-white/10 bg-[#101016] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg border border-secondary-fixed-dim/50 bg-white/5 font-display text-sm font-extrabold text-secondary-fixed-dim">ATS</span>
                <span className="font-display text-xl font-extrabold text-white">ATS 2026</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-on-surface-variant hover:text-white" aria-label="Close menu">
                <Icon>close</Icon>
              </button>
            </div>
            <div className="mt-8 grid gap-3">
              {links.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setDrawerOpen(false)} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-4 font-semibold text-on-surface-variant transition hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim">
                  {label}
                </a>
              ))}
              <button onClick={() => { setDrawerOpen(false); onBrochure(); }} className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-fixed-dim px-4 py-4 font-bold text-[#071013] transition hover:bg-white">
                <Icon>download</Icon>
                Brochure
              </button>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

function Hero({ onBrochure, onParticipate }) {
  return (
    <section id="home" className="relative min-h-[92vh] overflow-hidden pt-14 md:pt-16">
      <img className="absolute inset-0 h-full w-full object-cover" src={IMAGES.hero} alt="Crowd watching a live talent show stage" />
      <div className="absolute inset-0 bg-[#07080d]/72" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#00daf3]/10 via-transparent to-[#ffb59a]/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090d]/20 to-[#09090d]" />
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative mx-auto flex min-h-[calc(92vh-3.5rem)] max-w-container-max flex-col justify-center px-margin-mobile py-14 md:min-h-[calc(92vh-4rem)] md:px-margin-desktop">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary-fixed-dim/25 bg-secondary-fixed-dim/10 px-4 py-2 font-label text-[11px] font-bold uppercase tracking-[0.18em] text-secondary-fixed-dim">
            <span className="h-2 w-2 rounded-full bg-secondary-fixed-dim" />
            Season 1 registrations open
          </p>
          <h1 className="font-display text-[44px] font-extrabold uppercase leading-[48px] text-white md:text-[72px] md:leading-[78px]">
            ATS 2026
            <span className="block text-tertiary">Artist Talent Show</span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-on-surface-variant">A premium talent-show platform for performers, creators, models, singers, and dancers ready for a real stage, public voting, brand attention, and national recognition.</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <button onClick={onParticipate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-tertiary px-7 py-4 font-bold text-[#211006] shadow-[0_16px_40px_rgba(255,181,154,0.22)] transition hover:-translate-y-1 hover:bg-white">
              <Icon>edit_note</Icon>
              Participate Now
            </button>
            <button onClick={onBrochure} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim">
              <Icon>download</Icon>
              Download Brochure
            </button>
          </div>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map(([value, label, icon]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-[#10131b]/78 p-4 backdrop-blur">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-fixed-dim/12 text-secondary-fixed-dim">
                <Icon>{icon}</Icon>
              </div>
              <p className="font-display text-3xl font-extrabold text-white">{value}</p>
              <p className="mt-1 text-sm font-semibold text-on-surface-variant">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section className="border-y border-white/10 bg-[#11121a]">
      <div className="mx-auto grid max-w-container-max gap-10 px-margin-mobile py-20 md:px-margin-desktop lg:grid-cols-2">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Who We Are</p>
          <h2 className="mt-4 font-headline text-headline-lg-mobile text-white md:text-headline-lg">A platform built to discover original Indian talent.</h2>
          <p className="mt-5 text-body-lg text-on-surface-variant">ATS brings artists, audiences, brands, and organizers together through live events, digital voting, auditions, finale showcases, and admin-managed talent records.</p>
        </motion.div>
        <img className="h-full min-h-72 w-full rounded-lg object-cover" src={IMAGES.who} alt="Performer preparing backstage" />
      </div>
    </section>
  );
}

function Stats({ participants, sports }) {
  const stats = [
    [participants.length || "10K+", "Registered Talent", "person_add"],
    [sports.length || "40+", "Managed Events", "event_available"],
    ["18+", "Cities Covered", "location_city"],
    ["95%", "Audience Engagement", "trending_up"]
  ];
  return (
    <section id="vote" className="mx-auto max-w-container-max px-margin-mobile py-10 md:px-margin-desktop">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label, icon], index) => (
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: index * 0.05 }} key={label} className="group rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-secondary-fixed-dim/45 hover:bg-white/[0.07]">
            <div className="mb-4 flex items-center justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary-fixed-dim/12 text-secondary-fixed-dim"><Icon>{icon}</Icon></div>
              <span className="font-label text-[10px] uppercase text-tertiary">0{index + 1}</span>
            </div>
            <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-display text-4xl font-extrabold text-white">{value}</motion.p>
            <p className="mt-2 font-semibold text-on-surface-variant">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function StarAlumni({ participants }) {
  const [filter, setFilter] = useState("All");
  const professions = ["All", ...new Set(participants.map((item) => item.profession))];
  const visible = filter === "All" ? participants : participants.filter((item) => item.profession === filter);

  return (
    <section id="artists" className="bg-[#16131d] px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <div className="text-center">
          <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Star Alumni Bank</p>
          <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">Active participants managed from admin.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {professions.map((profession) => (
              <button key={profession} onClick={() => setFilter(profession)} className={`rounded-lg border px-5 py-3 font-semibold transition ${filter === profession ? "border-tertiary bg-tertiary text-[#211006]" : "border-white/15 bg-white/[0.04] text-on-surface-variant hover:border-tertiary hover:text-tertiary"}`}>
                {profession}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((participant) => (
            <article key={participant.id} className="group relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
              <img className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" src={participant.image || fallbackImage} alt={participant.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="rounded border border-secondary-fixed-dim/30 bg-secondary-fixed-dim/15 px-3 py-1 font-label text-[10px] uppercase text-secondary-fixed-dim">{participant.code}</span>
                <h3 className="mt-4 font-headline text-2xl text-white">{participant.name}</h3>
                <p className="mt-2 font-semibold text-tertiary">{participant.profession}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SportsList({ sports }) {
  const serviceItems = sports.length
    ? sports.map((sport, index) => [sport.name, sport.category, ["sports", "emoji_events", "campaign"][index % 3], ["border-secondary-fixed-dim/30", "border-tertiary/40", "border-primary/40"][index % 3]])
    : fallbackServices;
  return (
    <section id="sports" className="mx-auto max-w-container-max px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-label text-label-caps uppercase text-tertiary">Services</p>
        <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">Everything needed to run a polished talent-show experience.</h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {serviceItems.map(([title, copy, icon, border], index) => (
          <motion.article variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: index * 0.05 }} key={title} className={`group rounded-lg border ${border} bg-[#12151d] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:-translate-y-2 hover:bg-[#171b25] hover:shadow-[0_24px_70px_rgba(0,218,243,0.10)]`}>
            <div className="mb-6 flex items-center justify-between">
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-white/[0.06] text-secondary-fixed-dim transition group-hover:bg-secondary-fixed-dim group-hover:text-[#071013]">
                <Icon className="text-3xl">{icon}</Icon>
              </div>
              <span className="font-label text-[11px] uppercase text-on-surface-variant">0{index + 1}</span>
            </div>
            <h3 className="font-headline text-2xl text-white">{title}</h3>
            <p className="mt-3 leading-relaxed text-on-surface-variant">{copy}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Participate({ onParticipate }) {
  return (
    <section id="participate" className="mx-auto grid max-w-container-max gap-6 px-margin-mobile py-16 md:px-margin-desktop lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="font-label text-label-caps uppercase text-tertiary">Participate for ATS 2026</p>
        <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">Auditions are open for Season 1.</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">Register your profile, upload your best performance, and invite your audience to support you through public voting.</p>
      </div>
      <div className="flex items-center lg:justify-end">
        <button onClick={onParticipate} className="inline-flex items-center gap-2 rounded-lg bg-secondary-fixed-dim px-7 py-4 font-bold text-[#071013] transition hover:bg-white">
          <Icon>how_to_reg</Icon>
          Participate Now
        </button>
      </div>
    </section>
  );
}

function EventSchedule({ events, onBook }) {
  return (
    <section id="events" className="border-y border-white/10 bg-[#101016] px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <p className="text-center font-label text-label-caps uppercase text-secondary-fixed-dim">Event Dates</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center font-headline text-headline-lg-mobile text-white md:text-headline-lg">Book your spot for upcoming ATS events.</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-label text-label-caps uppercase text-tertiary">{event.date || "Date coming soon"}</p>
                  <h3 className="mt-3 font-headline text-2xl text-white">{event.title}</h3>
                  <p className="mt-2 text-secondary-fixed-dim">{event.venue}</p>
                  <p className="mt-4 leading-relaxed text-on-surface-variant">{event.details}</p>
                </div>
                <button onClick={() => onBook(event)} className="shrink-0 rounded-lg bg-secondary-fixed-dim px-5 py-3 font-bold text-[#071013] transition hover:bg-white">
                  Book Event
                </button>
              </div>
            </article>
          ))}
          {!events.length && <p className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center text-on-surface-variant lg:col-span-2">No active events yet.</p>}
        </div>
      </div>
    </section>
  );
}

function PastEvents() {
  const events = [
    ["Mumbai Talent Night", "12 Apr 2025", "Mumbai", "1,200+ live attendees", IMAGES.past1],
    ["Creator Spotlight", "28 Jun 2025", "Delhi", "Digital voting showcase", IMAGES.past2],
    ["Grand Stage Battle", "09 Sep 2025", "Bengaluru", "Dance and music finals", IMAGES.past3],
    ["Fashion & Influence", "18 Nov 2025", "Kolkata", "Brand-led runway night", IMAGES.past4]
  ];
  return (
    <section className="px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Past Events</p>
            <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">Highlights from previous ATS experiences.</h2>
          </div>
          <p className="max-w-md text-on-surface-variant">Browse moments that shaped our audience, sponsor, and performer community.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {events.map(([title, date, location, highlight, image]) => (
            <article key={title} className="group overflow-hidden rounded-lg border border-white/10 bg-[#12151d] transition hover:-translate-y-2 hover:border-secondary-fixed-dim/40">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img className="h-full w-full object-cover transition duration-700 group-hover:scale-110" src={image} alt={title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070b]/80 to-transparent" />
                <span className="absolute left-4 top-4 rounded bg-black/45 px-3 py-1 font-label text-[10px] uppercase text-white backdrop-blur">{date}</span>
              </div>
              <div className="p-5">
                <p className="font-label text-[11px] uppercase text-tertiary">{location}</p>
                <h3 className="mt-2 font-headline text-xl text-white">{title}</h3>
                <p className="mt-2 text-sm text-on-surface-variant">{highlight}</p>
                <button className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-secondary-fixed-dim transition group-hover:gap-3">
                  View Highlights <Icon className="text-base">arrow_forward</Icon>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Organizers() {
  const team = [
    ["Event Direction", "Planning, show flow, venue coordination", IMAGES.organizer1, "event"],
    ["Stage Production", "Lights, sound, backstage and live crew", IMAGES.organizer2, "settings"],
    ["Artist Management", "Auditions, mentors, rehearsals and talent care", IMAGES.organizer3, "groups"],
    ["Media & Sponsors", "Brand partners, press, content and voting reach", IMAGES.organizer4, "campaign"]
  ];
  return (
    <section id="team" className="mx-auto max-w-container-max px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Organized By</p>
        <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">The teams behind ATS 2026 Season 1.</h2>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map(([title, copy, image, icon]) => (
          <article key={title} className="group relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
            <img className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" src={image} alt={`${title} organizer team`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/72 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-lg border border-secondary-fixed-dim/30 bg-secondary-fixed-dim/15 text-secondary-fixed-dim">
                <Icon>{icon}</Icon>
              </div>
              <p className="mb-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-tertiary">ATS Core Team</p>
              <h3 className="font-headline text-2xl text-white">{title}</h3>
              <p className="mt-3 leading-relaxed text-on-surface-variant">{copy}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-on-surface-variant">Event Date: Coming Soon</p>
    </section>
  );
}

function TrustSection() {
  const winners = [
    ["Anaya Verma", "Season Spotlight Winner", "Singer"],
    ["Dev Rana", "Audience Choice", "Dancer"],
    ["Kiara Sen", "Brand Favorite", "Model"]
  ];

  return (
    <section className="border-y border-white/10 bg-[#10131b] px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Trust & Credibility</p>
            <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">Built for performers, partners, and audiences.</h2>
            <div className="mt-8 grid gap-4">
              {testimonials.map(([quote, name, role]) => (
                <blockquote key={name} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-on-surface-variant">"{quote}"</p>
                  <footer className="mt-4 text-sm font-bold text-white">{name} <span className="font-normal text-tertiary">/ {role}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <p className="font-label text-label-caps uppercase text-tertiary">Sponsors</p>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
                {sponsors.map((sponsor) => (
                  <div key={sponsor} className="grid h-20 place-items-center rounded-lg border border-white/10 bg-[#0b0d13] px-3 text-center font-bold text-on-surface-variant">
                    {sponsor}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {winners.map(([name, title, craft]) => (
                <div key={name} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-tertiary/15 text-tertiary">
                    <Icon>workspace_premium</Icon>
                  </div>
                  <p className="font-bold text-white">{name}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{title}</p>
                  <p className="mt-3 font-label text-[10px] uppercase text-secondary-fixed-dim">{craft}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrochureModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", interest: "Participant" });
  const [status, setStatus] = useState("");
  const [downloads, setDownloads] = useState([]);
  useEffect(() => {
    if (open) {
      setStatus("");
      setDownloads([]);
    }
  }, [open]);
  if (!open) return null;

  async function submitLead(event) {
    event.preventDefault();
    setStatus("Saving your details...");
    try {
      const result = await api("/api/leads", { method: "POST", body: JSON.stringify(form) });
      const brochureDownloads = result.brochures?.length
        ? result.brochures.map((brochure) => ({ ...brochure, url: assetUrl(brochure.url) }))
        : [{ title: "ATS 2026 Brochure", url: assetUrl(result.brochureUrl) }];
      setDownloads(brochureDownloads);
      if (brochureDownloads[0]?.url) {
        const link = document.createElement("a");
        link.href = brochureDownloads[0].url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setStatus("Details saved. Download links are available below.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4">
      <form onSubmit={submitLead} className="w-full max-w-xl rounded-lg border border-white/10 bg-[#15121c] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Download Brochure</p>
            <h2 className="mt-2 font-headline text-3xl text-white">Tell us where to send updates.</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-on-surface-variant hover:text-white">
            <Icon>close</Icon>
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {["name", "email", "phone", "city"].map((field) => (
            <input key={field} required={field !== "city"} type={field === "email" ? "email" : "text"} placeholder={field[0].toUpperCase() + field.slice(1)} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          ))}
          <select value={form.interest} onChange={(event) => setForm({ ...form, interest: event.target.value })} className="rounded-lg border border-white/10 bg-[#201d29] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim sm:col-span-2">
            <option>Participant</option>
            <option>Sponsor</option>
            <option>Audience</option>
            <option>Media</option>
          </select>
        </div>
        <button className="mt-6 w-full rounded-lg bg-secondary-fixed-dim px-6 py-4 font-bold text-[#071013] hover:bg-white">Submit & Download PDF</button>
        {status && <p className="mt-4 text-center text-sm text-on-surface-variant">{status}</p>}
        {downloads.length > 0 && (
          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="mb-3 font-bold text-white">Available brochures</p>
            <div className="grid gap-3">
              {downloads.map((brochure) => (
                <a key={brochure.id || brochure.url} href={brochure.url} download className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 text-on-surface-variant transition hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim">
                  <span>{brochure.title || brochure.fileName || "Download brochure"}</span>
                  <Icon>download</Icon>
                </a>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function ParticipantModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    profession: "Dancer",
    image: "",
    active: true
  });
  const [status, setStatus] = useState("");

  if (!open) return null;

  function codeFor(profession) {
    const prefix = profession.slice(0, 3).toUpperCase();
    return `ATS-${prefix}-${Date.now().toString().slice(-5)}`;
  }

  async function submitParticipant(event) {
    event.preventDefault();
    setStatus("Submitting your registration...");
    try {
      await api("/api/participants", {
        method: "POST",
        body: JSON.stringify({
          code: codeFor(form.profession),
          name: form.name,
          profession: form.profession,
          image: form.image || fallbackImage,
          active: form.active,
          phone: form.phone,
          email: form.email,
          city: form.city
        })
      });
      setStatus("Registration saved. You will now appear in the admin dashboard.");
      setForm({ name: "", phone: "", email: "", city: "", profession: "Dancer", image: "", active: true });
      await onCreated();
      setTimeout(onClose, 900);
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4">
      <form onSubmit={submitParticipant} className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#15121c] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Participant Form</p>
            <h2 className="mt-2 font-headline text-3xl text-white">Register for ATS 2026</h2>
            <p className="mt-2 text-on-surface-variant">Your participant code will be created automatically.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-on-surface-variant hover:text-white">
            <Icon>close</Icon>
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input required placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <select value={form.profession} onChange={(event) => setForm({ ...form, profession: event.target.value })} className="rounded-lg border border-white/10 bg-[#201d29] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim">
            <option>Dancer</option>
            <option>Singer</option>
            <option>Model</option>
            <option>Influencer</option>
            <option>Public Performer</option>
          </select>
          <input required placeholder="Phone number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input required type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input placeholder="Profile image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-on-surface-variant sm:col-span-2">
            <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />
            Show this participant in Star Alumni Bank after submission
          </label>
        </div>

        <button className="mt-6 w-full rounded-lg bg-secondary-fixed-dim px-6 py-4 font-bold text-[#071013] hover:bg-white">Submit Participant Form</button>
        {status && <p className="mt-4 text-center text-sm text-on-surface-variant">{status}</p>}
      </form>
    </div>
  );
}

function EventBookingModal({ event, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", notes: "" });
  const [status, setStatus] = useState("");
  if (!event) return null;

  async function submitBooking(submitEvent) {
    submitEvent.preventDefault();
    setStatus("Saving your booking request...");
    try {
      await api("/api/event-bookings", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventVenue: event.venue
        })
      });
      setStatus("Booking request saved. Our team will contact you soon.");
      setForm({ name: "", email: "", phone: "", city: "", notes: "" });
      setTimeout(onClose, 1000);
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4">
      <form onSubmit={submitBooking} className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#15121c] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Book Event</p>
            <h2 className="mt-2 font-headline text-3xl text-white">{event.title}</h2>
            <p className="mt-2 text-on-surface-variant">{event.date} | {event.venue}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-on-surface-variant hover:text-white">
            <Icon>close</Icon>
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input required placeholder="Full name" value={form.name} onChange={(input) => setForm({ ...form, name: input.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input required type="email" placeholder="Email address" value={form.email} onChange={(input) => setForm({ ...form, email: input.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input required placeholder="Phone number" value={form.phone} onChange={(input) => setForm({ ...form, phone: input.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input placeholder="City" value={form.city} onChange={(input) => setForm({ ...form, city: input.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <textarea placeholder="Booking details or team size" value={form.notes} onChange={(input) => setForm({ ...form, notes: input.target.value })} className="min-h-28 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim sm:col-span-2" />
        </div>
        <button className="mt-6 w-full rounded-lg bg-secondary-fixed-dim px-6 py-4 font-bold text-[#071013] hover:bg-white">Submit Booking Request</button>
        {status && <p className="mt-4 text-center text-sm text-on-surface-variant">{status}</p>}
      </form>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08090d] px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto grid max-w-container-max gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-display text-headline-lg-mobile font-extrabold text-white">ATS 2026</h2>
          <p className="mt-6 max-w-xs text-body-lg text-on-surface-variant">The world's most innovative talent platform, discovering the next generation of global stars.</p>
          <div className="mt-6 flex gap-3 text-secondary-fixed-dim">
            {["public", "podcasts", "movie"].map((icon) => (
              <a key={icon} href="#home" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] transition hover:border-secondary-fixed-dim hover:bg-secondary-fixed-dim hover:text-[#071013]">
                <Icon>{icon}</Icon>
              </a>
            ))}
          </div>
        </div>
        <FooterLinks title="Quick Links" items={["Home", "Artists", "Sports", "Events", "Team"]} />
        <div>
          <h3 className="font-label text-label-caps uppercase text-tertiary">Contact</h3>
          <div className="mt-7 space-y-4 text-on-surface-variant">
            <p className="flex gap-3"><Icon className="text-secondary-fixed-dim">mail</Icon> hello@ats2026.com</p>
            <p className="flex gap-3"><Icon className="text-secondary-fixed-dim">call</Icon> +91 90000 00000</p>
            <p className="flex gap-3"><Icon className="text-secondary-fixed-dim">location_on</Icon> India-wide talent events</p>
          </div>
        </div>
        <div>
          <h3 className="font-label text-label-caps uppercase text-tertiary">Newsletter</h3>
          <p className="mt-7 text-on-surface-variant">Stay updated with the latest show results.</p>
          <div className="mt-5 flex overflow-hidden rounded-lg bg-surface-container">
            <input className="min-w-0 flex-1 bg-transparent px-4 py-4 text-on-surface outline-none" placeholder="Email address" type="email" />
            <button className="grid w-16 place-items-center bg-primary text-on-primary transition hover:bg-secondary-fixed-dim"><Icon>arrow_forward</Icon></button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-container-max flex-col gap-3 border-t border-white/10 pt-8 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 Artist Talent Show Season 1. Produced by Global Media Group.</p>
        <div className="flex gap-4">
          <a href="#home" className="hover:text-secondary-fixed-dim">Privacy</a>
          <a href="#home" className="hover:text-secondary-fixed-dim">Terms</a>
          <a href="#home" className="hover:text-secondary-fixed-dim">Support</a>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, items }) {
  return (
    <div>
      <h3 className="font-label text-label-caps uppercase text-tertiary">{title}</h3>
      <div className="mt-7 space-y-4">
        {items.map((item) => <a key={item} href={`#${item.toLowerCase() === "home" ? "home" : item.toLowerCase()}`} className="block text-body-lg text-on-surface-variant transition hover:text-secondary-fixed-dim">{item}</a>)}
      </div>
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#0a0a0f] px-margin-mobile text-on-surface">
          <div className="max-w-lg rounded-lg border border-white/10 bg-[#15121c] p-6 text-center">
            <p className="font-label text-label-caps uppercase text-tertiary">Dashboard Error</p>
            <h1 className="mt-2 font-headline text-3xl text-white">Admin could not open.</h1>
            <p className="mt-4 text-on-surface-variant">{this.state.error.message}</p>
            <button onClick={() => { clearAdminToken(); window.location.reload(); }} className="mt-6 rounded-lg bg-secondary-fixed-dim px-5 py-3 font-bold text-[#071013]">
              Reset Login
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

function PublicSite() {
  const [data, setData] = useState({ participants: [], sports: [], events: [] });
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [participantOpen, setParticipantOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState(null);

  async function refreshPublicData() {
    setData(await api("/api/public"));
  }

  useEffect(() => {
    refreshPublicData().catch(() => setData({ participants: [], sports: [], events: [] }));
  }, []);

  return (
    <>
      <Header onBrochure={() => setBrochureOpen(true)} />
      <main>
        <Hero onBrochure={() => setBrochureOpen(true)} onParticipate={() => setParticipantOpen(true)} />
        <WhoWeAre />
        <Stats participants={data.participants} sports={data.sports} />
        <StarAlumni participants={data.participants} />
        <SportsList sports={data.sports} />
        <EventSchedule events={data.events} onBook={setBookingEvent} />
        <Participate onParticipate={() => setParticipantOpen(true)} />
        <PastEvents />
        <Organizers />
        <TrustSection />
      </main>
      <Footer />
      <BrochureModal open={brochureOpen} onClose={() => setBrochureOpen(false)} />
      <ParticipantModal open={participantOpen} onClose={() => setParticipantOpen(false)} onCreated={refreshPublicData} />
      <EventBookingModal event={bookingEvent} onClose={() => setBookingEvent(null)} />
    </>
  );
}

function AdminDashboard() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken() || window.__atsAdminToken));
  const [login, setLogin] = useState({ username: "", password: "" });
  const [db, setDb] = useState({ participants: [], sports: [], events: [], eventBookings: [], leads: [], brochure: {}, brochures: [] });
  const [participant, setParticipant] = useState(emptyParticipant);
  const [sport, setSport] = useState(emptySport);
  const [event, setEvent] = useState(emptyEvent);
  const [brochureForm, setBrochureForm] = useState(emptyBrochure);
  const [brochureFile, setBrochureFile] = useState(null);
  const [plannerFilter, setPlannerFilter] = useState("All");
  const [status, setStatus] = useState("");

  async function refresh() {
    setDb(await api("/api/admin"));
  }

  useEffect(() => {
    if (authed) refresh().catch((error) => {
      clearAdminToken();
      setAuthed(false);
      setStatus(error.message);
    });
  }, [authed]);

  async function submitLogin(event) {
    event.preventDefault();
    setStatus("Checking login...");
    try {
      const result = await loginAdmin(login);
      setAdminToken(result.token);
      setAuthed(true);
      setStatus("");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function logout() {
    clearAdminToken();
    setAuthed(false);
    setDb({ participants: [], sports: [], events: [], eventBookings: [], leads: [], brochure: {}, brochures: [] });
  }

  const professions = useMemo(() => ["All", ...new Set(db.participants.map((item) => item.profession))], [db.participants]);
  const plannedParticipants = plannerFilter === "All" ? db.participants : db.participants.filter((item) => item.profession === plannerFilter);

  if (!authed) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0a0a0f] px-margin-mobile text-on-surface">
        <form onSubmit={submitLogin} className="w-full max-w-md rounded-lg border border-white/10 bg-[#15121c] p-6 shadow-2xl">
          <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Admin Login</p>
          <h1 className="mt-2 font-display text-headline-lg-mobile text-white">Open Dashboard</h1>
          <p className="mt-3 text-on-surface-variant">Enter admin credentials to manage ATS 2026.</p>
          <div className="mt-6 grid gap-4">
            <input required placeholder="Username" value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
            <input required type="password" placeholder="Password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          </div>
          <button className="mt-6 w-full rounded-lg bg-secondary-fixed-dim px-6 py-4 font-bold text-[#071013] hover:bg-white">Login</button>
          {status && <p className="mt-4 text-center text-sm text-on-surface-variant">{status}</p>}
          <a href="/" className="mt-5 block text-center text-sm text-tertiary">Back to website</a>
        </form>
      </main>
    );
  }

  async function saveParticipant(event) {
    event.preventDefault();
    await api("/api/participants", { method: "POST", body: JSON.stringify(participant) });
    setParticipant(emptyParticipant);
    await refresh();
  }

  async function saveSport(event) {
    event.preventDefault();
    await api("/api/sports", { method: "POST", body: JSON.stringify(sport) });
    setSport(emptySport);
    await refresh();
  }

  async function saveEvent(submitEvent) {
    submitEvent.preventDefault();
    await api("/api/events", { method: "POST", body: JSON.stringify(event) });
    setEvent(emptyEvent);
    await refresh();
  }

  async function toggle(collection, item) {
    await api(`/api/${collection}/${item.id}`, { method: "PUT", body: JSON.stringify({ active: !item.active }) });
    await refresh();
  }

  async function remove(collection, id) {
    await api(`/api/${collection}/${id}`, { method: "DELETE" });
    await refresh();
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function saveAdditionalBrochure(submitEvent) {
    submitEvent.preventDefault();
    if (!brochureForm.id && !brochureFile) {
      setStatus("Please choose a PDF brochure file.");
      return;
    }
    const filePayload = brochureFile
      ? {
          fileName: brochureFile.name,
          dataUrl: await readFileAsDataUrl(brochureFile)
        }
      : {};
    const payload = {
      title: brochureForm.title,
      active: brochureForm.active,
      ...filePayload
    };
    if (brochureForm.id) {
      await api(`/api/brochures/${brochureForm.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      setStatus("Brochure updated.");
    } else {
      await api("/api/brochures", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setStatus("Brochure saved.");
    }
    setBrochureForm(emptyBrochure);
    setBrochureFile(null);
    await refresh();
  }

  async function toggleBrochure(brochure) {
    await api(`/api/brochures/${brochure.id}`, {
      method: "PUT",
      body: JSON.stringify({ active: !brochure.active })
    });
    await refresh();
  }

  async function removeBrochure(id) {
    await api(`/api/brochures/${id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0a0a0f] px-margin-mobile py-8 text-on-surface md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Admin Dashboard</p>
            <h1 className="mt-2 font-display text-display-lg-mobile text-white">ATS Control Panel</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-fixed-dim px-5 py-3 font-bold text-[#071013]"><Icon>home</Icon> View Site</a>
            <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 font-bold text-on-surface-variant hover:text-white"><Icon>logout</Icon> Logout</button>
          </div>
        </div>

        {status && <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-on-surface-variant">{status}</p>}

        <section className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <AdminStat label="Participants" value={db.participants.length} />
          <AdminStat label="Active Alumni" value={db.participants.filter((item) => item.active).length} />
          <AdminStat label="Sports" value={db.sports.length} />
          <AdminStat label="Events" value={db.events?.length || 0} />
          <AdminStat label="Brochures" value={db.brochures?.length || 0} />
          <AdminStat label="Brochure Leads" value={db.leads.length} />
          <AdminStat label="Event Bookings" value={db.eventBookings?.length || 0} />
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          <Panel title="Participant Management">
            <form onSubmit={saveParticipant} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Code" value={participant.code} onChange={(value) => setParticipant({ ...participant, code: value })} />
              <Input placeholder="Name" value={participant.name} onChange={(value) => setParticipant({ ...participant, name: value })} />
              <Input placeholder="Profession" value={participant.profession} onChange={(value) => setParticipant({ ...participant, profession: value })} />
              <Input placeholder="Image URL" value={participant.image} onChange={(value) => setParticipant({ ...participant, image: value })} />
              <label className="flex items-center gap-2 text-on-surface-variant"><input type="checkbox" checked={participant.active} onChange={(event) => setParticipant({ ...participant, active: event.target.checked })} /> Active in Star Alumni Bank</label>
              <button className="rounded-lg bg-tertiary px-5 py-3 font-bold text-[#211006]">Add Participant</button>
            </form>
            <AdminTable items={db.participants} columns={["code", "name", "profession"]} collection="participants" onToggle={toggle} onRemove={remove} />
          </Panel>

          <Panel title="Single Model Planner">
            <select value={plannerFilter} onChange={(event) => setPlannerFilter(event.target.value)} className="mb-4 w-full rounded-lg border border-white/10 bg-[#201d29] px-4 py-3 text-white">
              {professions.map((profession) => <option key={profession}>{profession}</option>)}
            </select>
            <div className="grid gap-3">
              {plannedParticipants.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-sm text-on-surface-variant">{item.code} - {item.profession}</p>
                  </div>
                  <span className={`rounded px-3 py-1 text-xs font-bold ${item.active ? "bg-secondary-fixed-dim text-[#071013]" : "bg-white/10 text-on-surface-variant"}`}>{item.active ? "Active" : "Hidden"}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Sports List Management">
            <form onSubmit={saveSport} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Sport/Event Name" value={sport.name} onChange={(value) => setSport({ ...sport, name: value })} />
              <Input placeholder="Category" value={sport.category} onChange={(value) => setSport({ ...sport, category: value })} />
              <label className="flex items-center gap-2 text-on-surface-variant"><input type="checkbox" checked={sport.active} onChange={(event) => setSport({ ...sport, active: event.target.checked })} /> Active on Website</label>
              <button className="rounded-lg bg-tertiary px-5 py-3 font-bold text-[#211006]">Add Sport</button>
            </form>
            <AdminTable items={db.sports} columns={["name", "category"]} collection="sports" onToggle={toggle} onRemove={remove} />
          </Panel>

          <Panel title="Event Date & Details">
            <form onSubmit={saveEvent} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Event title" value={event.title} onChange={(value) => setEvent({ ...event, title: value })} />
              <input required type="date" value={event.date} onChange={(input) => setEvent({ ...event, date: input.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
              <Input placeholder="Venue" value={event.venue} onChange={(value) => setEvent({ ...event, venue: value })} />
              <label className="flex items-center gap-2 text-on-surface-variant"><input type="checkbox" checked={event.active} onChange={(input) => setEvent({ ...event, active: input.target.checked })} /> Active on Website</label>
              <textarea required placeholder="Event details" value={event.details} onChange={(input) => setEvent({ ...event, details: input.target.value })} className="min-h-28 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim md:col-span-2" />
              <button className="rounded-lg bg-tertiary px-5 py-3 font-bold text-[#211006] md:col-span-2">Add Event</button>
            </form>
            <AdminTable items={db.events || []} columns={["title", "date", "venue"]} collection="events" onToggle={toggle} onRemove={remove} />
          </Panel>

          <Panel title="Event Booking Requests">
            <div className="max-h-96 overflow-auto rounded-lg border border-white/10">
              {(db.eventBookings || []).map((booking) => (
                <div key={booking.id} className="border-b border-white/10 p-4 last:border-b-0">
                  <p className="font-bold text-white">{booking.name} <span className="text-sm text-tertiary">({booking.eventTitle})</span></p>
                  <p className="text-sm text-on-surface-variant">{booking.eventDate} | {booking.eventVenue}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{booking.email} | {booking.phone} | {booking.city || "No city"}</p>
                  {booking.notes && <p className="mt-2 text-sm text-on-surface-variant">{booking.notes}</p>}
                </div>
              ))}
              {!(db.eventBookings || []).length && <p className="p-4 text-on-surface-variant">No event bookings yet.</p>}
            </div>
          </Panel>

          <Panel title="Brochure & Leads">
            <form onSubmit={saveAdditionalBrochure} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="font-bold text-white">{brochureForm.id ? "Update brochure" : "Save brochure"}</p>
                <p className="mt-1 text-sm text-on-surface-variant">Use this one form to add a brochure or edit the selected one.</p>
              </div>
              <Input placeholder="Brochure title" value={brochureForm.title} onChange={(value) => setBrochureForm({ ...brochureForm, title: value })} />
              <input onChange={(input) => setBrochureFile(input.target.files?.[0] || null)} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-on-surface-variant" type="file" accept="application/pdf" />
              <label className="flex items-center gap-2 text-on-surface-variant"><input type="checkbox" checked={brochureForm.active} onChange={(input) => setBrochureForm({ ...brochureForm, active: input.target.checked })} /> Visible after popup</label>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-lg bg-tertiary px-5 py-3 font-bold text-[#211006]">{brochureForm.id ? "Update Brochure" : "Save Brochure"}</button>
                {brochureForm.id && (
                  <button type="button" onClick={() => { setBrochureForm(emptyBrochure); setBrochureFile(null); }} className="rounded-lg border border-white/10 px-5 py-3 font-bold text-on-surface-variant hover:text-white">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
            <div className="mt-5 rounded-lg border border-white/10">
              {(db.brochures || []).map((brochure) => (
                <div key={brochure.id} className="grid gap-3 border-b border-white/10 p-4 last:border-b-0 lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-center">
                  <p className="font-bold text-white">{brochure.title}</p>
                  <div className="text-sm text-on-surface-variant">
                    <p>{brochure.fileName}</p>
                    <p>{brochure.active ? "Visible after popup" : "Hidden"}</p>
                  </div>
                  <button onClick={() => { setBrochureForm({ id: brochure.id, title: brochure.title, active: brochure.active }); setBrochureFile(null); }} className="rounded border border-white/10 px-3 py-2 text-sm text-on-surface-variant hover:text-white">Edit</button>
                  <button onClick={() => toggleBrochure(brochure)} className="rounded border border-white/10 px-3 py-2 text-sm text-secondary-fixed-dim">{brochure.active ? "Hide" : "Show"}</button>
                  <button onClick={() => removeBrochure(brochure.id)} className="rounded border border-white/10 px-3 py-2 text-sm text-tertiary">Remove</button>
                </div>
              ))}
              {!(db.brochures || []).length && <p className="p-4 text-on-surface-variant">No brochures saved yet.</p>}
            </div>
            <div className="mt-5 flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-white">Brochure leads</p>
                <p className="text-sm text-on-surface-variant">These appear after someone submits the brochure popup.</p>
              </div>
              <button onClick={refresh} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-secondary-fixed-dim">Refresh Leads</button>
            </div>
            <div className="mt-3 max-h-96 overflow-auto rounded-lg border border-white/10">
              {db.leads.map((lead) => (
                <div key={lead.id} className="border-b border-white/10 p-4 last:border-b-0">
                  <p className="font-bold text-white">{lead.name} <span className="text-sm text-tertiary">({lead.interest})</span></p>
                  <p className="text-sm text-on-surface-variant">{lead.email} | {lead.phone} | {lead.city || "No city"}</p>
                </div>
              ))}
              {!db.leads.length && <p className="p-4 text-on-surface-variant">No brochure leads yet.</p>}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function AdminStat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <p className="font-display text-4xl font-extrabold text-secondary-fixed-dim">{value}</p>
      <p className="mt-2 text-on-surface-variant">{label}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-lg border border-white/10 bg-[#15121c] p-5">
      <h2 className="mb-5 font-headline text-2xl text-white">{title}</h2>
      {children}
    </section>
  );
}

function Input({ placeholder, value, onChange }) {
  return <input required placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />;
}

function AdminTable({ items, columns, collection, onToggle, onRemove }) {
  return (
    <div className="mt-5 overflow-auto rounded-lg border border-white/10">
      {items.map((item) => (
        <div key={item.id} className="grid min-w-[620px] grid-cols-[1fr_1fr_1fr_auto_auto] items-center gap-3 border-b border-white/10 p-3 last:border-b-0">
          {columns.map((column) => <span key={column} className="text-sm text-on-surface-variant">{item[column]}</span>)}
          {columns.length === 2 && <span className="text-sm text-on-surface-variant">{item.active ? "Active" : "Hidden"}</span>}
          <button onClick={() => onToggle(collection, item)} className="rounded border border-white/10 px-3 py-2 text-sm text-secondary-fixed-dim">{item.active ? "Hide" : "Show"}</button>
          <button onClick={() => onRemove(collection, item.id)} className="rounded border border-white/10 px-3 py-2 text-sm text-tertiary">Remove</button>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      {window.location.pathname.startsWith("/admin") ? <AdminDashboard /> : <PublicSite />}
    </ErrorBoundary>
  );
}
