"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  PortfolioCMSData,
  FeaturedProjectItem,
  ProjectItem,
} from "@/lib/cms";

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ width: "16px", height: "16px", flexShrink: 0 }}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function PortfolioClient({
  initialData,
}: {
  initialData: PortfolioCMSData;
}) {
  const {
    profile,
    featuredProjects,
    projects,
    experience,
    certifications,
  } = initialData;

  const [hours, setHours] = useState("--");
  const [minutes, setMinutes] = useState("--");
  const [seconds, setSeconds] = useState("--");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | FeaturedProjectItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).formatToParts(now);

      const h = parts.find((p) => p.type === "hour")?.value || "--";
      const m = parts.find((p) => p.type === "minute")?.value || "--";
      const s = parts.find((p) => p.type === "second")?.value || "--";

      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedProject) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedProject]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.items.map((p) => p.category)));
    return ["All", ...cats];
  }, [projects.items]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects.items;
    return projects.items.filter((p) => p.category === activeCategory);
  }, [projects.items, activeCategory]);

  function handleCopyEmail() {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  }

  return (
    <>
      <main className="frame">
        {/* Header Bar */}
        <header>
          <a href="#about" className="hello" aria-label="Halo! Kembali ke atas">
            <span className="greet">
              <span>Halo!</span>
            </span>
          </a>
          <div className="header-right">
            <a className="status" href="#contact">
              <i className="status-dot" aria-hidden="true" />
              <span className="status-flip">
                <span>Available for work</span>
                <span aria-hidden="true">Hubungi Saya →</span>
              </span>
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <div className="hero" id="about">
          <div>
            <div className="id">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarImage || "/assets/images/profile/avatar-1.png"}
                alt={profile.name}
                width="80"
                height="80"
                className="avatar"
                style={{ objectFit: "cover", objectPosition: "50% 30%" }}
              />
              <div className="avatar-pop" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatarImage || "/assets/images/profile/avatar-1.png"}
                  alt=""
                  width="260"
                  height="340"
                  style={{ objectFit: "cover", objectPosition: "50% 30%", borderRadius: "14px" }}
                />
                <span className="avatar-chip">Ray Ardika • S.Kom</span>
              </div>
              <h1 className="name">{profile.displayTitle || profile.name}</h1>
            </div>

            <p className="tagline">
              Full-Stack Web Developer yang merancang, membangun, dan menerbitkan sistem web responsif dengan <strong>Laravel</strong> & <strong>Next.js</strong>, sistem operasional QR check-in, dan model vision AI.
            </p>

            <p className="tagline">
              Telah mengembangkan sistem operasional di{" "}
              <a
                className="org c3"
                href="#projects"
                style={{ "--brand": "#f0a500" } as React.CSSProperties}
              >
                <strong>SPMS Lapas & UBSI Ticketing</strong>
              </a>
            </p>

            <div className="hero-meta">
              <div className="socials">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                  style={{ "--brand": "var(--btn)" } as React.CSSProperties}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  style={{ "--brand": "#0a66c2" } as React.CSSProperties}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  title="Email"
                  style={{ "--brand": "var(--btn)" } as React.CSSProperties}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  style={{ "--brand": "#25d366" } as React.CSSProperties}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </a>
              </div>

              <div className="where">
                <small>Based in Tangerang, ID</small>
                <b>
                  <span className="digit">{hours}</span>
                  <span className="digit">:</span>
                  <span className="digit">{minutes}</span>
                  <span className="sec">
                    <span className="digit">:</span>
                    <span className="digit">{seconds}</span>
                  </span>{" "}
                  <span className="tz">WIB</span>
                </b>
              </div>
            </div>
          </div>

          {/* Interactive Hero Shots (Laptop, Code, Phone) */}
          <div className="shots" aria-hidden="true">
            <div className="dev dev-laptop">
              <div className="laptop">
                <div className="screen" style={{ background: "#fdfdfc", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e6e5df", paddingBottom: "8px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#262510" }}>Fotodarikamu</span>
                    <span style={{ fontSize: "10px", background: "#e8f4fc", color: "#1668a6", padding: "2px 6px", borderRadius: "4px" }}>QRIS Live</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#57564c", lineHeight: 1.4 }}>
                    Multi-event photography platform with automated QRIS webhook payment verification.
                  </p>
                  <div style={{ marginTop: "10px", display: "flex", gap: "4px" }}>
                    <span style={{ fontSize: "9px", background: "#f6f6f3", border: "1px solid #e6e5df", padding: "2px 6px", borderRadius: "4px" }}>Next.js</span>
                    <span style={{ fontSize: "9px", background: "#f6f6f3", border: "1px solid #e6e5df", padding: "2px 6px", borderRadius: "4px" }}>Midtrans</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dev dev-code">
              <div className="code" style={{ "--done": "6180ms" } as React.CSSProperties}>
                <div className="code-bar">
                  <span>ray.ts</span>
                  <b>✓ Deployed</b>
                </div>
                <span className="ln"><span className="k">const </span><span>ray</span><span> = &#123;</span></span>
                <span className="ln"><span className="p">  role</span>: <span className="s">&quot;Full-Stack Dev&quot;</span>,</span>
                <span className="ln"><span className="p">  stack</span>: [<span className="s">&quot;Laravel&quot;</span>, <span className="s">&quot;Next.js&quot;</span>],</span>
                <span className="ln"><span className="p">  aiResearch</span>: <span className="s">&quot;Computer Vision&quot;</span>,</span>
                <span className="ln"><span>&#125;;</span></span>
                <span className="ln"><span className="f">deploy</span>(ray);<span className="c"> // production ready</span><i className="caret" /></span>
              </div>
            </div>

            <div className="dev dev-phone">
              <div className="phone">
                <div className="screen" style={{ background: "#262510", color: "#ffffff", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#2f9e5b", fontWeight: 700, marginBottom: "4px" }}>• GATE ACTIVE</div>
                    <div style={{ fontSize: "12px", fontWeight: 700 }}>SPMS Check-in</div>
                    <p style={{ fontSize: "9px", color: "#c2cdd2", marginTop: "4px" }}>
                      Visitor verified via encrypted QR token.
                    </p>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "6px", fontSize: "9px", color: "#2f9e5b" }}>
                    ✓ 0.4s response
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What I Do / Manifesto Section */}
        <section className="manifesto">
          <span className="eyebrow">What I do</span>
          <p className="manifesto-text">
            Berikan saya masalah nyata, bukan sekadar tumpukan teknologi. Saya{" "}
            <span className="m-verb">
              <span className="m-chip" style={{ "--c": "#ff6a3d", "--r": "-8deg" } as React.CSSProperties} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path className="i-draw" d="M3 15c2.5-7 5.5-7 6.5-2.5S14 17 16 10.5s4-4.5 5-2" pathLength="1" /></svg>
              </span>
              desain
            </span>{" "}
            arsitekturnya,{" "}
            <span className="m-verb">
              <span className="m-chip" style={{ "--c": "#6d5dfc", "--r": "6deg" } as React.CSSProperties} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path className="i-l" d="M8 7l-5 5 5 5" /><path className="i-r" d="M16 7l5 5-5 5" /><path d="M13.5 5l-3 14" /></svg>
              </span>
              bangun
            </span>{" "}
            kodenya,{" "}
            <span className="m-verb">
              <span className="m-chip" style={{ "--c": "#2f9e5b", "--r": "-5deg" } as React.CSSProperties} aria-hidden="true">
                <svg viewBox="0 0 24 24"><circle cx="4.5" cy="12" r="2.5" /><circle cx="19.5" cy="12" r="2.5" /><path d="M7 12h10" /><circle className="i-dot" cx="9" cy="12" r="1.8" /></svg>
              </span>
              integrasikan
            </span>{" "}
            basis data dan API-nya, lalu{" "}
            <span className="m-verb">
              <span className="m-chip" style={{ "--c": "#1d8fe8", "--r": "7deg" } as React.CSSProperties} aria-hidden="true">
                <svg viewBox="0 0 24 24"><path className="i-ship" d="M7 17 17 7M9 7h8v8" /></svg>
              </span>
              terbitkan
            </span>{" "}
            ke server produksi. Tanpa alasan.{" "}
            <span className="mark">Hanya produk yang bekerja stabil.</span>
          </p>

          <ul className="platforms" aria-label="Spesialisasi Teknologi">
            <li style={{ "--g": "#1d8fe8" } as React.CSSProperties}>
              <svg viewBox="0 0 64 40" aria-hidden="true"><rect x="4" y="3" width="56" height="34" rx="4" /><path d="M4 10h56" /></svg>
              <span>Web Apps (Laravel & Next.js)</span>
            </li>
            <li style={{ "--g": "#ff6a3d" } as React.CSSProperties}>
              <svg viewBox="0 0 64 40" aria-hidden="true"><rect x="21" y="2" width="22" height="36" rx="5" /></svg>
              <span>Operational QR Systems</span>
            </li>
            <li style={{ "--g": "#2f9e5b" } as React.CSSProperties}>
              <svg viewBox="0 0 64 40" aria-hidden="true"><circle cx="32" cy="20" r="12" /></svg>
              <span>Deep Learning & Vision AI</span>
            </li>
            <li style={{ "--g": "#6d5dfc" } as React.CSSProperties}>
              <svg viewBox="0 0 64 40" aria-hidden="true"><rect x="6" y="6" width="52" height="28" rx="4" /></svg>
              <span>RESTful APIs & Payments</span>
            </li>
          </ul>
        </section>

        {/* Featured Projects (Selected Work) */}
        <section id="work" className="work">
          <div className="head">
            <span className="eyebrow">Selected work</span>
            <h2 className="h2">{featuredProjects.sectionTitle}</h2>
            <p className="sub">{featuredProjects.sectionSubtitle}</p>
          </div>

          <div className="stack">
            {featuredProjects.items.map((item, idx) => (
              <article key={item.id} className="stack-card" style={{ "--i": idx } as React.CSSProperties}>
                <div className="stack-inner">
                  <div className="stack-info">
                    <div className="stack-top">
                      <span>0{idx + 1} / 0{featuredProjects.items.length}</span>
                      <span>{item.period}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <div className="tags">
                      {item.stack.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="stack-links" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                      {item.liveUrl && (
                        <a
                          className="btn primary"
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="roll"><span>Visit site</span></span>
                          <ArrowUpRight />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedProject(item)}
                        className="btn"
                        style={{ cursor: "pointer" }}
                      >
                        <span className="roll"><span>Studi Kasus</span></span>
                      </button>
                    </div>
                  </div>

                  <div
                    className="stack-visual"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: idx % 2 === 0 ? "linear-gradient(135deg, #f7e0a3, #f4b711)" : "linear-gradient(135deg, #d2e4ff, #8ec2ff)",
                      padding: "24px",
                      borderRadius: "16px",
                      minHeight: "260px",
                    }}
                  >
                    <div
                      style={{
                        background: "#ffffff",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                        maxWidth: "340px",
                        width: "100%",
                      }}
                    >
                      <div style={{ display: "flex", gap: "5px", marginBottom: "12px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ff5f56" }} />
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ffbd2e" }} />
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#27c93f" }} />
                      </div>
                      <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#262510", marginBottom: "4px" }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: "12px", color: "#57564c", lineHeight: 1.4 }}>
                        {item.client} • {item.status}
                      </p>
                      <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {item.stack.slice(0, 3).map((st) => (
                          <span key={st} style={{ fontSize: "10px", background: "#f6f6f3", padding: "2px 6px", borderRadius: "4px", color: "#262510", fontWeight: 600 }}>
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section id="experience">
          <div className="head">
            <h2 className="h2">{experience.sectionTitle}</h2>
            <p className="sub">{experience.sectionSubtitle}</p>
          </div>

          <ol className="xp">
            {experience.experiences.map((exp, idx) => (
              <li key={exp.id}>
                <div className="xp-logos">
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      background: "var(--card)",
                      border: "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "14px",
                      color: "var(--ink)",
                    }}
                  >
                    0{idx + 1}
                  </div>
                </div>
                <div>
                  <h3>
                    {exp.role} <span>· {exp.organization}</span>
                    {idx === 0 && <span className="now">Now</span>}
                  </h3>
                  <p style={{ margin: "4px 0 10px 0", fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>
                    📍 {exp.location} • {exp.period} • {exp.type}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 12px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} style={{ fontSize: "14px", color: "var(--ink)", lineHeight: 1.5, display: "flex", gap: "8px" }}>
                        <span style={{ color: "var(--accent-green)", flexShrink: 0 }}>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="tags">
                    {exp.stack.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* All Projects Archive (Filterable) */}
        <section style={{ paddingTop: "24px", paddingBottom: "56px" }}>
          <div className="head">
            <span className="eyebrow">Arsip Lengkap</span>
            <h2 className="h2">Eksplorasi Proyek Lainnya</h2>
            <p className="sub">Semua sistem web, integrasi QRIS, dan riset deep learning yang telah diselesaikan.</p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="btn"
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  borderRadius: "999px",
                  cursor: "pointer",
                  background: activeCategory === cat ? "var(--btn)" : "var(--frame)",
                  color: activeCategory === cat ? "var(--btn-ink)" : "var(--ink)",
                  border: "1px solid var(--line)",
                }}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                style={{
                  background: "var(--frame)",
                  border: "1px solid var(--line)",
                  borderRadius: "14px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>
                  <span>{p.period}</span>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>{p.status}</span>
                </div>
                <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--ink)", marginBottom: "6px" }}>
                  {p.title}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, marginBottom: "12px" }}>
                  {p.summary}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {p.stack.slice(0, 3).map((st) => (
                    <span key={st} style={{ fontSize: "11px", background: "var(--card)", padding: "2px 6px", borderRadius: "4px", color: "var(--muted)" }}>
                      #{st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" style={{ paddingBottom: "56px" }}>
          <div className="head">
            <span className="eyebrow">Kredensial Resmi</span>
            <h2 className="h2">{certifications.sectionTitle}</h2>
            <p className="sub">{certifications.sectionSubtitle}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {certifications.items.map((cert) => (
              <div
                key={cert.id}
                style={{
                  background: "var(--frame)",
                  border: "1px solid var(--line)",
                  borderRadius: "14px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 700, color: "var(--ink)" }}>{cert.category}</span>
                    <span>{cert.date}</span>
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--ink)", marginBottom: "4px" }}>
                    {cert.title}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600, marginBottom: "8px" }}>
                    {cert.issuer}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.5 }}>
                    {cert.description}
                  </p>
                </div>
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", marginTop: "16px" }}>
                  <a
                    href={cert.credentialUrl || profile.cvPath}
                    target={cert.credentialUrl ? "_blank" : undefined}
                    rel={cert.credentialUrl ? "noopener noreferrer" : undefined}
                    download={!cert.credentialUrl ? true : undefined}
                    style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>{cert.credentialUrl ? "Verifikasi Kredensial" : "Lihat di Berkas CV"}</span>
                    <ArrowUpRight />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About / Philosophy Section */}
        <section>
          <div className="about">
            <div className="about-copy">
              <span className="eyebrow">About me</span>
              <h2 className="h2">A designer&apos;s eye, an engineer&apos;s hands.</h2>
              <p>
                Halo! Saya Ray Ardika Raihan, lulusan Sarjana Komputer (S.Kom) Informatika dengan IPK 3.86/4.00. Saya terbiasa bertanggung jawab atas keseluruhan siklus hidup perangkat lunak, mulai dari perancangan arsitektur basis data, integrasi payment gateway QRIS, hingga konfigurasi server HTTPS produksi.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <b>3.86</b>
                <small>IPK Kumulatif (Skala 4.00)</small>
              </div>
              <div className="stat">
                <b>5+</b>
                <small>Sistem Web & Operasional Produksi</small>
              </div>
              <div className="stat">
                <b>685</b>
                <small>Skor Resmi TOEIC</small>
              </div>
              <div className="stat">
                <b>BNSP</b>
                <small>Sertifikasi Kompetensi Software Engineer</small>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Footer Section */}
        <section className="contact" id="contact">
          <div className="contact-copy">
            <span className="eyebrow">Contact</span>
            <h2 className="contact-title">Let&apos;s build something great together.</h2>
            <p className="sub">
              Website operasional, aplikasi enterprise, atau riset computer vision? Apapun yang sedang Anda bangun, pintu kolaborasi saya terbuka.
            </p>
            <div className="ctas">
              <a className="btn primary" href={`mailto:${profile.email}`}>
                <span className="roll"><span>{profile.email}</span></span>
              </a>
              <button className="btn" type="button" onClick={handleCopyEmail}>
                <span className="roll"><span>{copiedEmail ? "✓ Email Disalin!" : "Salin Email"}</span></span>
              </button>
              <a className="btn" href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                <span className="roll"><span>WhatsApp</span></span>
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid var(--line)", padding: "28px 0", marginTop: "40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", fontSize: "13px", color: "var(--muted)" }}>
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 600 }}>GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 600 }}>LinkedIn</a>
            <a href="/admin" style={{ color: "var(--muted)", textDecoration: "none" }}>Portal Konten</a>
          </div>
        </footer>
      </main>

      {/* Case Study Modal Dialog */}
      <dialog
        ref={dialogRef}
        className="albert-modal"
        onClose={() => setSelectedProject(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setSelectedProject(null);
        }}
      >
        {selectedProject && (
          <div style={{ padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                  {selectedProject.status} • {selectedProject.period}
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--ink)", margin: "4px 0 0 0" }}>
                  {selectedProject.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 0 0" }}>
                  {selectedProject.client}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "15px", color: "var(--ink)", lineHeight: 1.6, marginBottom: "24px" }}>
              {selectedProject.summary}
            </p>

            {("highlights" in selectedProject && selectedProject.highlights) && (
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", marginBottom: "10px" }}>
                  Pencapaian & Hasil Kerja Utama:
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedProject.highlights.map((h, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--accent-green)", marginTop: "2px", flexShrink: 0 }}>•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {("deliverables" in selectedProject && selectedProject.deliverables) && (
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)", marginBottom: "10px" }}>
                  Cakupan Teknis & Deliverables:
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedProject.deliverables.map((d, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                      <span style={{ color: "var(--accent-green)", marginTop: "2px", flexShrink: 0 }}>•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginBottom: "24px" }}>
              <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", marginBottom: "8px" }}>
                Teknologi yang Digunakan:
              </h4>
              <div className="tags">
                {selectedProject.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary"
                  style={{ fontSize: "13px", padding: "8px 18px" }}
                >
                  <span className="roll"><span>Kunjungi Demo</span></span>
                  <ArrowUpRight />
                </a>
              )}
              {selectedProject.repoUrl && (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ fontSize: "13px", padding: "8px 18px" }}
                >
                  <span className="roll"><span>GitHub Repo</span></span>
                  <ArrowUpRight />
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="btn"
                style={{ fontSize: "13px", padding: "8px 18px", cursor: "pointer" }}
              >
                <span className="roll"><span>Tutup</span></span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
