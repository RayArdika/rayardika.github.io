"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  PortfolioCMSData,
  FeaturedProjectItem,
  ProjectItem,
} from "@/lib/cms";

function Iconify({ icon, className = "" }: { icon: string; className?: string }) {
  return React.createElement("iconify-icon", {
    icon,
    class: className,
  });
}

const PORTFOLIO_FALLBACK_IMAGES = [
  "/assets/images/portfolio/portfolio-img-1.jpg",
  "/assets/images/portfolio/portfolio-img-2.jpg",
  "/assets/images/portfolio/portfolio-img-3.jpg",
  "/assets/images/portfolio/portfolio-img-4.jpg",
  "/assets/images/portfolio/portfolio-img-5.jpg",
  "/assets/images/portfolio/portfolio-img-6.jpg",
];

// Memoized so parent scroll/tab state updates never strip Owl Carousel's .owl-loaded DOM classes
const FeaturedProjectsCarousel = React.memo(function FeaturedProjectsCarousel({
  items,
  onSelect,
}: {
  items: FeaturedProjectItem[];
  onSelect: (item: FeaturedProjectItem) => void;
}) {
  return (
    <div className="featured-projects-slider px-3">
      <div className="owl-carousel owl-theme">
        {items.map((item, idx) => {
          const imgSrc =
            item.image ||
            PORTFOLIO_FALLBACK_IMAGES[idx % PORTFOLIO_FALLBACK_IMAGES.length];
          return (
            <div className="item" key={item.id}>
              <div className="portfolio d-flex flex-column gap-6">
                <div className="portfolio-img position-relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="img-fluid"
                  />
                  <div className="portfolio-overlay">
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      aria-label={`View details for ${item.title}`}
                      className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center border-0"
                    >
                      <Iconify
                        icon="lucide:arrow-up-right"
                        className="fs-8 text-dark"
                      />
                    </button>
                  </div>
                </div>
                <div className="portfolio-details d-flex flex-column gap-3">
                  <h3 className="mb-0">{item.title}</h3>
                  <div className="hstack gap-2 flex-wrap">
                    <span className="badge text-dark border">
                      {item.status}
                    </span>
                    {item.stack.slice(0, 2).map((tag) => (
                      <span key={tag} className="badge text-dark border">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

interface ModalProjectState {
  title: string;
  client: string;
  period: string;
  status: string;
  category: string;
  summary: string;
  bullets: string[];
  stack: string[];
  image?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export default function PortfolioClient({ initialData }: { initialData: PortfolioCMSData }) {
  const {
    profile,
    featuredProjects,
    projects,
    experience,
    certifications,
    capabilities,
    faq,
  } = initialData;

  const [fixedHeader, setFixedHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeServiceTab, setActiveServiceTab] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [projectCategory, setProjectCategory] = useState<string>("All");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ModalProjectState | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<{
    type: "idle" | "error" | "success";
    text: string;
  }>({ type: "idle", text: "" });

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;
      setFixedHeader(y >= 60);
      setShowScrollTop(y > 100);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSelectedProject(null);
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (
        menuOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedProject) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedProject]);

  // Initialize Studiova's Owl Carousel and AOS animations once scripts load
  useEffect(() => {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const w = window as unknown as {
        jQuery?: (sel: string) => {
          owlCarousel?: (opts: Record<string, unknown>) => void;
          hasClass?: (cls: string) => boolean;
        };
        AOS?: { init: (opts: Record<string, unknown>) => void };
      };

      if (w.AOS && typeof w.AOS.init === "function") {
        w.AOS.init({ once: true });
      }

      if (w.jQuery) {
        const $el = w.jQuery(".featured-projects-slider .owl-carousel");
        if (
          $el &&
          typeof $el.owlCarousel === "function" &&
          (!$el.hasClass || !$el.hasClass("owl-loaded"))
        ) {
          $el.owlCarousel({
            center: true,
            loop: true,
            margin: 30,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            responsive: {
              0: { items: 1 },
              600: { items: 2 },
              1000: { items: 3 },
              1200: { items: 4 },
            },
          });
          window.clearInterval(timer);
        }
      }

      if (attempts > 25) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, []);

  const sortedFeatured = useMemo(() => {
    return [...featuredProjects.items].sort(
      (a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99)
    );
  }, [featuredProjects.items]);

  const projectCategories = useMemo(() => {
    const cats = Array.from(new Set(projects.items.map((p) => p.category)));
    return ["All", ...cats];
  }, [projects.items]);

  const filteredProjects = useMemo(() => {
    if (projectCategory === "All") return projects.items;
    return projects.items.filter((p) => p.category === projectCategory);
  }, [projects.items, projectCategory]);

  const openFeaturedDetail = useCallback((item: FeaturedProjectItem) => {
    setSelectedProject({
      title: item.title,
      client: item.client,
      period: item.period,
      status: item.status,
      category: item.category,
      summary: item.summary,
      bullets: item.highlights,
      stack: item.stack,
      image: item.image,
      liveUrl: item.liveUrl,
      repoUrl: item.repoUrl,
    });
  }, []);

  function openProjectDetail(item: ProjectItem) {
    setSelectedProject({
      title: item.title,
      client: item.client,
      period: item.period,
      status: item.status,
      category: `${item.category} · ${item.role}`,
      summary: item.summary,
      bullets: item.deliverables,
      stack: item.stack,
      image: item.image,
      liveUrl: item.liveUrl,
      repoUrl: item.repoUrl,
    });
  }

  function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactStatus({
        type: "error",
        text: "Please fill in your name, email address, and project message.",
      });
      return;
    }
    setContactStatus({
      type: "success",
      text: `Thank you, ${contactName}. Your message is ready to send to ${profile.email}.`,
    });
  }

  const serviceImages = [
    "/assets/images/services/services-img-1.jpg",
    "/assets/images/services/services-img-2.jpg",
    "/assets/images/services/services-img-3.jpg",
    "/assets/images/services/services-img-4.jpg",
  ];

  const portfolioFallbackImages = [
    "/assets/images/portfolio/portfolio-img-1.jpg",
    "/assets/images/portfolio/portfolio-img-2.jpg",
    "/assets/images/portfolio/portfolio-img-3.jpg",
    "/assets/images/portfolio/portfolio-img-4.jpg",
    "/assets/images/portfolio/portfolio-img-5.jpg",
    "/assets/images/portfolio/portfolio-img-6.jpg",
  ];

  const certFallbackImages = [
    "/assets/images/team/team-img-1.jpg",
    "/assets/images/team/team-img-2.jpg",
    "/assets/images/team/team-img-3.jpg",
    "/assets/images/team/team-img-4.jpg",
  ];

  const resourceFallbackImages = [
    "/assets/images/resources/resources-1.jpg",
    "/assets/images/resources/resources-2.jpg",
    "/assets/images/resources/resources-3.jpg",
  ];

  const primaryEdu = experience.education[0];

  return (
    <>
      {/* Header - Exact Studiova structure */}
      <header
        className={`header border-4 border-primary border-top position-fixed start-0 top-0 w-100 ${
          fixedHeader ? "fixed-header" : ""
        }`}
      >
        <div className="container">
          <div className="header-wrapper d-flex align-items-center justify-content-between">
            <div className="logo">
              <a href="#banner" className="logo-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/logos/logo-white.svg"
                  alt="Studiova Logo"
                  className="img-fluid"
                />
              </a>
              <a href="#banner" className="logo-dark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/logos/logo-dark.svg"
                  alt="Studiova Logo"
                  className="img-fluid"
                />
              </a>
            </div>

            <div className="d-flex align-items-center gap-4" ref={dropdownRef}>
              <div className="btn-group position-relative">
                <button
                  className={`btn btn-secondary toggle-menu round-45 p-2 d-flex align-items-center justify-content-center bg-white rounded-circle ${
                    menuOpen ? "show" : ""
                  }`}
                  type="button"
                  aria-expanded={menuOpen}
                  aria-label="Toggle navigation menu"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <Iconify
                    icon="solar:hamburger-menu-line-duotone"
                    className="menu-icon fs-8 text-dark"
                  />
                </button>

                <ul
                  className={`dropdown-menu dropdown-menu-end p-4 ${
                    menuOpen ? "show" : ""
                  }`}
                  style={
                    menuOpen
                      ? { position: "absolute", inset: "100% 0px auto auto", marginTop: "8px" }
                      : undefined
                  }
                >
                  <div className="d-flex flex-column gap-6">
                    <div className="hstack justify-content-between border-bottom pb-6">
                      <p className="mb-0 fs-5 text-dark">Menu</p>
                      <button
                        type="button"
                        className="btn-close opacity-75"
                        aria-label="Close"
                        onClick={() => setMenuOpen(false)}
                      />
                    </div>
                    <div className="d-flex flex-column gap-3">
                      <ul className="header-menu list-unstyled mb-0 d-flex flex-column gap-2">
                        {[
                          { label: "Home", href: "#banner", active: true },
                          { label: "About", href: "#stats-facts" },
                          { label: "Featured Project", href: "#featured-projects" },
                          { label: "Services", href: "#services" },
                          { label: "Experience", href: "#experience" },
                          { label: "Certifications", href: "#certifications" },
                          { label: "Projects", href: "#projects" },
                          { label: "FAQs", href: "#faq" },
                          { label: "Contact", href: "#contact" },
                        ].map((nav) => (
                          <li key={nav.href} className="header-item">
                            <a
                              href={nav.href}
                              onClick={() => setMenuOpen(false)}
                              className={`header-link ${
                                nav.active ? "active" : ""
                              } hstack gap-2 fs-7 fw-bold text-dark`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/assets/images/svgs/secondary-leaf.svg"
                                alt=""
                                width="20"
                                height="20"
                                className="img-fluid animate-spin"
                              />
                              {nav.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="hstack gap-3">
                        <a
                          href="#contact"
                          onClick={() => setMenuOpen(false)}
                          className="btn btn-outline-light fs-6 bg-white px-3 py-2 text-dark w-50 hstack justify-content-center"
                        >
                          Contact Me
                        </a>
                        <a
                          href={profile.cvPath}
                          download
                          className="btn btn-dark text-white fs-6 bg-dark px-3 py-2 w-50 hstack justify-content-center"
                        >
                          Download CV
                        </a>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <a className="text-dark" href={`tel:${profile.phone}`}>
                        {profile.phone}
                      </a>
                      <a
                        className="fs-8 text-dark fw-bold"
                        href={`mailto:${profile.email}`}
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Wrapper - Exact Studiova structure */}
      <div className="page-wrapper overflow-hidden">
        {/* Banner Section */}
        <section
          id="banner"
          className="banner-section position-relative d-flex align-items-end min-vh-100"
        >
          {profile.heroBackgroundImage ||
          (profile.heroBackgroundVideo &&
            /\.(jpe?g|png|webp|avif)$/i.test(profile.heroBackgroundVideo)) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                profile.heroBackgroundImage ||
                profile.heroBackgroundVideo ||
                "/assets/images/backgrounds/banner-video.mp4"
              }
              alt={profile.name}
              className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
            />
          ) : (
            <video
              className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src={
                  profile.heroBackgroundVideo ||
                  "/assets/images/backgrounds/banner-video.mp4"
                }
                type="video/mp4"
              />
            </video>
          )}
          <div className="container">
            <div className="d-flex flex-column gap-4 pb-8 position-relative z-1">
              <div className="row align-items-center">
                <div className="col-xl-5">
                  <div
                    className="d-flex align-items-center gap-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/images/svgs/primary-leaf.svg"
                      alt=""
                      className="img-fluid animate-spin"
                    />
                    <p className="mb-0 text-white fs-5 text-opacity-70">
                      {profile.heroSummary.split(profile.heroHighlight)[0]}
                      <span className="text-primary">{profile.heroHighlight}</span>
                      {profile.heroSummary.split(profile.heroHighlight)[1] ?? ""}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="d-flex align-items-end gap-3 flex-wrap"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                <h1 className="mb-0 fs-16 text-white lh-1">
                  {profile.displayTitle}
                </h1>
                <a
                  href="#featured-projects"
                  aria-label="Explore Featured Projects"
                  className="p-1 ps-7 bg-primary rounded-pill"
                >
                  <span className="bg-white round-52 rounded-circle d-flex align-items-center justify-content-center">
                    <Iconify
                      icon="lucide:arrow-up-right"
                      className="fs-8 text-dark"
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 01 Stats & Facts Section */}
        <section
          id="stats-facts"
          className="stats-facts py-5 py-lg-11 py-xl-12 position-relative overflow-hidden"
        >
          <div className="container">
            <div className="row gap-7 gap-xl-0">
              <div className="col-xl-4 col-xxl-4">
                <div
                  className="d-flex align-items-center gap-7 py-2"
                  data-aos="fade-right"
                  data-aos-delay="100"
                  data-aos-duration="1000"
                >
                  <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                    01
                  </span>
                  <hr className="border-line" />
                  <span className="badge text-bg-dark">Stats & facts</span>
                </div>
              </div>
              <div className="col-xl-8 col-xxl-7">
                <div className="d-flex flex-column gap-9">
                  <div className="row">
                    <div className="col-xxl-10">
                      <div
                        className="d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="1000"
                      >
                        <h2 className="mb-0">{profile.aboutHeading}</h2>
                        <p className="fs-5 mb-0">{profile.aboutDescription}</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {profile.stats.map((st, idx) => (
                      <div
                        key={idx}
                        className="col-md-6 col-lg-4 mb-7 mb-lg-0"
                      >
                        <div
                          className="d-flex flex-column gap-6 pt-9 border-top"
                          data-aos="fade-up"
                          data-aos-delay={(idx + 2) * 100}
                          data-aos-duration="1000"
                        >
                          <h2 className="mb-0 fs-14">
                            <span>{st.value}</span>
                            {st.suffix ?? ""}
                          </h2>
                          <p className="mb-0">{st.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap gap-3">
                    <a
                      href="#experience"
                      className="btn"
                      data-aos="fade-up"
                      data-aos-delay="500"
                      data-aos-duration="1000"
                    >
                      <span className="btn-text">Who I am</span>
                      <Iconify
                        icon="lucide:arrow-up-right"
                        className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                      />
                    </a>
                    <a
                      href={profile.cvPath}
                      download
                      className="btn"
                      data-aos="fade-up"
                      data-aos-delay="550"
                      data-aos-duration="1000"
                    >
                      <span className="btn-text">Download CV</span>
                      <Iconify
                        icon="lucide:arrow-up-right"
                        className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="position-absolute bottom-0 start-0"
            data-aos="zoom-in"
            data-aos-delay="100"
            data-aos-duration="1000"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/backgrounds/stats-facts-bg.svg"
              alt=""
              className="img-fluid"
            />
          </div>
        </section>

        {/* 02 Featured Projects Section - Exact Studiova Owl Carousel */}
        <section
          id="featured-projects"
          className="featured-projects py-5 py-lg-11 py-xl-12 bg-light-gray"
        >
          <div className="d-flex flex-column gap-5 gap-xl-11">
            <div className="container">
              <div className="row gap-7 gap-xl-0">
                <div className="col-xl-4 col-xxl-4">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                      02
                    </span>
                    <hr className="border-line" />
                    <span className="badge text-bg-dark">Featured project</span>
                  </div>
                </div>
                <div className="col-xl-8 col-xxl-7">
                  <div className="row">
                    <div className="col-xxl-9">
                      <div
                        className="d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="1000"
                      >
                        <h2 className="mb-0">{featuredProjects.sectionTitle}</h2>
                        <p className="fs-5 mb-0">
                          {featuredProjects.sectionSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FeaturedProjectsCarousel
              items={sortedFeatured}
              onSelect={openFeaturedDetail}
            />
          </div>
        </section>

        {/* 03 Services Section - Exact Studiova Dark Services Tab */}
        <section
          className="services py-5 py-lg-11 py-xl-12 bg-dark"
          id="services"
        >
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-10">
              <div className="row gap-7 gap-xl-0">
                <div className="col-xl-4 col-xxl-4">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                      03
                    </span>
                    <hr className="border-line bg-white" />
                    <span className="badge text-dark bg-white">Services</span>
                  </div>
                </div>
                <div className="col-xl-8 col-xxl-7">
                  <div className="row">
                    <div className="col-xxl-9">
                      <div
                        className="d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="1000"
                      >
                        <h2 className="mb-0 text-white">
                          {capabilities.sectionTitle}
                        </h2>
                        <p className="fs-5 mb-0 text-white text-opacity-70">
                          {capabilities.sectionSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="services-tab">
                <div className="row gap-5 gap-xl-0">
                  <div className="col-xl-4">
                    <div
                      className="tab-content"
                      data-aos="zoom-in"
                      data-aos-delay="100"
                      data-aos-duration="1000"
                    >
                      {capabilities.services.map((srv, idx) => {
                        const isActive = idx === activeServiceTab;
                        const imgSrc =
                          srv.codePreview && srv.codePreview.startsWith("/")
                            ? srv.codePreview
                            : serviceImages[idx % serviceImages.length];
                        return (
                          <div
                            key={srv.id}
                            className={`tab-pane ${isActive ? "active show" : ""}`}
                            id={`service-pane-${idx}`}
                            role="tabpanel"
                            aria-labelledby={`service-tab-${idx}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgSrc}
                              alt={srv.title}
                              className="img-fluid"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="col-xl-8">
                    <div className="d-flex flex-column gap-5">
                      <ul
                        className="nav nav-tabs border-0"
                        id="myTab"
                        role="tablist"
                        data-aos="fade-up"
                        data-aos-delay="200"
                        data-aos-duration="1000"
                      >
                        {capabilities.services.map((srv, idx) => {
                          const isActive = idx === activeServiceTab;
                          return (
                            <li
                              key={srv.id}
                              className="nav-item py-4 py-lg-8 border-top border-white border-opacity-10 d-flex align-items-center w-100"
                              role="presentation"
                            >
                              <div className="row w-100 align-items-center gx-3">
                                <div className="col-lg-6 col-xxl-5">
                                  <button
                                    className={`nav-link fs-10 fw-bold py-1 px-0 border-0 rounded-0 flex-shrink-0 text-start ${
                                      isActive ? "active" : ""
                                    }`}
                                    id={`service-tab-${idx}`}
                                    type="button"
                                    role="tab"
                                    aria-controls={`service-pane-${idx}`}
                                    aria-selected={isActive}
                                    onClick={() => setActiveServiceTab(idx)}
                                  >
                                    {srv.title}
                                  </button>
                                </div>
                                <div className="col-lg-6 col-xxl-7">
                                  <p className="text-white text-opacity-70 mb-0">
                                    {srv.description}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      <a
                        href="#projects"
                        className="btn border border-white border-opacity-25"
                        data-aos="fade-up"
                        data-aos-delay="300"
                        data-aos-duration="1000"
                      >
                        <span className="btn-text">See My Work</span>
                        <Iconify
                          icon="lucide:arrow-up-right"
                          className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 Experience & Why Choose Us Section - Exact Studiova Cards + CMS Experience */}
        <section
          id="experience"
          className="why-choose-us py-5 py-lg-11 py-xl-12"
        >
          <div className="container">
            <div className="row justify-content-between gap-5 gap-xl-0">
              <div className="col-xl-3 col-xxl-3">
                <div className="d-flex flex-column gap-7">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                      04
                    </span>
                    <hr className="border-line" />
                    <span className="badge text-bg-dark">Experience</span>
                  </div>
                  <h2
                    className="mb-0"
                    data-aos="fade-right"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    {experience.sectionTitle}
                  </h2>
                  <p
                    className="mb-0 fs-5"
                    data-aos="fade-right"
                    data-aos-delay="300"
                    data-aos-duration="1000"
                  >
                    {experience.sectionSubtitle}
                  </p>
                </div>
              </div>

              <div className="col-xl-9 col-xxl-8">
                {/* Exact Studiova 3-column visual cards */}
                <div className="row">
                  <div className="col-lg-4 mb-7 mb-lg-0">
                    <div
                      className="card position-relative overflow-hidden bg-primary h-100"
                      data-aos="fade-up"
                      data-aos-delay="100"
                      data-aos-duration="1000"
                    >
                      <div className="card-body d-flex flex-column justify-content-between">
                        <div className="d-flex flex-column gap-3 position-relative z-1">
                          <ul className="list-unstyled mb-0 hstack gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <li key={star}>
                                <span className="hstack">
                                  <Iconify
                                    icon="solar:star-bold"
                                    className="fs-6 text-dark"
                                  />
                                </span>
                              </li>
                            ))}
                          </ul>
                          <p className="mb-0 fs-6 text-dark">
                            {primaryEdu
                              ? primaryEdu.degree
                              : "Bachelor of Computer Science (S.Kom), Information Technology"}
                          </p>
                        </div>
                        <div className="position-relative z-1">
                          <div className="pb-6 border-bottom">
                            <h2 className="mb-0">
                              {primaryEdu ? primaryEdu.gpa : "3.86/4.00"}
                            </h2>
                            <p className="mb-0 text-dark">
                              Cumulative GPA ({primaryEdu ? primaryEdu.period : "2022 - 2026"})
                            </p>
                          </div>
                          <div className="hstack gap-6 pt-6">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={profile.avatarImage || "/assets/images/profile/avatar-1.png"}
                              alt={profile.name}
                              className="img-fluid rounded-circle overflow-hidden flex-shrink-0"
                              width="64"
                              height="64"
                            />
                            <div>
                              <h5 className="mb-0">{profile.name}</h5>
                              <p className="mb-0 text-dark">
                                {primaryEdu
                                  ? primaryEdu.institution
                                  : "Universitas Bina Sarana Informatika"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="position-absolute bottom-0 end-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/assets/images/backgrounds/customer-satisfaction-bg.svg"
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 mb-7 mb-lg-0">
                    <div
                      className="d-flex flex-column gap-7"
                      data-aos="fade-up"
                      data-aos-delay="200"
                      data-aos-duration="1000"
                    >
                      <div className="position-relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/assets/images/services/services-img-2.jpg"
                          alt="Engineering workflow"
                          className="img-fluid w-100"
                        />
                      </div>

                      <div className="card bg-dark">
                        <div className="card-body d-flex flex-column gap-7">
                          <div>
                            <h2 className="mb-0 text-white">
                              {experience.experiences.length} Systems
                            </h2>
                            <p className="mb-0 text-white text-opacity-70">
                              Operational & event platforms built
                            </p>
                          </div>
                          <ul className="d-flex align-items-center mb-0">
                            {[1, 2, 3, 4].map((u, i) => (
                              <li key={u} className={i > 0 ? "ms-n2" : ""}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`/assets/images/profile/user-${u}.jpg`}
                                  width="44"
                                  height="44"
                                  className="rounded-circle border border-2 border-dark"
                                  alt={`Collaborator ${u}`}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 mb-7 mb-lg-0">
                    <div
                      className="card border h-100 position-relative overflow-hidden"
                      data-aos="fade-up"
                      data-aos-delay="300"
                      data-aos-duration="1000"
                    >
                      <span className="border rounded-circle round-490 d-block position-absolute top-0 start-50 translate-middle" />
                      <div className="card-body d-flex flex-column justify-content-between">
                        <div>
                          <h2 className="mb-0">Full-Stack</h2>
                          <p className="mb-0 text-dark">
                            Laravel, Next.js, TypeScript & MySQL
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-3">
                          <a href="#banner" className="logo-dark">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/assets/images/logos/logo-dark.svg"
                              alt="logo"
                              className="img-fluid"
                            />
                          </a>
                          <p className="mb-0 fs-5 text-dark">
                            End-to-end delivery from database schema and QR/QRIS webhooks to production HTTPS hosting.
                          </p>
                        </div>
                      </div>
                      <span className="border rounded-circle round-490 d-block position-absolute top-100 start-50 translate-middle" />
                    </div>
                  </div>
                </div>

                {/* Experience Timeline Cards from Decap CMS */}
                <div className="d-flex flex-column gap-6 mt-9">
                  {experience.experiences.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="card border"
                      data-aos="fade-up"
                      data-aos-delay={(idx + 1) * 100}
                      data-aos-duration="1000"
                    >
                      <div className="card-body p-6 p-lg-8 d-flex flex-column gap-5">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom pb-5">
                          <div>
                            <h4 className="mb-1">{exp.role}</h4>
                            <p className="mb-0 fs-5 text-dark fw-semibold">
                              {exp.organization} · {exp.location}
                            </p>
                          </div>
                          <span className="badge text-bg-dark fs-4 px-3 py-2">
                            {exp.period}
                          </span>
                        </div>
                        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="hstack align-items-start gap-3">
                              <span className="round-32 rounded-circle bg-primary flex-shrink-0 hstack justify-content-center mt-1">
                                <Iconify
                                  icon="lucide:check"
                                  className="fs-6 text-dark"
                                />
                              </span>
                              <p className="mb-0 fs-5 text-dark">{b}</p>
                            </li>
                          ))}
                        </ul>
                        <div className="hstack gap-2 flex-wrap pt-2">
                          {exp.stack.map((tech) => (
                            <span key={tech} className="badge text-dark border">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 Certifications & Training Section - Exact Studiova Card + Marquee */}
        <section
          id="certifications"
          className="pricing-section py-5 py-lg-11 py-xl-12 bg-light-gray"
        >
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-10">
              <div className="d-flex flex-column gap-5 gap-xl-11">
                <div className="row gap-7 gap-xl-0">
                  <div className="col-xl-4 col-xxl-4">
                    <div
                      className="d-flex align-items-center gap-7 py-2"
                      data-aos="fade-right"
                      data-aos-delay="100"
                      data-aos-duration="1000"
                    >
                      <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                        05
                      </span>
                      <hr className="border-line bg-white" />
                      <span className="badge text-bg-dark">Certifications</span>
                    </div>
                  </div>
                  <div className="col-xl-8 col-xxl-7">
                    <div className="row">
                      <div className="col-xxl-9">
                        <div
                          className="d-flex flex-column gap-6"
                          data-aos="fade-up"
                          data-aos-delay="100"
                          data-aos-duration="1000"
                        >
                          <h2 className="mb-0">{certifications.sectionTitle}</h2>
                          <p className="fs-5 mb-0 text-opacity-70">
                            {certifications.sectionSubtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {certifications.items.map((cert, idx) => {
                    const certImg =
                      cert.certificateFile && cert.certificateFile.startsWith("/")
                        ? cert.certificateFile
                        : certFallbackImages[idx % certFallbackImages.length];
                    return (
                      <div
                        key={cert.id}
                        className="col-lg-6 col-xl-4 mb-7 mb-xl-0 d-flex align-items-stretch"
                      >
                        <div
                          className="card w-100"
                          data-aos="fade-up"
                          data-aos-delay={(idx + 1) * 100}
                          data-aos-duration="1000"
                        >
                          <div className="card-body p-7 p-xxl-5 d-flex flex-column justify-content-between gap-8">
                            <div className="d-flex flex-column gap-6">
                              <div className="hstack justify-content-between gap-3">
                                <h5 className="mb-0 fw-medium">{cert.category}</h5>
                                <span className="badge text-bg-dark hstack gap-2">
                                  <Iconify
                                    icon="lucide:award"
                                    className="fs-5"
                                  />
                                  {cert.date}
                                </span>
                              </div>
                              <div className="position-relative overflow-hidden rounded">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={certImg}
                                  alt={cert.title}
                                  className="img-fluid w-100"
                                  style={{ height: "200px", objectFit: "cover" }}
                                />
                              </div>
                              <div>
                                <h3 className="mb-2 fs-7">{cert.title}</h3>
                                <p className="mb-0 fw-semibold text-dark">
                                  {cert.issuer}
                                </p>
                              </div>
                              <p className="mb-0">{cert.description}</p>
                            </div>

                            <div className="pt-6 border-top d-flex flex-column gap-4">
                              <div className="hstack gap-3">
                                <span className="round-32 rounded-circle bg-primary flex-shrink-0 hstack justify-content-center">
                                  <Iconify
                                    icon="lucide:check"
                                    className="fs-6 text-dark"
                                  />
                                </span>
                                <h6 className="mb-0 fw-normal">
                                  Verified Credential ({cert.date})
                                </h6>
                              </div>

                              <a
                                href={cert.credentialUrl || profile.cvPath}
                                target={cert.credentialUrl ? "_blank" : undefined}
                                rel={
                                  cert.credentialUrl
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                download={!cert.credentialUrl ? true : undefined}
                                className="btn w-100 justify-content-center"
                              >
                                <span className="btn-text">
                                  {cert.credentialUrl
                                    ? "Verify Credential"
                                    : "View in CV"}
                                </span>
                                <Iconify
                                  icon="lucide:arrow-up-right"
                                  className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Studiova Marquee Strip */}
              <div
                className="d-flex flex-column gap-8"
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-duration="1000"
              >
                <p className="fs-5 mb-0 text-center text-dark">
                  Core technologies & engineering stack
                </p>
                <div className="marquee w-100 d-flex align-items-center overflow-hidden">
                  <div className="marquee-content d-flex align-items-center gap-8">
                    {[1, 2, 3, 4].map((repeat) =>
                      [1, 2, 3, 4, 5].map((p) => (
                        <div
                          key={`${repeat}-${p}`}
                          className="marquee-tag hstack justify-content-center"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/assets/images/pricing/partners-${p}.svg`}
                            alt={`Partner technology ${p}`}
                            className="img-fluid"
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 All Projects Section - Exact Studiova Resources Layout */}
        <section
          id="projects"
          className="Recent-news py-5 py-lg-11 py-xl-12"
        >
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-11">
              <div className="row gap-7 gap-xl-0">
                <div className="col-xl-4 col-xxl-4">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                      06
                    </span>
                    <hr className="border-line bg-white" />
                    <span className="badge text-bg-dark">Projects</span>
                  </div>
                </div>
                <div className="col-xl-8 col-xxl-7">
                  <div className="row">
                    <div className="col-xxl-9">
                      <div
                        className="d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="1000"
                      >
                        <h2 className="mb-0">{projects.sectionTitle}</h2>
                        <p className="fs-5 mb-0 text-opacity-70">
                          {projects.sectionSubtitle}
                        </p>
                        <div className="hstack gap-2 flex-wrap">
                          {projectCategories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setProjectCategory(cat)}
                              className={`badge border px-3 py-2 fs-4 ${
                                projectCategory === cat
                                  ? "text-bg-dark"
                                  : "bg-white text-dark"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {filteredProjects.map((proj, idx) => {
                  const isFirst = idx === 0;
                  const imgSrc =
                    proj.image && proj.image.startsWith("/")
                      ? proj.image
                      : resourceFallbackImages[idx % resourceFallbackImages.length];
                  return (
                    <div
                      key={proj.id}
                      className={
                        isFirst
                          ? "col-xl-6 mb-7 mb-xl-0"
                          : "col-md-6 col-xl-3 mb-7 mb-xl-0"
                      }
                    >
                      <div
                        className="resources d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay={(idx + 1) * 100}
                        data-aos-duration="1000"
                      >
                        <a
                          href={`#project-${proj.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            openProjectDetail(proj);
                          }}
                          className={`resources-img ${
                            isFirst ? "resources-img-first" : ""
                          } position-relative overflow-hidden d-block`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc}
                            alt={proj.title}
                            className="img-fluid"
                          />
                        </a>
                        <div className="resources-details d-flex flex-column gap-2">
                          <p className="mb-0">
                            {proj.period} · {proj.status}
                          </p>
                          <h4 className="mb-0">
                            <a
                              href={`#project-${proj.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                openProjectDetail(proj);
                              }}
                              className="text-dark"
                            >
                              {proj.title}
                            </a>
                          </h4>
                          <p className="mb-0">{proj.summary}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 07 FAQ Section - Exact Studiova Accordion */}
        <section
          id="faq"
          className="faq py-5 py-lg-11 py-xl-12 bg-light-gray"
        >
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-11">
              <div className="row gap-7 gap-xl-0">
                <div className="col-xl-4 col-xxl-4">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                      07
                    </span>
                    <hr className="border-line bg-white" />
                    <span className="badge text-bg-dark">FAQs</span>
                  </div>
                </div>
                <div className="col-xl-8 col-xxl-7">
                  <div className="row">
                    <div className="col-xxl-9">
                      <div
                        className="d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="1000"
                      >
                        <h2 className="mb-0">{faq.sectionTitle}</h2>
                        <p className="fs-5 mb-0 text-opacity-70">
                          {faq.sectionSubtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-end">
                <div className="col-xl-8">
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    {faq.items.map((item, idx) => {
                      const isOpen = openFaqIndex === idx;
                      const isLast = idx === faq.items.length - 1;
                      return (
                        <div
                          key={idx}
                          className={`accordion-item ${
                            isLast ? "border-bottom" : ""
                          }`}
                        >
                          <h2 className="accordion-header">
                            <button
                              className={`accordion-button ${
                                isOpen ? "" : "collapsed"
                              } fs-8 fw-bold`}
                              type="button"
                              aria-expanded={isOpen}
                              aria-controls={`flush-collapse-${idx}`}
                              onClick={() =>
                                setOpenFaqIndex((prev) =>
                                  prev === idx ? -1 : idx
                                )
                              }
                            >
                              {item.question}
                            </button>
                          </h2>
                          <div
                            id={`flush-collapse-${idx}`}
                            className={`accordion-collapse collapse ${
                              isOpen ? "show" : ""
                            }`}
                          >
                            <div className="accordion-body pt-0 fs-5 text-dark">
                              {item.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 08 Get in touch Section - Exact Studiova Contact Form */}
        <section
          id="contact"
          className="get-in-touch py-5 py-lg-11 py-xl-12"
        >
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-10">
              <div className="row gap-7 gap-xl-0">
                <div className="col-xl-4 col-xxl-4">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                      08
                    </span>
                    <hr className="border-line bg-white" />
                    <span className="badge text-bg-dark">Contact us</span>
                  </div>
                </div>
                <div className="col-xl-8 col-xxl-7">
                  <div className="row">
                    <div className="col-xxl-8">
                      <div
                        className="d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="1000"
                      >
                        <h2 className="mb-0">Get in touch</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row justify-content-between gap-7 gap-xl-0">
                <div className="col-xl-3">
                  <p
                    className="mb-0 fs-5"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    Let&apos;s collaborate and build your next web platform. Tell me about your project and operational requirements.
                  </p>
                </div>
                <div className="col-xl-8">
                  <form
                    onSubmit={handleContactSubmit}
                    className="d-flex flex-column gap-7"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <div>
                      <input
                        type="text"
                        className="form-control border-bottom border-dark"
                        id="formGroupExampleInput"
                        placeholder="Name"
                        aria-label="Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        className="form-control border-bottom border-dark"
                        id="exampleInputEmail1"
                        placeholder="Email"
                        aria-label="Email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <textarea
                        className="form-control border-bottom border-dark"
                        id="exampleFormControlTextarea1"
                        placeholder="Tell us about your project"
                        aria-label="Tell us about your project"
                        rows={3}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                      />
                    </div>

                    {contactStatus.type !== "idle" && (
                      <div
                        role="status"
                        className={`p-4 rounded ${
                          contactStatus.type === "error"
                            ? "bg-danger-subtle text-dark"
                            : "bg-primary text-dark"
                        }`}
                      >
                        <p className="mb-0 fw-bold">{contactStatus.text}</p>
                        {contactStatus.type === "success" && (
                          <a
                            href={`mailto:${profile.email}?subject=${encodeURIComponent(
                              `Project Inquiry from ${contactName}`
                            )}&body=${encodeURIComponent(
                              `Name: ${contactName}\nEmail: ${contactEmail}\n\n${contactMessage}`
                            )}`}
                            className="d-inline-block mt-2 fw-bold text-dark text-decoration-underline"
                          >
                            Click here to open your email client and send now
                          </a>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn w-100 justify-content-center"
                    >
                      <span className="btn-text">Submit message</span>
                      <Iconify
                        icon="lucide:arrow-up-right"
                        className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                      />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer - Exact Studiova Dark Footer */}
      <footer className="footer bg-dark py-5 py-lg-11 py-xl-12">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 mb-8 mb-xl-0">
              <div className="d-flex flex-column gap-8 pe-xl-5">
                <h2 className="mb-0 text-white">Build something together?</h2>
                <div className="d-flex flex-column gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="link-hover hstack gap-3 text-white fs-5"
                  >
                    <Iconify
                      icon="lucide:arrow-up-right"
                      className="fs-7 text-primary"
                    />
                    {profile.email}
                  </a>
                  <a
                    href={`tel:${profile.phone}`}
                    className="link-hover hstack gap-3 text-white fs-5"
                  >
                    <Iconify
                      icon="lucide:map-pin"
                      className="fs-7 text-primary"
                    />
                    {profile.location} ({profile.phone})
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-xl-2 mb-8 mb-xl-0">
              <ul className="footer-menu list-unstyled mb-0 d-flex flex-column gap-2">
                <li>
                  <a className="link-hover fs-5 text-white" href="#banner">
                    Home
                  </a>
                </li>
                <li>
                  <a className="link-hover fs-5 text-white" href="#stats-facts">
                    About
                  </a>
                </li>
                <li>
                  <a className="link-hover fs-5 text-white" href="#services">
                    Services
                  </a>
                </li>
                <li>
                  <a
                    className="link-hover fs-5 text-white"
                    href="#featured-projects"
                  >
                    Featured Project
                  </a>
                </li>
                <li>
                  <a className="link-hover fs-5 text-white" href="#experience">
                    Experience
                  </a>
                </li>
                <li>
                  <a
                    className="link-hover fs-5 text-white"
                    href="#certifications"
                  >
                    Certifications
                  </a>
                </li>
                <li>
                  <a className="link-hover fs-5 text-white" href="#projects">
                    Projects
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 col-xl-2 mb-8 mb-xl-0">
              <ul className="footer-menu list-unstyled mb-0 d-flex flex-column gap-2">
                <li>
                  <a
                    className="link-hover fs-5 text-white"
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    className="link-hover fs-5 text-white"
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    className="link-hover fs-5 text-white"
                    href={profile.cvPath}
                    download
                  >
                    Download CV
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-4 col-xl-3 mb-8 mb-xl-0">
              <p className="mb-0 text-white text-opacity-70 text-md-end">
                © {profile.name} copyright 2026
              </p>
            </div>
          </div>
        </div>
      </footer>

      <div className="get-template hstack gap-2">
        <button
          type="button"
          className="btn bg-primary p-2 round-52 rounded-circle hstack justify-content-center flex-shrink-0"
          id="scrollToTopBtn"
          aria-label="Scroll to top"
          style={{ display: showScrollTop ? "flex" : "none" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Iconify icon="lucide:arrow-up" className="fs-7 text-dark" />
        </button>
      </div>

      {/* Project Case Study Modal Dialog */}
      <dialog
        ref={dialogRef}
        className="studiova-modal"
        onClose={() => setSelectedProject(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setSelectedProject(null);
        }}
        aria-labelledby="modal-title"
      >
        {selectedProject && (
          <div className="p-6 p-lg-8 bg-white text-dark">
            <div className="d-flex align-items-start justify-content-between gap-4 border-bottom pb-4">
              <div>
                <span className="badge text-bg-dark mb-2">
                  {selectedProject.status} · {selectedProject.period}
                </span>
                <h3 id="modal-title" className="mb-1">
                  {selectedProject.title}
                </h3>
                <p className="mb-0 fw-semibold">{selectedProject.client}</p>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label="Close modal"
                onClick={() => setSelectedProject(null)}
              />
            </div>

            <p className="mt-4 fs-5 text-dark">{selectedProject.summary}</p>

            <h6 className="mt-5 mb-3 fw-bold">Key Highlights & Deliverables:</h6>
            <ul className="list-unstyled d-flex flex-column gap-3">
              {selectedProject.bullets.map((b, i) => (
                <li key={i} className="hstack align-items-start gap-3">
                  <span className="round-32 rounded-circle bg-primary flex-shrink-0 hstack justify-content-center">
                    <Iconify icon="lucide:check" className="fs-6 text-dark" />
                  </span>
                  <span className="text-dark">{b}</span>
                </li>
              ))}
            </ul>

            <div className="hstack gap-2 flex-wrap mt-4">
              {selectedProject.stack.map((t) => (
                <span key={t} className="badge text-dark border">
                  {t}
                </span>
              ))}
            </div>

            <div className="hstack justify-content-end gap-3 border-top pt-4 mt-5">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="btn btn-dark text-white px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
