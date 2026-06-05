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
const maxBrochureSize = 30 * 1024 * 1024;
const maxPortfolioPhotoSize = 8 * 1024 * 1024;
const maxTalentVideoSize = 75 * 1024 * 1024;
const fallbackImage = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=85";
const fallbackSvg = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#0a0a0f"/>
      <stop offset="0.55" stop-color="#15121c"/>
      <stop offset="1" stop-color="#0b2f38"/>
    </linearGradient>
  </defs>
  <rect width="900" height="700" fill="url(#bg)"/>
  <circle cx="690" cy="125" r="170" fill="#00daf3" opacity="0.16"/>
  <circle cx="170" cy="560" r="220" fill="#ffb59a" opacity="0.13"/>
  <rect x="110" y="150" width="680" height="400" rx="28" fill="#ffffff" opacity="0.055" stroke="#ffffff" stroke-opacity="0.18"/>
  <text x="450" y="330" fill="#ffffff" font-family="Arial, sans-serif" font-size="72" font-weight="800" text-anchor="middle">ATS 2026</text>
  <text x="450" y="392" fill="#00daf3" font-family="Arial, sans-serif" font-size="28" font-weight="700" text-anchor="middle">Artist Talent Show</text>
</svg>
`)}`;
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

const talentCategories = ["Singer", "Dancer", "Model", "Actor", "Creator", "Writer", "Mr & Miss Cute", "Open Talent"];

const testimonials = [
  ["Official testimonial pending approval.", "Surya Prakash", "Founder, Legit Global"],
  ["Official testimonial pending approval.", "Ankit Nagar", "Co-Founder, Legit Global"],
  ["Official testimonial pending approval.", "Vishal Gupta", "Founder, Viztechie Private Limited"]
];

const sponsors = ["Sponsors", "Partners", "Media Partners", "Supporting Organizations"];

const defaultHomepage = {
  heroEyebrow: "Season 1 registrations open",
  heroTitle: "Artist Talent Show",
  heroSubtitle: "Artist Talent Show",
  heroDescription: "Alpha Wings Tech Group presents a premium event platform for singers, dancers, models, actors, creators, writers, kids talent, and open talent performers ready for a professional stage.",
  contactEmail: "Events@alphabusi.com",
  contactPhone: "+91-79830 32984",
  contactLocation: "3rd Floor, Orchid Centre, Rapid Metro Station, Sector 53, Gurugram, Haryana 122002",
  socialInstagram: "https://www.instagram.com/atsshow.official/",
  socialYoutube: "https://www.youtube.com/@ArtistTalentShow",
  socialFacebook: "https://www.facebook.com/profile.php?id=61590326891434",
  socialTelegram: "https://t.me/",
  socialLinkedin: "https://linkedin.com/"
};

const defaultCategories = talentCategories;

const defaultEvents = [
  {
    id: "artist-talent-show-season-1",
    title: "Artist Talent Show Season 1",
    date: "Coming Soon",
    venue: "City to be announced",
    details: "A flagship ATS stage for singers, dancers, models, actors, creators, writers, kids talent, and open talent performers."
  },
  {
    id: "meerut-runway-fashion-week-season-2",
    title: "Meerut Runway Fashion Week Season 2",
    date: "Coming Soon",
    venue: "Meerut",
    details: "Fashion, runway, and talent showcase managed by the ATS event team."
  },
  {
    id: "grand-runway-night-season-1",
    title: "Grand Runway Night Season 1",
    date: "Coming Soon",
    venue: "City to be announced",
    details: "Premium runway night featuring models, designers, artists, and event partners."
  },
  {
    id: "meerut-slow-championship-season-3",
    title: "Meerut Slow Championship Season 3",
    date: "Coming Soon",
    venue: "Meerut",
    details: "Community event experience managed under the ATS event portfolio."
  },
  {
    id: "girfw-season-8",
    title: "GIRFW Season 8",
    date: "Coming Soon",
    venue: "City to be announced",
    details: "Established runway and fashion event managed with production, coordination, and partner support."
  }
];

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

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loginAdmin(credentials) {
  return api("/api/login", { method: "POST", body: JSON.stringify(credentials) });
}

