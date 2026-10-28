"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  PortfolioCMSData,
  FeaturedProjectItem,
  ProjectItem,
} from "@/lib/cms";

function ArrowUpRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
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
    faq,
  } = initialData;

  const [activeProjectTab, setActiveProjectTab] = useState<string>("All");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | FeaturedProjectItem | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Live real-time clock for Tangerang (GMT+7 / WIB)
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat("id-ID", options).format(now));
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Modal dialog synchronization
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
    if (activeProjectTab === "All") return projects.items;
    return projects.items.filter((p) => p.category === activeProjectTab);
  }, [projects.items, activeProjectTab]);

  function handleCopyEmail() {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  }

  return (
    <div className="min-h-screen">
      {/* 1. Header Bar */}
      <header className="site-container">
        <div className="header-bar">
          <a href="#about" className="badge-pill" aria-label="Halo! Kembali ke atas">
            <span style={{ fontSize: "14px" }}>👋</span>
            <span>Halo!</span>
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="badge-pill" style={{ fontFamily: "var(--font-mono-var)", fontSize: "12px" }}>
              <span>Tangerang</span>
              <span style={{ color: "var(--muted)" }}>•</span>
              <span>{currentTime ? `${currentTime} WIB` : "GMT+7"}</span>
            </div>

            <a href="#contact" className="badge-pill" style={{ border: "1px solid #cce5d6" }}>
              <span className="status-dot" />
              <span style={{ fontWeight: 700, color: "var(--accent-green)" }}>Available for work</span>
            </a>
          </div>
        </div>
      </header>

      <main className="site-container">
        {/* 2. Hero Section */}
        <section id="about" style={{ paddingTop: "32px", paddingBottom: "56px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "40px", alignItems: "center" }}>
            {/* Left: Bio & Identity */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatarImage || "/assets/images/profile/avatar-1.png"}
                  alt={profile.name}
                  width="72"
                  height="72"
                  style={{
                    borderRadius: "50%",
                    border: "2px solid var(--line-dark)",
                    objectFit: "cover",
                    boxShadow: "var(--shadow-sm)",
                  }}
                />
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                    {profile.name}
                  </h1>
                  <p style={{ fontSize: "14px", color: "var(--muted)", fontWeight: 600, marginTop: "2px" }}>
                    {profile.role}
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "17px", color: "var(--ink)", lineHeight: 1.6, marginBottom: "24px" }}>
                Full-Stack Web Developer yang merancang, membangun, dan menerbitkan aplikasi web responsif menggunakan <strong>Laravel</strong> & <strong>Next.js</strong>, sistem operasional QR check-in, dan model deep learning computer vision.
              </p>

              {/* Action buttons & Socials */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                <a href="#contact" className="btn-primary">
                  <span>Hubungi Saya</span>
                  <ArrowUpRightIcon />
                </a>

                <a href={profile.cvPath} download className="btn-secondary">
                  <span>Download CV (PDF)</span>
                  <ArrowUpRightIcon />
                </a>

                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge-pill"
                  aria-label="GitHub Profile"
                >
                  <span>GitHub</span>
                  <ArrowUpRightIcon />
                </a>

                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge-pill"
                  aria-label="LinkedIn Profile"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRightIcon />
                </a>
              </div>
            </div>

            {/* Right: Code Terminal Card (ray.ts) */}
            <div>
              <div
                style={{
                  background: "#1c1c1a",
                  color: "#f6f6f3",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #333330",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md)",
                  fontFamily: "var(--font-mono-var)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 16px",
                    background: "#242422",
                    borderBottom: "1px solid #333330",
                    fontSize: "12px",
                    color: "#999990",
                  }}
                >
                  <span>ray.ts</span>
                  <span style={{ color: "#74d99f", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#74d99f" }} />
                    Deployed
                  </span>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <p style={{ color: "#8a8a84", marginBottom: "4px" }}>// Professional Profile State</p>
                  <p><span style={{ color: "#ff7b72" }}>const</span> engineer = &#123;</p>
                  <p style={{ paddingLeft: "16px" }}><span style={{ color: "#79c0ff" }}>name</span>: <span style={{ color: "#a5d6ff" }}>&quot;Ray Ardika Raihan&quot;</span>,</p>
                  <p style={{ paddingLeft: "16px" }}><span style={{ color: "#79c0ff" }}>degree</span>: <span style={{ color: "#a5d6ff" }}>&quot;S.Kom (IPK 3.86/4.00)&quot;</span>,</p>
                  <p style={{ paddingLeft: "16px" }}><span style={{ color: "#79c0ff" }}>focus</span>: [<span style={{ color: "#a5d6ff" }}>&quot;Laravel&quot;</span>, <span style={{ color: "#a5d6ff" }}>&quot;Next.js&quot;</span>, <span style={{ color: "#a5d6ff" }}>&quot;Vision AI&quot;</span>],</p>
                  <p style={{ paddingLeft: "16px" }}><span style={{ color: "#79c0ff" }}>availableForProjects</span>: <span style={{ color: "#79c0ff" }}>true</span>,</p>
                  <p>&#125;;</p>
                  <p style={{ marginTop: "10px" }}><span style={{ color: "#d2a8ff" }}>deploy</span>(engineer); <span style={{ color: "#8a8a84" }}>// Production ready</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Manifesto / Platform Tags */}
        <section style={{ paddingBottom: "64px" }}>
          <div
            style={{
              background: "var(--frame)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              padding: "28px 32px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span className="eyebrow">Filosofi Pengerjaan</span>
            <p style={{ fontSize: "19px", fontWeight: 700, color: "var(--ink)", lineHeight: 1.5, marginBottom: "20px" }}>
              Berikan saya masalah, bukan hanya daftar tumpukan teknologi. Saya merancang arsitekturnya, membangun kodenya, mengintegrasikan alur bisnisnya, dan menerbitkannya hingga siap pakai di server produksi.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <span className="tag-chip" style={{ background: "#e8f4fc", borderColor: "#c2e2fa", color: "#1668a6" }}>
                🖥️ Web Application (Laravel & Next.js)
              </span>
              <span className="tag-chip" style={{ background: "#edf7f0", borderColor: "#c4e8ce", color: "#1e683b" }}>
                ⚡ Operational Systems (QR & Check-in)
              </span>
              <span className="tag-chip" style={{ background: "#f5f0fd", borderColor: "#dfccfa", color: "#542ea6" }}>
                🤖 Deep Learning (U-Net & Computer Vision)
              </span>
              <span className="tag-chip" style={{ background: "#fff7eb", borderColor: "#fae1b8", color: "#9c5b05" }}>
                💳 Payment Integration (QRIS & Midtrans)
              </span>
            </div>
          </div>
        </section>

        {/* 4. Featured Projects (Selected Work) */}
        <section id="projects" style={{ paddingBottom: "72px" }}>
          <div>
            <span className="eyebrow">Selected Work</span>
            <h2 className="section-title">{featuredProjects.sectionTitle}</h2>
            <p className="section-desc">{featuredProjects.sectionSubtitle}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {featuredProjects.items.map((item, idx) => (
              <article key={item.id} className="project-card">
                {/* Browser top frame bar */}
                <div className="browser-bar">
                  <div className="browser-dots">
                    <span className="browser-dot" style={{ background: "#ff5f56" }} />
                    <span className="browser-dot" style={{ background: "#ffbd2e" }} />
                    <span className="browser-dot" style={{ background: "#27c93f" }} />
                  </div>
                  <span>{item.client || "Production System"}</span>
                  <span style={{ fontWeight: 700 }}>0{idx + 1} / 0{featuredProjects.items.length}</span>
                </div>

                <div style={{ padding: "28px 32px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "14px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontFamily: "var(--font-mono-var)", color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                        {item.period} • {item.status}
                      </span>
                      <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--ink)" }}>
                        {item.title}
                      </h3>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{ padding: "8px 16px", fontSize: "13px" }}
                        >
                          <span>Kunjungi Demo</span>
                          <ArrowUpRightIcon />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedProject(item)}
                        className="btn-secondary"
                        style={{ padding: "8px 16px", fontSize: "13px" }}
                      >
                        Detail Studi Kasus
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "20px" }}>
                    {item.summary}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {item.stack.map((tech) => (
                      <span key={tech} className="tag-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 5. All Projects Archive (Filterable) */}
        <section style={{ paddingBottom: "72px" }}>
          <div>
            <span className="eyebrow">Arsip Lengkap</span>
            <h2 className="section-title">Eksplorasi Proyek Lainnya</h2>
            <p className="section-desc">Kumpulan aplikasi web, otomasi sistem operasional, dan proyek penelitian deep learning.</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveProjectTab(cat)}
                  className="badge-pill"
                  style={{
                    cursor: "pointer",
                    background: activeProjectTab === cat ? "var(--btn)" : "var(--frame)",
                    color: activeProjectTab === cat ? "var(--btn-ink)" : "var(--ink)",
                    borderColor: activeProjectTab === cat ? "var(--btn)" : "var(--line)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "20px" }}>
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                style={{
                  background: "var(--frame)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "var(--line-dark)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.borderColor = "var(--line)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
                    {p.period}
                  </span>
                  <span className="tag-chip" style={{ fontSize: "11px", padding: "2px 8px" }}>
                    {p.status}
                  </span>
                </div>

                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, marginBottom: "16px" }}>
                  {p.summary}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {p.stack.slice(0, 3).map((st) => (
                    <span key={st} style={{ fontSize: "11px", fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
                      #{st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Experience & Education Section */}
        <section id="experience" style={{ paddingBottom: "72px" }}>
          <div>
            <span className="eyebrow">Riwayat Kerja & Pendidikan</span>
            <h2 className="section-title">{experience.sectionTitle}</h2>
            <p className="section-desc">{experience.sectionSubtitle}</p>
          </div>

          <div
            style={{
              background: "var(--frame)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              padding: "32px",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {experience.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  style={{
                    borderBottom: idx !== experience.experiences.length - 1 ? "1px solid var(--line)" : "none",
                    paddingBottom: idx !== experience.experiences.length - 1 ? "28px" : "0",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "6px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink)" }}>
                      {exp.role} <span style={{ fontWeight: 500, color: "var(--muted)" }}>• {exp.organization}</span>
                    </h3>
                    <span className="badge-pill" style={{ fontFamily: "var(--font-mono-var)", fontSize: "12px", background: "var(--card)" }}>
                      {exp.period}
                    </span>
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "12px" }}>
                    📍 {exp.location} • {exp.type}
                  </p>

                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14px", color: "var(--ink)", lineHeight: 1.55 }}>
                        <span style={{ color: "var(--accent-green)", marginTop: "2px", flexShrink: 0 }}>
                          <CheckIcon />
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {exp.stack.map((st) => (
                      <span key={st} className="tag-chip" style={{ fontSize: "11px" }}>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Card */}
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-lg)",
              padding: "24px 32px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div>
              <span className="eyebrow" style={{ color: "var(--muted)" }}>Latar Belakang Pendidikan</span>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--ink)" }}>
                {experience.education[0]?.degree || "S.Kom, Informatika"}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--muted)" }}>
                {experience.education[0]?.institution || "Universitas Bina Sarana Informatika"} ({experience.education[0]?.period || "2022 - 2026"})
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--ink)", display: "block", lineHeight: 1 }}>
                {experience.education[0]?.gpa || "3.86"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>IPK Kumulatif (Skala 4.00)</span>
            </div>
          </div>
        </section>

        {/* 7. Certifications & Credentials */}
        <section id="certifications" style={{ paddingBottom: "72px" }}>
          <div>
            <span className="eyebrow">Kredensial Resmi</span>
            <h2 className="section-title">{certifications.sectionTitle}</h2>
            <p className="section-desc">{certifications.sectionSubtitle}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
            {certifications.items.map((cert) => (
              <div
                key={cert.id}
                style={{
                  background: "var(--frame)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-md)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className="tag-chip" style={{ fontSize: "11px" }}>{cert.category}</span>
                    <span style={{ fontSize: "12px", fontFamily: "var(--font-mono-var)", color: "var(--muted)" }}>
                      {cert.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "var(--ink)", marginBottom: "4px" }}>
                    {cert.title}
                  </h3>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", marginBottom: "10px" }}>
                    {cert.issuer}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--ink)", lineHeight: 1.5, marginBottom: "16px" }}>
                    {cert.description}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                  <a
                    href={cert.credentialUrl || profile.cvPath}
                    target={cert.credentialUrl ? "_blank" : undefined}
                    rel={cert.credentialUrl ? "noopener noreferrer" : undefined}
                    download={!cert.credentialUrl ? true : undefined}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--ink)",
                      textDecoration: "none",
                    }}
                  >
                    <span>{cert.credentialUrl ? "Verifikasi Kredensial" : "Lihat di Berkas CV"}</span>
                    <ArrowUpRightIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section id="faq" style={{ paddingBottom: "72px" }}>
          <div>
            <span className="eyebrow">Tanya Jawab</span>
            <h2 className="section-title">{faq.sectionTitle}</h2>
            <p className="section-desc">{faq.sectionSubtitle}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {faq.items.map((item, idx) => (
              <details
                key={idx}
                style={{
                  background: "var(--frame)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 24px",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                }}
              >
                <summary style={{ fontWeight: 700, fontSize: "16px", color: "var(--ink)", outline: "none" }}>
                  {item.question}
                </summary>
                <p style={{ marginTop: "12px", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 9. Contact / Footer ("Let's build something great together") */}
        <section
          id="contact"
          style={{
            background: "var(--frame)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            padding: "48px 36px",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "64px",
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            <span className="eyebrow">Mulai Diskusi</span>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "14px" }}>
              Mari bangun platform web yang andal dan teruji bersama.
            </h2>
            <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.6, marginBottom: "28px" }}>
              Saya terbuka untuk kesempatan kerja penuh waktu, kontrak proyek pengembangan sistem operasional, maupun riset kolaboratif artificial intelligence.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "32px" }}>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn-primary"
                style={{ padding: "12px 24px", fontSize: "14px" }}
              >
                <span>{copiedEmail ? "✓ Email Disalin!" : `Salin ${profile.email}`}</span>
              </button>

              <a
                href={`mailto:${profile.email}`}
                className="btn-secondary"
                style={{ padding: "12px 24px", fontSize: "14px" }}
              >
                <span>Kirim Email Langsung</span>
                <ArrowUpRightIcon />
              </a>

              <a
                href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="badge-pill"
                style={{ padding: "11px 18px", fontSize: "14px" }}
              >
                <span>WhatsApp: {profile.phone}</span>
                <ArrowUpRightIcon />
              </a>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", borderTop: "1px solid var(--line)", paddingTop: "24px", fontSize: "13px", color: "var(--muted)" }}>
              <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
              <div style={{ display: "flex", gap: "16px" }}>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 600 }}>GitHub</a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", textDecoration: "none", fontWeight: 600 }}>LinkedIn</a>
                <a href="/admin" style={{ color: "var(--muted)", textDecoration: "none" }}>Portal Konten</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Case Study Modal Dialog */}
      <dialog
        ref={dialogRef}
        className="custom-modal"
        onClose={() => setSelectedProject(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setSelectedProject(null);
        }}
      >
        {selectedProject && (
          <div style={{ padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <span className="tag-chip" style={{ fontSize: "11px", marginBottom: "6px" }}>
                  {selectedProject.status} • {selectedProject.period}
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "var(--ink)", margin: 0 }}>
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
                      <span style={{ color: "var(--accent-green)", marginTop: "2px", flexShrink: 0 }}><CheckIcon /></span>
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
                      <span style={{ color: "var(--accent-green)", marginTop: "2px", flexShrink: 0 }}><CheckIcon /></span>
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {selectedProject.stack.map((s) => (
                  <span key={s} className="tag-chip" style={{ fontSize: "11px" }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--line)", paddingTop: "16px" }}>
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ fontSize: "13px", padding: "8px 18px" }}
                >
                  <span>Kunjungi Demo Langsung</span>
                  <ArrowUpRightIcon />
                </a>
              )}
              {selectedProject.repoUrl && (
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: "13px", padding: "8px 18px" }}
                >
                  <span>Repository GitHub</span>
                  <ArrowUpRightIcon />
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="btn-secondary"
                style={{ fontSize: "13px", padding: "8px 18px" }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
