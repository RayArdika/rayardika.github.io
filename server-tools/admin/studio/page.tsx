"use client";

import React, { useEffect, useState } from "react";
import type { PortfolioCMSData } from "@/lib/cms";

type SectionKey =
  | "featuredProjects"
  | "projects"
  | "experience"
  | "certifications"
  | "capabilities"
  | "profile"
  | "faq";

const SECTION_TABS: { key: SectionKey; label: string; file: string }[] = [
  {
    key: "featuredProjects",
    label: "1. Featured Projects",
    file: "content/featured-projects.json",
  },
  {
    key: "projects",
    label: "2. Projects",
    file: "content/projects.json",
  },
  {
    key: "experience",
    label: "3. Experience & Education",
    file: "content/experience.json",
  },
  {
    key: "certifications",
    label: "4. Certifications",
    file: "content/certifications.json",
  },
  {
    key: "capabilities",
    label: "5. Services & Stack",
    file: "content/capabilities.json",
  },
  {
    key: "profile",
    label: "6. Profile & Stats",
    file: "content/profile.json",
  },
  {
    key: "faq",
    label: "7. FAQs",
    file: "content/faq.json",
  },
];

export default function AdminStudioPage() {
  const [cmsData, setCmsData] = useState<PortfolioCMSData | null>(null);
  const [activeTab, setActiveTab] = useState<SectionKey>("featuredProjects");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [saveStatus, setSaveStatus] = useState<string>("");

  async function loadAll() {
    setLoadState("loading");
    try {
      const res = await fetch("/api/cms", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; data?: PortfolioCMSData };
      if (json.ok && json.data) {
        setCmsData(json.data);
        setLoadState("ready");
      } else {
        setLoadState("error");
      }
    } catch {
      setLoadState("error");
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function saveCurrentSection() {
    if (!cmsData) return;
    setSaveStatus("Menyimpan perubahan...");
    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: activeTab, data: cmsData[activeTab] }),
    });
    const json = (await res.json()) as { ok: boolean; message?: string; error?: string };
    setSaveStatus(
      json.ok
        ? json.message || "Berhasil disimpan!"
        : json.error || "Gagal menyimpan."
    );
  }

  const currentMeta = SECTION_TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="min-vh-100 bg-light-gray">
      <header className="bg-dark border-top border-4 border-primary py-4">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/logos/logo-white.svg"
              alt="Studiova"
              height="32"
            />
            <span className="badge bg-primary text-dark">
              Studio CMS Editor
            </span>
          </div>
          <div className="hstack gap-3 flex-wrap">
            <a href="/admin" className="bg-primary px-3 py-2 rounded fw-bold text-dark">
              Decap CMS (GitHub Login)
            </a>
            <a href="/api/auth?setup=1" className="badge text-bg-dark border px-3 py-2">
              Setup GitHub OAuth
            </a>
            <a href="/" className="bg-white px-3 py-2 rounded fw-bold text-dark">
              Lihat Website ↗
            </a>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {loadState === "loading" && (
          <div className="card p-6 text-center">
            <h4>Memuat data CMS...</h4>
          </div>
        )}

        {loadState === "error" && (
          <div className="card p-6 text-center">
            <h4>Gagal memuat data CMS</h4>
            <button type="button" onClick={loadAll} className="btn mt-3">
              <span className="btn-text">Muat Ulang</span>
            </button>
          </div>
        )}

        {loadState === "ready" && cmsData && (
          <div className="row">
            <div className="col-lg-3 mb-6 mb-lg-0">
              <div className="card">
                <div className="card-body d-flex flex-column gap-2 p-4">
                  <h6 className="mb-2 fw-bold">Koleksi CMS</h6>
                  {SECTION_TABS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(t.key);
                        setSaveStatus("");
                      }}
                      className={`text-start px-3 py-2 rounded border-0 fw-bold ${
                        activeTab === t.key
                          ? "bg-primary text-dark"
                          : "bg-light-gray text-dark"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="card">
                <div className="card-body p-6 d-flex flex-column gap-4">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-4">
                    <div>
                      <span className="badge text-bg-dark mb-1">
                        {currentMeta.file}
                      </span>
                      <h3 className="mb-0">{currentMeta.label}</h3>
                    </div>
                    <button
                      type="button"
                      onClick={saveCurrentSection}
                      className="bg-primary px-4 py-2 rounded border-0 fw-bold text-dark"
                    >
                      Simpan Perubahan
                    </button>
                  </div>

                  {saveStatus && (
                    <div className="p-3 rounded bg-primary text-dark fw-bold">
                      {saveStatus}
                    </div>
                  )}

                  <textarea
                    rows={18}
                    aria-label={`Editor JSON untuk ${currentMeta.label}`}
                    className="form-control border font-monospace p-3"
                    value={JSON.stringify(cmsData[activeTab], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setCmsData({ ...cmsData, [activeTab]: parsed });
                      } catch {
                        // Allow intermediate edits
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