function Icon({ children, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{children}</span>;
}

function SafeImage({ src, alt, className = "", fallback = fallbackSvg, ...props }) {
  return (
    <img
      {...props}
      className={className}
      src={src || fallback}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallback;
      }}
    />
  );
}

function Header({ onBrochure, onViewBrochure, showBrochure = true }) {
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
          {showBrochure && (
            <button onClick={onViewBrochure} className="hidden items-center gap-2 rounded-lg bg-secondary-fixed-dim px-4 py-2 text-sm font-bold text-[#071013] shadow-[0_8px_24px_rgba(0,218,243,0.18)] transition hover:-translate-y-0.5 hover:bg-white sm:inline-flex">
              <Icon className="text-lg">visibility</Icon>
              <span>Brochure</span>
            </button>
          )}
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
              {showBrochure && (
                <button onClick={() => { setDrawerOpen(false); onViewBrochure(); }} className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-fixed-dim px-4 py-4 font-bold text-[#071013] transition hover:bg-white">
                  <Icon>visibility</Icon>
                  View Brochure
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}

function Hero({ onBrochure, onViewBrochure, onParticipate, homepage = defaultHomepage, showBrochure = true }) {
  const content = { ...defaultHomepage, ...homepage };
  return (
    <section id="home" className="relative min-h-[92vh] overflow-hidden pt-14 md:pt-16">
      <SafeImage className="absolute inset-0 h-full w-full object-cover" src={IMAGES.hero} alt="Crowd watching a live talent show stage" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/12 via-[#05070c]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070c]/20 via-[#05070c]/35 to-[#09090d]" />
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative mx-auto flex min-h-[calc(92vh-3.5rem)] max-w-container-max flex-col justify-center px-margin-mobile py-14 md:min-h-[calc(92vh-4rem)] md:px-margin-desktop">
        <div className="max-w-4xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-4 py-2 font-label text-[11px] font-bold uppercase tracking-[0.18em] text-[#00E5FF] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            <span className="h-2 w-2 rounded-full bg-[#00E5FF]" />
            {content.heroEyebrow}
          </p>
          <h1 className="font-display text-[44px] font-extrabold uppercase leading-[48px] text-white [text-shadow:0_4px_28px_rgba(0,0,0,0.65)] md:text-[72px] md:leading-[78px]">
            {content.heroTitle}
            <span className="block bg-gradient-to-r from-[#00E5FF] via-[#00B8FF] to-[#2563FF] bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(0,184,255,0.28)]">
              {content.heroSubtitle}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg font-medium text-white/88 [text-shadow:0_2px_18px_rgba(0,0,0,0.6)]">{content.heroDescription}</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <button onClick={onParticipate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00E5FF] px-7 py-4 font-bold text-[#041014] shadow-[0_16px_40px_rgba(0,229,255,0.22)] transition hover:-translate-y-1 hover:bg-white">
              <Icon>edit_note</Icon>
              Participate Now
            </button>
            {showBrochure && (
              <button onClick={onViewBrochure} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/28 bg-black/25 px-7 py-4 font-bold text-white shadow-[0_14px_38px_rgba(0,0,0,0.22)] backdrop-blur transition hover:-translate-y-1 hover:border-[#00E5FF] hover:text-[#00E5FF]">
                <Icon>visibility</Icon>
                View Brochure
              </button>
            )}
            {showBrochure && (
              <button onClick={onBrochure} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/28 bg-black/25 px-7 py-4 font-bold text-white shadow-[0_14px_38px_rgba(0,0,0,0.22)] backdrop-blur transition hover:-translate-y-1 hover:border-[#00E5FF] hover:text-[#00E5FF]">
                <Icon>download</Icon>
                Download Brochure
              </button>
            )}
          </div>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map(([value, label, icon]) => (
            <div key={label} className="rounded-lg border border-white/12 bg-[#080b12]/82 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#00E5FF]/12 text-[#00E5FF]">
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
          <h2 className="mt-4 font-headline text-headline-lg-mobile text-white md:text-headline-lg">Alpha Wings Tech Group creates stages for original Indian talent.</h2>
          <p className="mt-5 text-body-lg text-on-surface-variant">ATS brings artists, audiences, brands, organizers, sponsors, media partners, and supporting organizations together through live events, auditions, production planning, and event management.</p>
        </motion.div>
        <SafeImage loading="lazy" className="h-full min-h-72 w-full rounded-lg object-cover" src={IMAGES.who} alt="Performer preparing backstage" />
      </div>
    </section>
  );
}

function Essentials() {
  const cards = [
    ["Mission", "Build a trusted event platform where emerging talent gets a professional stage, organized registration, audience reach, and partner visibility.", "flag"],
    ["Vision", "Make ATS a premium event-industry brand for talent discovery, fashion, performance, creator showcases, and managed live experiences.", "visibility"],
    ["Why Join ATS", "Participants can register across multiple talent categories, present their profile, connect with event teams, and become part of future ATS showcases.", "workspace_premium"],
    ["Venue", "3rd Floor, Orchid Centre, Rapid Metro Station, Near IILM Institute, Sector 53, Gurugram, Haryana 122002, India.", "location_on"]
  ];
  const faqs = [
    ["How to register?", "Use the Participate Now form and submit your basic details."],
    ["What is the age limit?", "Participants should be between 5 and 35 years old."],
    ["Which categories are available?", talentCategories.join(", ")],
    ["How do I contact support?", "Call or WhatsApp +91-79830 32984, or email Events@alphabusi.com."]
  ];

  return (
    <section className="mx-auto max-w-container-max px-margin-mobile py-16 md:px-margin-desktop">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, copy, icon]) => (
          <article key={title} className="rounded-lg border border-white/10 bg-[#101828] p-6">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-secondary-fixed-dim/12 text-secondary-fixed-dim">
              <Icon>{icon}</Icon>
            </div>
            <h3 className="font-headline text-2xl text-white">{title}</h3>
            <p className="mt-3 leading-relaxed text-on-surface-variant">{copy}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="font-label text-label-caps uppercase text-tertiary">FAQ</p>
          <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">Quick answers for participants.</h2>
        </div>
        <div className="grid gap-3">
          {faqs.map(([question, answer]) => (
            <article key={question} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <h3 className="font-bold text-white">{question}</h3>
              <p className="mt-2 text-on-surface-variant">{answer}</p>
            </article>
          ))}
        </div>
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
              <SafeImage loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" src={participant.image || fallbackImage} alt={participant.name} />
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
  const visibleEvents = events.length ? events : defaultEvents;
  return (
    <section id="events" className="border-y border-white/10 bg-[#101016] px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <p className="text-center font-label text-label-caps uppercase text-secondary-fixed-dim">Event Dates</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center font-headline text-headline-lg-mobile text-white md:text-headline-lg">Book your spot for upcoming ATS events.</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {visibleEvents.map((event) => (
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
        </div>
      </div>
    </section>
  );
}

function PastEvents() {
  const events = [
    ["Artist Talent Show Season 1", "ATS Event", "City to be announced", "Singer, dancer, model, actor, creator, writer, and open talent showcase.", IMAGES.past1],
    ["Meerut Runway Fashion Week Season 2", "Managed Event", "Meerut", "Runway and fashion event from the ATS managed-events portfolio.", IMAGES.past2],
    ["Grand Runway Night Season 1", "Managed Event", "City to be announced", "Premium runway night with event production and partner coordination.", IMAGES.past3],
    ["GIRFW Season 8", "Managed Event", "City to be announced", "Fashion event experience supported by ATS event planning.", IMAGES.past4]
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
                <SafeImage loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" src={image} alt={title} />
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
    ["Akshay Kumar", "Organizer", "event"],
    ["Gopal Saini", "Show Director", "campaign"],
    ["Ankit Saini", "Show Producer", "movie"],
    ["Ashish Chauhan", "Show Producer", "movie"],
    ["Rajnish Kumar", "Core Team", "groups"],
    ["Shivam Kumar", "Core Team", "groups"],
    ["Robin Panchal", "Core Team", "groups"],
    ["Surya Prakash", "Core Team", "groups"],
    ["Vikas Kashyap", "Core Team", "groups"],
    ["Anuj Soam", "Core Team", "groups"],
    ["Vishnat Chauhan", "Core Team", "groups"],
    ["Volunteer Team", "Remaining Team Members", "volunteer_activism"]
  ];
  return (
    <section id="team" className="mx-auto max-w-container-max px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-label text-label-caps uppercase text-secondary-fixed-dim">Organized By</p>
        <h2 className="mt-3 font-headline text-headline-lg-mobile text-white md:text-headline-lg">The teams behind ATS 2026 Season 1.</h2>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map(([name, role, icon]) => (
          <article key={name} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-lg border border-secondary-fixed-dim/30 bg-secondary-fixed-dim/15 text-secondary-fixed-dim">
              <Icon>{icon}</Icon>
            </div>
            <p className="font-headline text-xl text-white">{name}</p>
            <p className="mt-2 text-sm font-semibold text-tertiary">{role}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-on-surface-variant">Event Date: Coming Soon</p>
    </section>
  );
}

function TrustSection() {
  const recognition = [
    ["Past Work", "Use ATS brochure content and admin uploads for verified work."],
    ["Awards & Recognition", "Verified awards will be published after brochure review."],
    ["Sponsors & Partners", "Logos and names will come from the official ATS brochure."]
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
              {recognition.map(([title, copy]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-tertiary/15 text-tertiary">
                    <Icon>workspace_premium</Icon>
                  </div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="mt-2 text-sm text-on-surface-variant">{copy}</p>
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
      const brochureDownloads = (result.brochures || []).map((brochure) => ({ ...brochure, url: assetUrl(brochure.url) }));
      setDownloads(brochureDownloads);
      if (brochureDownloads[0]?.url) {
        const link = document.createElement("a");
        link.href = brochureDownloads[0].url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setStatus(brochureDownloads.length ? "Details saved. Download links are available below." : "Details saved. No brochure is available right now.");
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
    age: "",
    instagram: "",
    profession: "Dancer",
    image: "",
    active: false
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState("");

  if (!open) return null;

  function codeFor(profession) {
    const prefix = profession.slice(0, 3).toUpperCase();
    return `ATS-${prefix}-${Date.now().toString().slice(-5)}`;
  }

  async function submitParticipant(event) {
    event.preventDefault();
    const age = Number(form.age);
    if (age < 5 || age > 35) {
      setStatus("Age must be between 5 and 35.");
      return;
    }
    if (!photoFile) {
      setStatus("Please upload at least one portfolio photo.");
      return;
    }
    if (!videoFile) {
      setStatus("Please upload your 1 minute talent video.");
      return;
    }
    if (photoFile.size > maxPortfolioPhotoSize) {
      setStatus("Portfolio photo must be under 8 MB.");
      return;
    }
    if (videoFile.size > maxTalentVideoSize) {
      setStatus("Talent video must be under 75 MB.");
      return;
    }
    setStatus("Submitting your registration...");
    try {
      await api("/api/participants", {
        method: "POST",
        body: JSON.stringify({
          code: codeFor(form.profession),
          name: form.name,
          profession: form.profession,
          image: form.image,
          active: false,
          status: "Pending",
          age,
          instagram: form.instagram,
          phone: form.phone,
          email: form.email,
          city: form.city,
          photoFile: {
            fileName: photoFile.name,
            dataUrl: await readFileAsDataUrl(photoFile)
          },
          videoFile: {
            fileName: videoFile.name,
            dataUrl: await readFileAsDataUrl(videoFile)
          }
        })
      });
      setStatus("Registration saved. Admin approval is pending.");
      setForm({ name: "", phone: "", email: "", city: "", age: "", instagram: "", profession: "Dancer", image: "", active: false });
      setPhotoFile(null);
      setVideoFile(null);
      event.currentTarget.reset();
      await onCreated();
      setTimeout(onClose, 1200);
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
            {talentCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input required placeholder="Phone number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input required type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input required min="5" max="35" type="number" placeholder="Age (5-35)" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input required placeholder="Instagram ID" value={form.instagram} onChange={(event) => setForm({ ...form, instagram: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <input placeholder="Optional profile image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-secondary-fixed-dim" />
          <label className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-on-surface-variant">
            <span className="mb-2 block text-sm font-bold text-white">Portfolio photo</span>
            <input required type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} className="w-full text-sm" />
          </label>
          <label className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-on-surface-variant">
            <span className="mb-2 block text-sm font-bold text-white">1 minute talent video</span>
            <input required type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => setVideoFile(event.target.files?.[0] || null)} className="w-full text-sm" />
          </label>
        </div>

        <button className="mt-6 w-full rounded-lg bg-secondary-fixed-dim px-6 py-4 font-bold text-[#071013] hover:bg-white">Submit for Admin Approval</button>
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

function Footer({ brochureUrl = "", onBrochure }) {
  return (
    <footer className="border-t border-white/10 bg-[#08090d] px-margin-mobile py-16 md:px-margin-desktop">
      <div className="mx-auto grid max-w-container-max gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-display text-headline-lg-mobile font-extrabold text-white">ATS 2026</h2>
          <p className="mt-6 max-w-xs text-body-lg text-on-surface-variant">Alpha Wings Tech Group event platform for talent discovery, showcases, runway events, and managed live experiences.</p>
          <div className="mt-6 flex gap-3 text-secondary-fixed-dim">
            {[
              ["photo_camera", "https://www.instagram.com/atsshow.official/"],
              ["public", "https://www.facebook.com/profile.php?id=61590326891434"],
              ["smart_display", "https://www.youtube.com/@ArtistTalentShow"]
            ].map(([icon, href]) => (
              <a key={icon} href={href} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] transition hover:border-secondary-fixed-dim hover:bg-secondary-fixed-dim hover:text-[#071013]">
                <Icon>{icon}</Icon>
              </a>
            ))}
          </div>
        </div>
        <FooterLinks title="Quick Links" items={["Home", "Artists", "Sports", "Events", "Team"]} />
        <div>
          <h3 className="font-label text-label-caps uppercase text-tertiary">Contact</h3>
          <div className="mt-7 space-y-4 text-on-surface-variant">
            <p className="flex gap-3"><Icon className="text-secondary-fixed-dim">mail</Icon> Events@alphabusi.com</p>
            <p className="flex gap-3"><Icon className="text-secondary-fixed-dim">call</Icon> +91-79830 32984</p>
            <p className="flex gap-3"><Icon className="text-secondary-fixed-dim">chat</Icon> WhatsApp: +91-79830 32984</p>
            <p className="flex gap-3"><Icon className="text-secondary-fixed-dim">location_on</Icon> 3rd Floor, Orchid Centre, Sector 53, Gurugram, Haryana 122002</p>
          </div>
        </div>
        <div>
          <h3 className="font-label text-label-caps uppercase text-tertiary">YouTube</h3>
          <p className="mt-7 text-on-surface-variant">Follow the official Artist Talent Show YouTube channel for event videos and updates.</p>
          <div className="mt-5 grid gap-3">
            <a href="https://www.youtube.com/@ArtistTalentShow" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 font-bold text-on-surface-variant transition hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim">
              <Icon>smart_display</Icon>
              YouTube Channel
            </a>
            {brochureUrl && (
              <button onClick={onBrochure} className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-fixed-dim px-4 py-3 font-bold text-[#071013] transition hover:bg-white">
                <Icon>download</Icon>
                Download Brochure
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-container-max flex-col gap-3 border-t border-white/10 pt-8 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
        <p>Copyright 2026 Artist Talent Show Season 1. Alpha Wings Tech Group.</p>
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

function BrochurePage() {
  const [data, setData] = useState({ brochures: [], homepage: defaultHomepage });
  const [status, setStatus] = useState("Loading brochure...");

  useEffect(() => {
    api("/api/public")
      .then((result) => {
        setData(result);
        setStatus("");
      })
      .catch((error) => setStatus(error.message || "Brochure could not be loaded."));
  }, []);

  const brochure = data.brochures?.[0];
  const brochureUrl = brochure?.url ? assetUrl(brochure.url) : "";

  return (
    <main className="min-h-screen bg-[#050816] px-margin-mobile py-8 text-on-surface md:px-margin-desktop">
      <div className="mx-auto max-w-container-max">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-secondary-fixed-dim">
              <Icon className="text-base">arrow_back</Icon>
              Back to website
            </a>
            <p className="mt-6 font-label text-label-caps uppercase text-tertiary">ATS Brochure</p>
            <h1 className="mt-3 font-display text-display-lg-mobile text-white md:text-display-lg">Artist Talent Show Brochure</h1>
            <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">View, download, or open the latest published ATS brochure.</p>
          </div>
          {brochureUrl && (
            <div className="flex flex-wrap gap-3">
              <a href={brochureUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 font-bold text-on-surface-variant transition hover:border-secondary-fixed-dim hover:text-secondary-fixed-dim">
                <Icon>open_in_new</Icon>
                Open New Tab
              </a>
              <a href={brochureUrl} download className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-fixed-dim px-5 py-3 font-bold text-[#071013] transition hover:bg-white">
                <Icon>download</Icon>
                Download
              </a>
            </div>
          )}
        </div>

        <section className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-[#101828]">
          {brochureUrl ? (
            <>
              <div className="flex flex-col gap-2 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-white">{brochure.title || "ATS Brochure"}</p>
                  <p className="text-sm text-on-surface-variant">{brochure.fileName}</p>
                </div>
                <p className="text-sm text-on-surface-variant">Mobile friendly PDF viewer</p>
              </div>
              <iframe title={brochure.title || "ATS Brochure"} src={brochureUrl} className="h-[72vh] w-full bg-white" />
              <div className="border-t border-white/10 p-4 text-sm text-on-surface-variant">
                If the PDF viewer does not appear on your device, use Open New Tab or Download.
              </div>
            </>
          ) : (
            <p className="p-8 text-center text-on-surface-variant">{status || "No brochure is published right now."}</p>
          )}
        </section>
      </div>
    </main>
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
  const [data, setData] = useState({ participants: [], sports: [], events: [], brochures: [] });
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [participantOpen, setParticipantOpen] = useState(false);
  const [bookingEvent, setBookingEvent] = useState(null);

  async function refreshPublicData() {
    setData(await api("/api/public"));
  }

  useEffect(() => {
    refreshPublicData().catch(() => setData({ participants: [], sports: [], events: [], brochures: [] }));
  }, []);

  const hasBrochures = (data.brochures || []).length > 0;
  const brochureUrl = data.brochures?.[0]?.url ? assetUrl(data.brochures[0].url) : "";
  const viewBrochure = () => {
    window.location.href = "/brochure";
  };

  return (
    <>
      <Header onBrochure={() => setBrochureOpen(true)} onViewBrochure={viewBrochure} showBrochure={hasBrochures} />
      <main>
        <Hero homepage={data.homepage} onBrochure={() => setBrochureOpen(true)} onViewBrochure={viewBrochure} onParticipate={() => setParticipantOpen(true)} showBrochure={hasBrochures} />
        <WhoWeAre />
        <Essentials />
        <Stats participants={data.participants} sports={data.sports} />
        <StarAlumni participants={data.participants} />
        <SportsList sports={data.sports} />
        <EventSchedule events={data.events} onBook={setBookingEvent} />
        <Participate onParticipate={() => setParticipantOpen(true)} />
        <PastEvents />
        <Organizers />
        <TrustSection />
      </main>
      <Footer brochureUrl={brochureUrl} onBrochure={() => setBrochureOpen(true)} />
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
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [status, setStatus] = useState("");

  async function refresh() {
    const nextDb = await api("/api/admin");
    setDb(nextDb);
    setSelectedLeadIds((ids) => ids.filter((id) => nextDb.leads.some((lead) => lead.id === id)));
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

  async function updateParticipantStatus(item, nextStatus) {
    const isApproved = nextStatus === "Approved";
    await api(`/api/participants/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: nextStatus, active: isApproved })
    });
    setStatus(`${item.name} marked as ${nextStatus}.`);
    await refresh();
  }

  async function remove(collection, id) {
    await api(`/api/${collection}/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function saveAdditionalBrochure(submitEvent) {
    submitEvent.preventDefault();
    try {
      if (!brochureForm.id && !brochureFile) {
        setStatus("Please choose a PDF brochure file.");
        return;
      }
      if (brochureFile && brochureFile.type !== "application/pdf") {
        setStatus("Please upload a PDF file only.");
        return;
      }
      if (brochureFile && brochureFile.size > maxBrochureSize) {
        setStatus("PDF is too large. Please upload a file under 30 MB.");
        return;
      }
      setStatus(brochureForm.id ? "Updating brochure..." : "Saving brochure...");
      const filePayload = brochureFile
        ? {
            fileName: brochureFile.name,
            dataUrl: await readFileAsDataUrl(brochureFile)
          }
        : {};
      const payload = {
        title: brochureForm.title || brochureFile?.name || "ATS 2026 Brochure",
        active: brochureForm.active,
        ...filePayload
      };
      if (brochureForm.id) {
        await api(`/api/brochures/${brochureForm.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setStatus("Brochure updated successfully.");
      } else {
        await api("/api/brochures", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setStatus("Brochure saved successfully.");
      }
      setBrochureForm(emptyBrochure);
      setBrochureFile(null);
      submitEvent.currentTarget.reset();
      await refresh();
    } catch (error) {
      setStatus(error.message || "Brochure could not be saved.");
    }
  }

  async function toggleBrochure(brochure) {
    await api(`/api/brochures/${brochure.id}`, {
      method: "PUT",
      body: JSON.stringify({ active: !brochure.active })
    });
    await refresh();
  }

  async function removeBrochure(id) {
    try {
      if (!window.confirm("Delete this brochure permanently?")) return;
      await api(`/api/brochures/${id}`, { method: "DELETE" });
      setStatus("Brochure deleted successfully.");
      await refresh();
    } catch (error) {
      setStatus(error.message || "Brochure could not be deleted.");
    }
  }

  async function deleteLead(id) {
    try {
      if (!window.confirm("Delete this brochure lead permanently?")) return;
      await api(`/api/leads/${id}`, { method: "DELETE" });
      setStatus("Lead deleted successfully.");
      await refresh();
    } catch (error) {
      setStatus(error.message || "Lead could not be deleted.");
    }
  }

  async function deleteSelectedLeads() {
    try {
      if (!selectedLeadIds.length) {
        setStatus("Select at least one lead to delete.");
        return;
      }
      if (!window.confirm(`Delete ${selectedLeadIds.length} selected lead(s) permanently?`)) return;
      const result = await api("/api/leads/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids: selectedLeadIds })
      });
      setStatus(`${result.deleted || selectedLeadIds.length} lead(s) deleted successfully.`);
      setSelectedLeadIds([]);
      await refresh();
    } catch (error) {
      setStatus(error.message || "Selected leads could not be deleted.");
    }
  }

  function toggleLeadSelection(id) {
    setSelectedLeadIds((ids) => ids.includes(id) ? ids.filter((leadId) => leadId !== id) : [...ids, id]);
  }

  function toggleAllLeads(checked) {
    setSelectedLeadIds(checked ? db.leads.map((lead) => lead.id) : []);
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
          <AdminStat label="Pending" value={db.participants.filter((item) => (item.status || "Pending") === "Pending").length} />
          <AdminStat label="Approved" value={db.participants.filter((item) => (item.status || (item.active ? "Approved" : "Pending")) === "Approved").length} />
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
            <ParticipantReviewList items={db.participants} onStatus={updateParticipantStatus} onRemove={(id) => remove("participants", id)} />
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
                    <p>{brochure.active ? "Visible after popup" : "Hidden"} {brochure.fileAvailable === false ? "| File missing" : ""}</p>
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
              <div className="flex flex-wrap gap-2">
                <button onClick={refresh} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-secondary-fixed-dim">Refresh Leads</button>
                <button onClick={deleteSelectedLeads} disabled={!selectedLeadIds.length} className="inline-flex items-center gap-2 rounded-lg border border-red-400/30 px-4 py-2 text-sm font-bold text-red-300 disabled:cursor-not-allowed disabled:opacity-40">
                  <Icon className="text-base">delete</Icon>
                  Delete Selected
                </button>
              </div>
            </div>
            <div className="mt-3 max-h-96 overflow-auto rounded-lg border border-white/10">
              {!!db.leads.length && (
                <label className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-on-surface-variant">
                  <input type="checkbox" checked={selectedLeadIds.length === db.leads.length} onChange={(event) => toggleAllLeads(event.target.checked)} />
                  Select all leads
                </label>
              )}
              {db.leads.map((lead) => (
                <div key={lead.id} className="grid gap-3 border-b border-white/10 p-4 last:border-b-0 sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <input aria-label={`Select lead ${lead.name}`} type="checkbox" checked={selectedLeadIds.includes(lead.id)} onChange={() => toggleLeadSelection(lead.id)} />
                  <div>
                    <p className="font-bold text-white">{lead.name} <span className="text-sm text-tertiary">({lead.interest})</span></p>
                    <p className="text-sm text-on-surface-variant">{lead.email} | {lead.phone} | {lead.city || "No city"}</p>
                    {lead.createdAt && <p className="mt-1 text-xs text-on-surface-variant">{new Date(lead.createdAt).toLocaleString()}</p>}
                  </div>
                  <button onClick={() => deleteLead(lead.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/30 px-3 py-2 text-sm font-bold text-red-300 transition hover:bg-red-400/10" aria-label={`Delete lead ${lead.name}`}>
                    <Icon className="text-base">delete</Icon>
                    Delete
                  </button>
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

function ParticipantReviewList({ items, onStatus, onRemove }) {
  return (
    <div className="mt-5 grid gap-4">
      {items.map((item) => {
        const status = item.status || (item.active ? "Approved" : "Pending");
        return (
          <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-bold text-white">{item.name}</p>
                  <span className={`rounded px-3 py-1 text-xs font-bold ${status === "Approved" ? "bg-secondary-fixed-dim text-[#071013]" : status === "Rejected" ? "bg-red-400/15 text-red-300" : "bg-tertiary/15 text-tertiary"}`}>{status}</span>
                </div>
                <p className="mt-2 text-sm text-on-surface-variant">{item.code} | {item.profession} | Age {item.age || "N/A"}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{item.email || "No email"} | {item.phone || "No phone"} | {item.city || "No city"}</p>
                {item.instagram && <p className="mt-1 text-sm text-on-surface-variant">Instagram: {item.instagram}</p>}
                <div className="mt-3 flex flex-wrap gap-3">
                  {item.portfolioPhoto && (
                    <a href={assetUrl(item.portfolioPhoto)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm font-bold text-secondary-fixed-dim">
                      <Icon className="text-base">image</Icon>
                      Photo
                    </a>
                  )}
                  {item.talentVideo && (
                    <a href={assetUrl(item.talentVideo)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-white/10 px-3 py-2 text-sm font-bold text-secondary-fixed-dim">
                      <Icon className="text-base">play_circle</Icon>
                      Video
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => onStatus(item, "Approved")} className="rounded border border-secondary-fixed-dim/40 px-3 py-2 text-sm font-bold text-secondary-fixed-dim">Approve</button>
                <button onClick={() => onStatus(item, "Rejected")} className="rounded border border-red-400/30 px-3 py-2 text-sm font-bold text-red-300">Reject</button>
                <button onClick={() => onStatus(item, "Pending")} className="rounded border border-white/10 px-3 py-2 text-sm font-bold text-on-surface-variant">Pending</button>
                <button onClick={() => onRemove(item.id)} className="rounded border border-white/10 px-3 py-2 text-sm font-bold text-tertiary">Remove</button>
              </div>
            </div>
          </article>
        );
      })}
      {!items.length && <p className="rounded-lg border border-white/10 p-4 text-on-surface-variant">No participant registrations yet.</p>}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      {window.location.pathname.startsWith("/admin") ? <AdminDashboard /> : window.location.pathname.startsWith("/brochure") ? <BrochurePage /> : <PublicSite />}
    </ErrorBoundary>
  );
}
