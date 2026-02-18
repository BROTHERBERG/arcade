import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Clock,
  Stethoscope,
  FileText,
  CheckCircle,
  Smartphone,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Activity,
  Smile,
  Play,
  AlertTriangle,
  Cookie,
  ExternalLink,
} from "lucide-react";

// --- Custom Hooks ---

const useIntersectionObserver = (options = {}) => {
  const [elements, setElements] = useState([]);
  const [entries, setEntries] = useState([]);

  const observer = useRef(null);

  useEffect(() => {
    if (elements.length) {
      observer.current = new IntersectionObserver(
        (ioEntries) => {
          setEntries(ioEntries);
        },
        { threshold: 0.1, ...options },
      );

      elements.forEach((el) => observer.current.observe(el));
    }
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [elements, options]);

  return [setElements, entries];
};

// --- Components ---

const Reveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 800,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible)
      return "opacity-100 translate-x-0 translate-y-0 scale-100 filter-blur-0";

    switch (direction) {
      case "up":
        return "opacity-0 translate-y-12";
      case "down":
        return "opacity-0 -translate-y-12";
      case "left":
        return "opacity-0 -translate-x-12";
      case "right":
        return "opacity-0 translate-x-12";
      case "zoom":
        return "opacity-0 scale-90";
      default:
        return "opacity-0 translate-y-12";
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} transition-all ease-out transform ${getTransform()}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const Navbar = ({ openModal, onNavigateHome, onNavigateCabinet = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Updated order: Équipe first, then Cabinet
  const navLinks = [
    { name: "Équipe", href: "#equipe" },
    { name: "Cabinet", href: "#cabinet", action: onNavigateCabinet || null },
    { name: "Appareils", href: "#appareils" },
    { name: "Traitements", href: "#traitements" },
    { name: "Accès", href: "#acces" },
  ];

  const handleLogoClick = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm h-20" : "bg-white h-24"}`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-10 h-full flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer group flex-shrink-0"
          onClick={handleLogoClick}
        >
          <img
            src="/logo.png"
            alt="Arcade Orthodontie"
            className="h-14 w-auto object-contain transform group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 lg:space-x-10 items-center">
          {navLinks.map((link) =>
            link.action ? (
              <button
                key={link.name}
                onClick={link.action}
                className="text-sm font-semibold text-gray-600 hover:text-[#e89c4d] transition uppercase tracking-wide relative group py-2 font-montserrat"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e89c4d] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-gray-600 hover:text-[#e89c4d] transition uppercase tracking-wide relative group py-2 font-montserrat"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e89c4d] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ),
          )}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            onClick={openModal}
            className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition-all duration-300 shadow-lg transform hover:-translate-y-1 font-montserrat"
          >
            PRENDRE RDV
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white absolute w-full shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 border-t" : "max-h-0"}`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2 flex flex-col items-center">
          {navLinks.map((link) =>
            link.action ? (
              <button
                key={link.name}
                onClick={() => {
                  setIsOpen(false);
                  link.action();
                }}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-[#e89c4d] hover:bg-gray-50 w-full text-center rounded-lg transition font-montserrat"
              >
                {link.name}
              </button>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-[#e89c4d] hover:bg-gray-50 w-full text-center rounded-lg transition font-montserrat"
              >
                {link.name}
              </a>
            ),
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              openModal();
            }}
            className="mt-4 w-full bg-[#1a1a1a] text-white px-6 py-4 rounded-full text-sm font-bold tracking-widest hover:bg-gray-800 transition font-montserrat"
          >
            PRENDRE RDV
          </button>
        </div>
      </div>
    </header>
  );
};

const BirdGradient = ({ children = null }) => (
  <div
    className="relative overflow-hidden"
    style={{ marginTop: "-6rem", paddingTop: "6rem" }}
  >
    {/* Background gradient layers */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5e6d3]/40 to-[#e89c4d]/20 pointer-events-none" />

    {/* Bird decoration — left side */}
    <img
      src="/birdbg.png"
      alt=""
      className="absolute bottom-0 left-0 w-60 md:w-80 h-auto opacity-15 pointer-events-none select-none"
    />

    {/* 3D tooth — right side */}
    <img
      src="/3D-tooth.png"
      alt=""
      className="absolute bottom-0 right-20 md:right-28 w-32 md:w-44 h-auto opacity-90 pointer-events-none select-none drop-shadow-2xl"
    />
    <div className="absolute bottom-20 right-52 md:right-64 text-[#e89c4d] text-2xl opacity-60 animate-pulse pointer-events-none select-none">
      ✦
    </div>
    <div
      className="absolute bottom-28 right-40 md:right-52 text-[#e89c4d] text-sm opacity-40 animate-pulse pointer-events-none select-none"
      style={{ animationDelay: "0.5s" }}
    >
      ✦
    </div>

    {/* Content rendered on top */}
    {children ? (
      <div className="relative z-10">{children}</div>
    ) : (
      <div className="h-48 md:h-56" />
    )}
  </div>
);

const FAB = ({ openModal }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex-col gap-3 font-montserrat">
      {[
        {
          icon: Phone,
          action: () => window.open("tel:0262215121"),
          label: "02 62 21 51 21",
          width: 180,
        },
        {
          icon: MapPin,
          action: () =>
            document
              .getElementById("acces")
              .scrollIntoView({ behavior: "smooth" }),
          label: "69 Rue Alexis de Villeneuve",
          width: 280,
        },
        {
          icon: Mail,
          action: () => window.open("mailto:contact@arcade-ortho.re"),
          label: "Contactez-nous par email",
          width: 260,
        },
      ].map((item, idx) => (
        <button
          key={idx}
          onClick={item.action}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          aria-label={item.label}
          className="cursor-pointer flex items-center justify-end"
          style={{
            position: "relative",
            height: "56px",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {/* Expanding drawer - connects seamlessly to circle */}
          <div
            style={{
              position: "absolute",
              right: "0",
              height: "56px",
              backgroundColor: "#1a1a1a",
              borderRadius: "28px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              paddingRight: "56px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              width: hoveredIdx === idx ? `${item.width + 56}px` : "56px",
              opacity: hoveredIdx === idx ? 1 : 0,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                opacity: hoveredIdx === idx ? 1 : 0,
                transition: "opacity 0.3s ease-out 0.1s",
              }}
            >
              {item.label}
            </span>
          </div>

          {/* Circle button - always on top */}
          <div
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: hoveredIdx === idx ? "#1a1a1a" : "#e89c4d",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              position: "relative",
              zIndex: 10,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <item.icon size={22} color="white" />
          </div>
        </button>
      ))}
    </div>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    "/hero1.webp",
    "/hero2.jpg",
    "/hero3.webp",
    "/hero4.webp",
    "/hero5.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text Content */}
          <div className="relative z-20 order-2 lg:order-1">
            <Reveal direction="left" duration={1000}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight font-montserrat mb-4">
                Votre Sourire,
                <br />
                <span className="text-[#e89c4d]">Notre Art</span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-light max-w-md">
                Cabinet d'orthodontie ARCADE - Excellence et innovation au
                service de votre sourire
              </p>
            </Reveal>

            <Reveal delay={200} direction="right" duration={1000}>
              <div className="bg-white inline-block px-6 py-3 rounded-full shadow-md mt-6 border border-gray-100">
                <h2 className="text-base md:text-lg font-medium text-gray-600 tracking-widest uppercase flex items-center font-montserrat">
                  <MapPin className="text-[#e89c4d] mr-2" size={20} />
                  Saint-Denis La Réunion
                </h2>
              </div>
            </Reveal>
          </div>

          {/* Right: Image Slider with Organic Bubble Shape */}
          <div className="relative order-1 lg:order-2 lg:-ml-8 lg:mr-16">
            <Reveal delay={300} direction="zoom" duration={1200}>
              {/* Flowing organic shape container */}
              <div className="relative w-full aspect-[4/3] lg:aspect-square">
                {/* SVG Clip Path for organic bubble shape */}
                <svg className="absolute inset-0 w-0 h-0">
                  <defs>
                    <clipPath
                      id="organicBubble"
                      clipPathUnits="objectBoundingBox"
                    >
                      <path
                        d="M 0.1,0.05
                               C 0.05,0.05 0.02,0.15 0.02,0.25
                               C 0.02,0.4 0.05,0.55 0.1,0.65
                               C 0.15,0.75 0.15,0.85 0.2,0.9
                               C 0.3,0.98 0.45,0.98 0.6,0.95
                               C 0.75,0.92 0.88,0.85 0.95,0.75
                               C 0.98,0.65 0.98,0.5 0.95,0.35
                               C 0.92,0.2 0.85,0.1 0.75,0.05
                               C 0.6,0.02 0.4,0.02 0.25,0.05
                               C 0.18,0.05 0.12,0.05 0.1,0.05 Z"
                      />
                    </clipPath>
                  </defs>
                </svg>

                {/* Background blob with gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#e89c4d] via-[#f5b976] to-[#d88a3a]"
                  style={{ clipPath: "url(#organicBubble)" }}
                />

                {/* Image slider with crossfade */}
                {heroImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Hero ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
                    style={{
                      clipPath: "url(#organicBubble)",
                      opacity: currentSlide === idx ? 1 : 0,
                      zIndex: currentSlide === idx ? 1 : 0,
                    }}
                  />
                ))}

                {/* Decorative floating elements */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#e89c4d]/10 rounded-full blur-2xl animate-pulse" />
                <div
                  className="absolute -top-8 -left-8 w-24 h-24 bg-orange-200/20 rounded-full blur-xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const CabinetPage = ({ onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pt-24">
        {/* Hero Header with bird decoration */}
        <div className="relative bg-gradient-to-r from-[#e89c4d] to-[#f4a860] py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Notre cabinet
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <button onClick={onClose} className="hover:text-white transition">
                Accueil
              </button>
              <span>/</span>
              <span className="text-white">Notre cabinet</span>
            </div>
          </div>

          {/* Bird decoration */}
          <img
            src="/birdbg.png"
            alt="Bird decoration"
            className="absolute -top-12 right-0 w-72 h-72 md:w-[400px] md:h-[400px] opacity-15"
          />
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Philosophy Section with Cabinet Image */}
          <Reveal direction="up">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16 grid grid-cols-1 lg:grid-cols-2">
              {/* Text side */}
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 lg:order-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Notre Philosophie
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Au sein de notre cabinet d'orthodontie, l'accueil et l'écoute
                  des patients sont primordiaux. Vous serez reçu par une équipe
                  chaleureuse et professionnelle, dédiée à vous accompagner tout
                  au long de votre traitement bucco-dentaire. Nous sommes
                  convaincus que chaque patient mérite une attention
                  personnalisée et un cadre apaisant. C'est pourquoi nous
                  veillons à instaurer une atmosphère sereine et un climat de
                  confiance.
                </p>
              </div>

              {/* Image side */}
              <div className="order-1 lg:order-2">
                <img
                  src="/cabinet.webp"
                  alt="Cabinet orthodontie"
                  className="w-full h-full object-cover min-h-[300px]"
                />
              </div>
            </div>
          </Reveal>

          {/* Dentapoche Card */}
          <Reveal direction="up" delay={100}>
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl shadow-xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="bg-white rounded-3xl p-8 shadow-lg">
                  <img
                    src="/dentapoche-orange.svg"
                    alt="Dentapoche"
                    className="w-32 h-32 mx-auto"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Suivez vos rendez-vous avec Dentapoche!
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Facilitez le suivi de votre traitement orthodontique avec
                  l'application Dentapoche!
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="#" className="inline-block">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play"
                      className="h-12"
                    />
                  </a>
                  <a href="#" className="inline-block">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="App Store"
                      className="h-12"
                    />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Values Section */}
          <div className="mb-16">
            <Reveal direction="down">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Nos valeurs
              </h2>
            </Reveal>

            {/* First row - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Reveal direction="up" delay={100}>
                <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl hover:bg-orange-50 transition duration-300 border-2 border-[#e89c4d]/30 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    <img
                      src="/icon-ponctualite.png"
                      alt="Ponctualité"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Ponctualité
                  </h3>
                </div>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl hover:bg-orange-50 transition duration-300 border-2 border-[#e89c4d]/30 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    <img
                      src="/icon-clarte.png"
                      alt="Clarté"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Clarté</h3>
                </div>
              </Reveal>

              <Reveal direction="up" delay={300}>
                <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl hover:bg-orange-50 transition duration-300 border-2 border-[#e89c4d]/30 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    <img
                      src="/icon-accompagnment.png"
                      alt="Accompagnement"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Accompagnement
                  </h3>
                </div>
              </Reveal>
            </div>

            {/* Second row - 2 cards centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Reveal direction="up" delay={400}>
                <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl hover:bg-orange-50 transition duration-300 border-2 border-[#e89c4d]/30 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    <img
                      src="/icon-accompagnment.png"
                      alt="Écoute"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Écoute</h3>
                </div>
              </Reveal>

              <Reveal direction="up" delay={500}>
                <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-xl hover:bg-orange-50 transition duration-300 border-2 border-[#e89c4d]/30 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    <img
                      src="/icon-professional.png"
                      alt="Professionnalisme"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Professionnalisme
                  </h3>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Technologies Preview Section */}
          <Reveal direction="up">
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-xl p-8 md:p-12 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Images side */}
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="/tech-a.webp"
                    alt="Studio photo"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />
                  <img
                    src="/tech-b.jpg"
                    alt="Scanner 3D"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />
                </div>

                {/* Text side */}
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Nos technologies
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Découvrez les technologies de notre cabinet en cliquant sur
                    le bouton ci-dessous :
                  </p>
                  <button className="bg-[#1a1a1a] text-white px-10 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg">
                    DÉCOUVRIR
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Cabinet Gallery Section */}
          <div className="mb-16">
            <Reveal direction="up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Nos espaces
              </h2>
            </Reveal>
            <Reveal direction="up" delay={100}>
              <div className="bg-[#f5e6d3] rounded-3xl p-6 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="overflow-hidden rounded-2xl shadow-lg h-[280px] md:h-[350px]">
                    <img
                      src="/cabinet-1.webp"
                      alt="Salle d'attente"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-xl h-[320px] md:h-[400px]">
                    <img
                      src="/cabinet-2.webp"
                      alt="Accueil du cabinet"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-lg h-[280px] md:h-[350px]">
                    <img
                      src="/cabinet-3.webp"
                      alt="Espace de soins"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Return button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg"
            >
              RETOUR
            </button>
          </div>
        </div>
      </div>

      <BirdGradient />
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const Cabinet = ({ onShowCabinetPage }) => {
  return (
    <section id="cabinet" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <Reveal direction="up" duration={1000}>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light mb-12 font-montserrat">
            Nous vous souhaitons la bienvenue sur notre site internet où vous
            trouverez des informations relatives aux soins que nous proposons.
            Un cadre chaleureux dans lequel nous avons plaisir de vous
            accompagner et conseiller tout au long de votre traitement.
          </p>
          <button
            onClick={() => onShowCabinetPage && onShowCabinetPage()}
            className="bg-[#1a1a1a] text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            DÉCOUVRIR NOTRE CABINET
          </button>
        </Reveal>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-24 mt-16">
        <Reveal direction="zoom">
          <h3 className="text-3xl font-medium text-center text-gray-900 mb-12 font-montserrat">
            Un espace dédié à votre confort
          </h3>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Accueil", img: "/cabinet-1.webp", delay: 0 },
            { title: "Salles de soin", img: "/cabinet.webp", delay: 150 },
            { title: "Stérilisation", img: "/tech-f.webp", delay: 300 },
          ].map((item, idx) => (
            <Reveal
              key={idx}
              delay={item.delay}
              direction="up"
              className="rounded-3xl overflow-hidden shadow-lg h-64 relative group cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#1a1a1a]/20 group-hover:bg-[#1a1a1a]/10 transition" />
              <div className="absolute bottom-4 left-4 text-white font-medium bg-[#e89c4d]/90 px-4 py-1 rounded-full text-sm font-montserrat">
                {item.title}
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* App Promotion */}
      <div className="max-w-6xl mx-auto px-4">
        <Reveal direction="left" duration={1000}>
          <div className="bg-white rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center shadow-xl border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-bl-full opacity-50 group-hover:scale-110 transition duration-700" />
            <div className="bg-gradient-to-br from-[#e89c4d] to-orange-400 p-8 rounded-3xl text-white mb-8 md:mb-0 md:mr-12 flex-shrink-0 z-10 shadow-lg rotate-3 transform transition hover:rotate-0 hover:shadow-orange-300/50 flex items-center justify-center">
              <img
                src="/dentapoche.png"
                alt="Dentapoche"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="flex-grow text-center md:text-left z-10">
              <h3 className="text-3xl font-bold text-[#e89c4d] mb-4 font-montserrat">
                Suivez vos rendez-vous avec Dentapoche!
              </h3>
              <p className="text-gray-500 text-lg mb-8 max-w-xl font-montserrat">
                Facilitez le suivi de votre traitement orthodontique avec
                l'application Dentapoche! Retrouvez vos prochains RDV, vos
                documents et conseils.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start font-montserrat">
                <a
                  href="https://play.google.com/store/apps/details?id=fr.orqual.monortho&hl=fr&gl=US"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-gray-800 transition shadow-md w-full sm:w-auto justify-center transform hover:-translate-y-1"
                >
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[0.65rem] uppercase text-gray-300">
                      TÉLÉCHARGER SUR
                    </span>
                    <span className="font-bold text-base">GooglePlay</span>
                  </div>
                </a>
                <a
                  href="https://apps.apple.com/fr/app/dentapoche/id1459356041"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl flex items-center space-x-3 hover:bg-gray-800 transition shadow-md w-full sm:w-auto justify-center transform hover:-translate-y-1"
                >
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[0.65rem] uppercase text-gray-300">
                      TÉLÉCHARGER DANS
                    </span>
                    <span className="font-bold text-base">L'App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const DoctorProfile = ({ onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pt-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e89c4d] to-[#f5b976] py-16 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Dr Matthieu Hutin
            </h1>
            <p className="text-white/90 text-xl font-medium">Orthodontiste</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
            {/* Doctor image and badge */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 bg-gradient-to-br from-[#fae8d1] to-white">
              <div className="relative">
                <div className="w-64 h-64 bg-[#fae8d1] rounded-[2rem] overflow-hidden shadow-xl relative">
                  <img
                    src="/matthieu-1.jpg"
                    alt="Dr Matthieu Hutin"
                    className="w-full h-full object-cover object-top absolute inset-0 hover:opacity-0 transition-opacity duration-200"
                  />
                  <img
                    src="/matthieu-2.jpg"
                    alt="Dr Matthieu Hutin"
                    className="w-full h-full object-cover object-top absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                {/* Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full shadow-xl p-3 border-4 border-[#e89c4d]">
                  <div className="text-center">
                    <div className="text-xs font-bold text-[#e89c4d] uppercase">
                      Depuis
                    </div>
                    <div className="text-2xl font-bold text-gray-900">2019</div>
                  </div>
                </div>
              </div>

              {/* Title section */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#e89c4d] mb-4">
                  Orthodontiste
                </h2>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#e89c4d] rounded-full mt-2 flex-shrink-0" />
                    <p className="text-base">
                      Diplôme d'études spécialisées en orthopédie Dento-Faciale,
                      Nancy
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#e89c4d] rounded-full mt-2 flex-shrink-0" />
                    <p className="text-base">
                      Diplôme de chirurgie dentaire, Lille
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">
                  Il choisi cette spécialité car il est attiré par l'esthétique
                  et l'opportunité de rendre le sourire à ses patients. Après
                  avoir travaillé dans des cabinets d'orthodontie en métropole,
                  il décide de s'installer à la Réunion en 2019.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mt-6">
                  Le Dr. Hutin a une approche minutieuse et accorde une grande
                  importance à ce que ses patients comprennent pleinement les
                  traitements engagés. Il est également conscient de la
                  bienveillance envers ses patients et valorise la ponctualité
                  et l'organisation de son cabinet.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mt-6">
                  Passionné par les nouvelles technologies, il les intègre dans
                  sa pratique quotidienne. En dehors de son travail, le Dr.
                  Hutin aime les sports en plein air, la cuisine et la culture
                  pop.
                </p>
              </div>
            </div>

            {/* Return button */}
            <div className="p-8 md:p-12 pt-0 text-center">
              <button
                onClick={onClose}
                className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-sm font-bold tracking-widest hover:bg-[#e89c4d] transition-all duration-300 shadow-lg transform hover:-translate-y-1"
              >
                RETOUR
              </button>
            </div>
          </div>
        </div>
      </div>

      <BirdGradient />
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const Team = ({ onShowDoctorProfile }) => {
  return (
    <section id="equipe" className="py-24 bg-white relative overflow-visible">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 -z-10 rounded-l-[100px]" />
      {/* Orange gradient blob on the left - much more visible */}
      <div
        className="absolute -left-32 top-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#e89c4d]/40 via-[#f5b976]/30 to-[#fcd9b8]/20 rounded-full blur-[100px] animate-pulse"
        style={{ zIndex: 0 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="down">
          <h2 className="text-4xl md:text-5xl font-medium text-center text-gray-900 mb-24 relative inline-block w-full font-montserrat">
            Notre équipe
            <span className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#e89c4d] rounded-full" />
          </h2>
        </Reveal>

        {/* Doctor */}
        <div className="flex flex-col items-center mb-24 relative">
          <Reveal direction="left">
            <h3 className="text-3xl font-light text-gray-800 mb-12 flex items-center font-montserrat">
              <span className="w-12 h-[1px] bg-[#e89c4d] mr-4" />
              Les orthodontistes
              <span className="w-12 h-[1px] bg-[#e89c4d] ml-4" />
            </h3>
          </Reveal>
          <Reveal direction="zoom" delay={200} className="group relative">
            <div
              className="w-80 h-80 bg-[#fae8d1] rounded-[2.5rem] overflow-hidden relative shadow-xl transform transition duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl cursor-pointer"
              onClick={() => onShowDoctorProfile && onShowDoctorProfile()}
            >
              <img
                src="/matthieu-1.jpg"
                alt="Dr Matthieu Hutin"
                className="w-full h-full object-cover object-top absolute inset-0 group-hover:opacity-0 transition-opacity duration-200"
              />
              <img
                src="/matthieu-2.jpg"
                alt="Dr Matthieu Hutin"
                className="w-full h-full object-cover object-top absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
              <div className="absolute bottom-5 left-5 bg-[#1a1a1a] text-white w-12 h-12 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                <ArrowRight size={20} />
              </div>
            </div>
            <div className="text-center mt-8 font-montserrat">
              <h4 className="text-2xl font-bold text-gray-900">
                Dr Matthieu Hutin
              </h4>
              <p className="text-base text-gray-500 mt-2 max-w-xs mx-auto font-medium">
                Orthodontiste, spécialiste qualifié en orthopédie dento-faciale
              </p>
            </div>
          </Reveal>
        </div>

        {/* Assistants */}
        <div className="text-center">
          <Reveal direction="right">
            <h3 className="text-3xl font-light text-gray-800 mb-16 flex items-center justify-center font-montserrat">
              <span className="w-12 h-[1px] bg-[#e89c4d] mr-4" />
              Et nos assistantes dentaires qualifiées
              <span className="w-12 h-[1px] bg-[#e89c4d] ml-4" />
            </h3>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            {[
              {
                name: "Ketty",
                role: "Assistante dentaire",
                img1: "/ketty-1.jpg",
                img2: "/ketty-2.jpg",
                delay: 0,
              },
              {
                name: "Sarah",
                role: "Assistante dentaire",
                img1: "/sarah-1.jpg",
                img2: "/sarah-2.jpg",
                delay: 200,
              },
              {
                name: "Régine",
                role: "Secrétaire",
                img1: "/regine-1.jpg",
                img2: "/regine-2.jpg",
                delay: 400,
              },
            ].map((member, idx) => (
              <Reveal
                key={idx}
                delay={member.delay}
                direction="up"
                className="flex flex-col items-center group font-montserrat"
              >
                <div className="w-64 h-64 bg-[#fae8d1] rounded-[2rem] overflow-hidden shadow-lg transform transition duration-300 group-hover:scale-105 border-4 border-white ring-1 ring-gray-100 relative">
                  <img
                    src={member.img1}
                    alt={member.name}
                    className="w-full h-full object-cover object-top absolute inset-0 group-hover:opacity-0 transition-opacity duration-200"
                  />
                  <img
                    src={member.img2}
                    alt={member.name}
                    className="w-full h-full object-cover object-top absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mt-6 group-hover:text-[#e89c4d] transition">
                  {member.name}
                </h4>
                <p className="text-gray-500 font-medium">{member.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const AppareilDetail = ({ appareil, onClose, onNavigateAppareil, onNavigateOrthodontiste }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Helper: auto-link "orthodontiste" words in orange
  const linkifyOrthodontiste = (text: string) => {
    const regex = /(orthodontiste(?:s)?)/gi;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (regex.test(part)) {
        return (
          <button
            key={i}
            onClick={() => onNavigateOrthodontiste?.()}
            className="text-[#e89c4d] font-semibold hover:underline cursor-pointer"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  };

  if (!appareil) return null;

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-white pt-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e89c4d] to-[#f5b976] py-16 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              {appareil.title}
            </h1>
            <p className="text-white/80 text-sm">
              Accueil / Appareils / {appareil.title}
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Intro section */}
          <Reveal direction="up">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {appareil.subtitle}
              </h2>
              {appareil.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-gray-700 leading-relaxed text-justify mb-4"
                >
                  {linkifyOrthodontiste(paragraph)}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Video embed */}
          {appareil.videoUrl && (
            <Reveal direction="up" delay={100}>
              <div className="mb-14 rounded-2xl overflow-hidden shadow-xl aspect-video">
                <iframe
                  src={appareil.videoUrl}
                  title={appareil.title}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Reveal>
          )}

          {/* Sections with optional images */}
          {appareil.sections &&
            appareil.sections.map((section, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 80}>
                <div className="mb-12">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  {section.content.map((paragraph, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-gray-700 leading-relaxed text-justify mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.img && (
                    <div className="mt-6 rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={section.img}
                        alt={section.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
        </div>
      </div>

      <BirdGradient>
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-16">
          {/* Cross-links */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm">
              À découvrir également :{" "}
              {appareilsData
                .filter((a) => a.id !== appareil.id && a.id !== "contention")
                .map((a, idx, arr) => (
                  <React.Fragment key={a.id}>
                    <button
                      onClick={() =>
                        onNavigateAppareil && onNavigateAppareil(a.id)
                      }
                      className="text-[#e89c4d] hover:underline font-medium"
                    >
                      {a.title}
                    </button>
                    {idx < arr.length - 2
                      ? ", "
                      : idx === arr.length - 2
                        ? " et "
                        : ""}
                  </React.Fragment>
                ))}{" "}
              au Cabinet d'orthodontie Arcade
            </p>
          </div>

          {/* Return button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-sm font-bold tracking-widest hover:bg-[#e89c4d] transition-all duration-300 shadow-lg transform hover:-translate-y-1"
            >
              RETOUR
            </button>
          </div>
        </div>
      </BirdGradient>
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

// Appareils data - shared between Appareils section and AppareilDetail page
const appareilsData = [
  {
    id: "interceptive",
    title: "Orthodontie interceptive",
    subtitle:
      "Qu'est-ce que l'orthodontie interceptive ou interception orthodontique ?",
    img: "/orthodontie-interceptive.webp",
    content: [
      "L'orthodontie interceptive ou interception en orthodontique est une approche préventive proposée par votre orthodontiste qui vise à corriger les anomalies dentaires dès leur apparition ou avant leur apparition, généralement chez les enfants ayant encore des dents de lait, afin d'éviter des traitements plus complexes plus tard.",
      "L'orthodontie interceptive peut également agir sur le développement harmonieux des mâchoires et sur l'harmonisation des fonctions oro-faciales : déglutition, respiration, phonation et mastication.",
    ],
    sections: [
      {
        title: "Dans quel cas avoir recours à l'orthodontie interceptive ?",
        content: [
          "Les orthodontistes préconisent le traitement d'interception orthodontique chez les jeunes patients qui ont encore des dents de lait. Ce traitement est recommandé lorsque l'enfant présente divers problèmes dentaires.",
        ],
      },
      {
        title: "La succion du pouce et les béances",
        content: [
          "Il est essentiel d'arrêter la succion du pouce sans la remplacer par une autre parafonction. L'orthodontie peut fournir des conseils pour cet arrêt et, si nécessaire, installer un appareil pour aider. Après l'arrêt de la succion, une rééducation de la déglutition et de la position linguale chez un kinésithérapeute ou un orthophoniste est souvent recommandée. Pour repositionner correctement les dents et rétablir le contact entre celles du haut et celles du bas, un traitement orthodontique avec bagues ou gouttières est ensuite nécessaire.",
        ],
      },
      {
        title: "Déséquilibre de largeur entre les mâchoires (articulé inversé)",
        content: [
          "Il est alors nécessaire d'élargir la mâchoire du haut avec un appareil fixe : disjoncteur maxillaire, expander et Quad'helix, ou amovible : plaque à vérin. Le déséquilibre de largeur des mâchoires étant souvent associé à une déviation de la mâchoire du bas d'un côté ou de l'autre, il est important de corriger cette malocclusion le plus tôt possible.",
        ],
      },
      {
        title: "Espace insuffisant pour l'évolution des dents définitives",
        content: [
          "Il est alors possible d'avoir recours à des appareils d'orthodontie interceptive pour faciliter l'arrivée des dents définitives. Ces appareils peuvent être fixes (bagues) ou amovibles (plaques en résine). Il est parfois également possible d'avoir recours à l'extraction d'une dent de lait pour faciliter l'évolution d'une dent définitive.",
        ],
      },
      {
        title: "Déviation de la mâchoire du bas d'un côté",
        content: [
          "Une mâchoire du haut trop étroite ou une interférence avec une ou plusieurs dents peut en être la cause. Certains appareils d'orthodontie interceptive, fixes ou amovibles, peuvent alors corriger cette déviation le plus tôt possible, évitant une croissance asymétrique de la mâchoire du bas.",
        ],
      },
      {
        title: "L'articulé inversé antérieur",
        content: [
          "L'orthodontie interceptive peut rétablir un articulé correct avec les dents du haut en avant des dents du bas. Si le jeune patient a une croissance de la mâchoire du bas trop importante, ou une mâchoire du haut trop faible, il est possible de guider, d'accélérer ou de ralentir la croissance d'une mâchoire ou de l'autre avec des appareils qui sont en général amovibles.",
        ],
      },
      {
        title: "Avantages à long terme",
        content: [
          "L'intervention précoce en orthodontie offre plusieurs avantages à long terme. Elle réduit la durée et la complexité des traitements à l'adolescence. Elle prévient aussi des problèmes de parole, de mastication et de respiration liés à une mauvaise occlusion non traitée. En intervenant tôt, l'orthodontiste utilise le potentiel de croissance de l'enfant pour obtenir des résultats optimaux.",
          "L'orthodontie interceptive est une étape importante pour assurer la santé bucco-dentaire à long terme des enfants. En commençant le traitement orthodontique tôt, il est possible de réduire significativement la nécessité de traitements plus invasifs à l'avenir.",
        ],
      },
      {
        title: "Appareils fixes : le disjoncteur maxillaire",
        content: [
          "Le disjoncteur maxillaire est un appareil d'orthodontie interceptive fixe utilisé lorsque la mâchoire supérieure est trop étroite. Son activation permet d'élargir la mâchoire supérieure. Contrairement aux appareils amovibles ou à activation lente, le disjoncteur a un effet osseux, plus stable à long terme. Il corrige l'occlusion et libère de l'espace pour l'alignement des dents. En élargissant les sinus maxillaires, il favorise également la respiration nasale.",
        ],
      },
      {
        title: "Appareils fixes : bagues et Quad'helix",
        content: [
          "Les orthodontistes utilisent des dispositifs avec bagues (brackets) en orthodontie interceptive pour corriger l'alignement des dents, même en présence de dents de lait. Ils guident les dents vers leur position idéale et créent suffisamment d'espace sur les mâchoires pour l'évolution des dents définitives.",
          "Les appareils type Quad'helix ou expander se fixent sur les 1ères molaires maxillaires et permettent d'élargir la mâchoire du haut, mais également de reformer la mâchoire supérieure.",
        ],
      },
      {
        title: "Appareils amovibles : propulseur et masque de Delaire",
        content: [
          "Les appareils de propulsion mandibulaire (PUL) sont utilisés quand la mâchoire du bas est trop en retrait. Cet appareil guide la croissance mandibulaire dans la bonne direction. Pour être efficaces, vous devez les porter au moins 20 heures par jour.",
          "Le masque de Delaire est utilisé quand la mâchoire du bas est trop grande par rapport à celle du haut. Il permet de tracter la mâchoire supérieure pour qu'elle rattrape la croissance de la mâchoire inférieure. Ce dispositif doit être porté 10 à 12 heures par jour, principalement la nuit.",
        ],
      },
    ],
  },
  {
    id: "visible",
    title: "Orthodontie visible",
    subtitle:
      "Appareil d'orthodontie visible métal : une solution efficace pour votre traitement",
    img: "/orthodontie-visible.webp",
    content: [
      "Les orthodontistes utilisent les bagues métalliques, ou appareil multi-attaches visible métal, pour corriger efficacement les malpositions dentaires. Cet appareil d'orthodontie visible se compose de boîtiers métalliques fixés sur chaque dent, reliés par un fil métallique.",
      "Les bagues métalliques sont souvent choisies pour leur robustesse et leur efficacité. Elles traitent une large gamme de problèmes orthodontiques, comme les chevauchements, les espaces excessifs, les dents mal alignées, et les malocclusions sévères.",
    ],
    sections: [
      {
        title: "Suivi et entretien",
        content: [
          "Un suivi régulier est essentiel pour tout traitement orthodontique. Votre orthodontiste ajustera les fils et les bagues pour déplacer progressivement les dents vers leur position idéale. Vous devez entretenir vos bagues métalliques avec une bonne hygiène dentaire.",
        ],
      },
    ],
  },
  {
    id: "discrete",
    title: "Orthodontie discrète",
    subtitle:
      "Orthodontie discrète : multi-attaches céramique et métal : une solution discrète et efficace",
    img: "/Orthodontie-discrete.webp",
    content: [
      "Le multi-attaches vestibulaire céramique maxillaire et métallique mandibulaire est une option discrète et performante proposée par votre orthodontiste pour corriger les malpositions dentaires.",
      "Ce dispositif combine des brackets en céramique sur les dents visibles avec des bagues métalliques discrètes. Il offre ainsi un équilibre parfait entre efficacité et discrétion. Les brackets en céramique rendent l'appareil moins visible que les bagues métalliques classiques.",
    ],
  },
  {
    id: "invisible",
    title: "Orthodontie Invisible",
    subtitle:
      "Le traitement d'orthodontie invisible par aligneurs ou gouttières",
    img: "/orthodontie-invisible.webp",
    content: [
      "L'orthodontie invisible utilise des aligneurs, des gouttières transparentes amovibles proposées par votre orthodontiste. Leur transparence les rend presque invisibles.",
      "Contrairement aux bagues métalliques, les gouttières sont sur mesure, fabriquées en matériaux transparents et quasiment invisibles. Cette solution est appréciée des adultes et adolescents pour son côté discret.",
    ],
    sections: [
      {
        title: "Avantages du traitement par gouttières invisibles",
        content: [
          "Le traitement orthodontique par gouttières invisibles offre de nombreux avantages : discrétion, confort, hygiène facilitée et liberté alimentaire. Les gouttières d'alignement sont amovibles, offrant une plus grande facilité pour le brossage.",
        ],
      },
    ],
  },
  {
    id: "contention",
    title: "Contention",
    subtitle:
      "La contention en orthodontie : une étape clé pour préserver votre sourire",
    img: "/contention.png",
    videoUrl: "https://www.youtube.com/embed/4HnLWog-TrY",
    content: [
      "Une fois votre traitement orthodontique terminé, la phase de contention est indispensable pour maintenir les résultats obtenus. Après avoir réaligné vos dents, celles-ci ont tendance à vouloir revenir à leur position d'origine. Utiliser un dispositif de contention permet de stabiliser les dents dans leur nouvelle position et d'éviter tout déplacement.",
    ],
    sections: [
      {
        title: "Les types de contention",
        content: [
          "Il existe deux types de contention principalement utilisés en orthodontie : la contention fixe et la contention amovible.",
        ],
      },
      {
        title: "Le fil collé fixe",
        img: "/contention-1.webp",
        content: [
          "Il s'agit d'un fil métallique discret, placé derrière les dents, généralement sur celles de devant. Ce fil empêche les dents de bouger et reste invisible lorsque vous souriez. Il s'agit d'une solution idéale pour assurer une stabilité continue sans intervention quotidienne de votre part. Les orthodontistes recommandent souvent ce dispositif pour garantir des résultats durables sur le long terme.",
        ],
      },
      {
        title: "Les gouttières et les plaques amovibles",
        img: "/contention-2.webp",
        content: [
          "La contention amovible prend la forme de gouttières transparentes ou de plaques de rétention. Vous devez porter ces dispositifs principalement la nuit pour maintenir vos dents dans leur position. Les gouttières transparentes, similaires à celles utilisées pour un traitement invisible, sont confortables et discrètes.",
        ],
      },
      {
        title: "Pourquoi la contention est-elle importante ?",
        content: [
          "Les premiers mois après le traitement sont cruciaux, car les dents sont encore en phase d'adaptation. Si vous ne suivez pas correctement la phase de rétention, vos dents risquent de se déplacer à nouveau. Dans certains cas, les orthodontistes recommandent de porter un fil collé fixe à vie pour prévenir toute rechute.",
        ],
      },
      {
        title: "Assurez la pérennité de vos résultats",
        content: [
          "En respectant les instructions sur la phase de rétention de votre orthodontiste, vous maintiendrez votre sourire et éviterez de devoir refaire un traitement. N'hésitez pas à poser toutes vos questions à votre orthodontiste pour choisir la solution la plus adaptée et garantir la stabilité de vos résultats orthodontiques.",
        ],
      },
    ],
  },
  {
    id: "chirurgie-orthognathique",
    title: "Chirurgie Orthognathique",
    subtitle: "Chirurgie Orthognathique : Tout ce qu'il faut savoir",
    img: "/traitment-chirurgie.jpg",
    content: [
      "La chirurgie orthognathique est une intervention chirurgicale qui vise à corriger les décalages des mâchoires, améliorant à la fois la fonctionnalité et l'esthétique du visage. Elle intervient dans le cadre de l'orthodontie lorsqu'un traitement orthodontique seul ne suffit pas à repositionner correctement les mâchoires et les dents.",
      "Cette chirurgie est réalisée en collaboration étroite entre l'orthodontiste et le chirurgien maxillo-facial. Avant l'intervention, un traitement orthodontique est nécessaire pour préparer les dents à leur nouvelle position. Après la chirurgie, des ajustements orthodontiques sont effectués pour peaufiner le résultat.",
    ],
    sections: [
      {
        title: "Quand envisager une chirurgie orthognathique ?",
        content: [
          "La chirurgie orthognathique est indiquée pour : améliorer une fonction masticatoire altérée, corriger des troubles de l'élocution liés à un mauvais alignement des mâchoires, restaurer un équilibre esthétique du visage, et traiter les troubles respiratoires, comme l'apnée obstructive du sommeil.",
        ],
      },
      {
        title: "Les avantages de la chirurgie orthognathique",
        content: [
          "Fonctionnalité : rétablir une occlusion correcte et une meilleure mastication. Confort : réduction des douleurs articulaires et des problèmes fonctionnels. Esthétique : amélioration significative de l'harmonie du visage. Santé globale : amélioration de la respiration et de la qualité de vie.",
        ],
      },
      {
        title: "Ostéotomie mandibulaire",
        content: [
          "L'ostéotomie mandibulaire vise à corriger une mandibule trop avancée (prognathisme mandibulaire) ou trop reculée (rétrognathie mandibulaire). Elle est indiquée lorsque la mâchoire inférieure est décalée par rapport à la mâchoire supérieure.",
        ],
      },
      {
        title: "Ostéotomie maxillaire",
        content: [
          "L'ostéotomie maxillaire permet de réaligner une mâchoire supérieure trop avancée, trop reculée, trop étroite ou asymétrique. Elle est indiquée pour les troubles respiratoires comme l'apnée du sommeil liée à une mauvaise position ou un manque de largeur du maxillaire.",
        ],
      },
      {
        title: "Chirurgie bimaxillaire et génioplastie",
        content: [
          "La chirurgie bimaxillaire corrige les désalignements combinés des mâchoires supérieure et inférieure, pour une amélioration globale de l'équilibre facial. La génioplastie (avancement du menton) corrige un menton trop en retrait ou asymétrique, en complément d'une autre chirurgie orthognathique.",
        ],
      },
      {
        title: "1. Consultation et planification",
        content: [
          "Consultation chez l'orthodontiste qui évalue le besoin d'un traitement associé à une chirurgie orthognathique. Consultation avec le chirurgien maxillo-facial pour planifier le traitement. Consultation avec un kinésithérapeute pour préparer la rééducation post-chirurgicale.",
        ],
      },
      {
        title: "2. Préparation orthodontique",
        content: [
          "Pose d'un appareil orthodontique pour aligner les dents et les préparer à leur position finale post-chirurgie. Cette phase est essentielle pour garantir que les mâchoires pourront être correctement repositionnées lors de l'intervention.",
        ],
      },
      {
        title: "3. Chirurgie et récupération",
        content: [
          "Réalisation de l'intervention sous anesthésie générale (2 à 6 heures selon la complexité). Hospitalisation de 1 à 3 jours, suivie d'un régime alimentaire adapté pendant les premières semaines et d'un suivi de rééducation chez le kinésithérapeute.",
        ],
      },
      {
        title: "4. Finitions et contention",
        content: [
          "Ajustements finaux de l'alignement des dents pour un résultat parfait, puis retrait de l'appareil orthodontique. Pose de dispositifs de contention pour stabiliser les dents et éviter les récidives, avec un suivi régulier.",
        ],
      },
    ],
  },
];

const Appareils = ({ onSelectAppareil }) => {
  return (
    <section id="appareils" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating grey container with rounded corners */}
        <div className="bg-[#e8e8e8] rounded-[3rem] p-8 md:p-12 lg:p-16">
          <Reveal direction="down">
            <h2 className="text-4xl font-medium text-center text-gray-900 mb-16 font-montserrat">
              Appareils
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 font-montserrat">
            {[
              {
                title: "Orthodontie interceptive",
                img: "/orthodontie-interceptive.webp",
                delay: 100,
                id: "interceptive",
              },
              {
                title: "Orthodontie visible",
                img: "/orthodontie-visible.webp",
                delay: 250,
                id: "visible",
              },
              {
                title: "Orthodontie discrète",
                img: "/Orthodontie-discrete.webp",
                delay: 400,
                id: "discrete",
              },
              {
                title: "Orthodontie Invisible",
                img: "/orthodontie-invisible.webp",
                delay: 550,
                id: "invisible",
              },
            ].map((item, idx) => (
              <Reveal key={idx} delay={item.delay} direction="up">
                <div
                  onClick={() => onSelectAppareil && onSelectAppareil(item.id)}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-[#e89c4d]/20 flex flex-col h-full group cursor-pointer"
                >
                  <div className="p-8 flex-grow flex items-center justify-center bg-white relative h-64">
                    <div className="absolute inset-0 bg-[#e89c4d]/5 opacity-0 group-hover:opacity-100 transition duration-500" />
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-contain rounded-xl transform group-hover:scale-110 transition duration-500 relative z-10"
                    />
                  </div>
                  <div className="bg-[#1a1a1a] py-5 px-2 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#e89c4d] transform -translate-x-full group-hover:translate-x-0 transition duration-300 ease-out z-0" />
                    <h3 className="text-white text-lg font-medium leading-tight relative z-10 group-hover:text-[#1a1a1a] transition">
                      {item.title.split(" ").map((word, i) => (
                        <span key={i} className="block">
                          {word}
                        </span>
                      ))}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Contention */}
          <Reveal direction="zoom" duration={1000}>
            <div className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl h-[400px] md:h-[350px]">
              {/* Gradient overlay - fades to transparent earlier (30%) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#e89c4d] via-[#e89c4d] via-30% to-transparent z-10" />
              {/* Bird - large decorative element spanning across */}
              <img
                src="/birdbg.png"
                alt=""
                role="presentation"
                className="absolute left-[30%] top-2 w-[500px] h-auto z-30 opacity-90"
              />
              {/* Teeth image - sized down, anchored to right */}
              <img
                src="/contention.png"
                alt="Fil de contention"
                className="absolute right-0 bottom-0 h-[85%] w-auto object-contain object-right-bottom z-20"
              />

              <div className="relative z-40 p-10 md:p-16 h-full flex flex-col justify-center max-w-xl">
                <h3 className="text-4xl font-bold text-white mb-4 font-montserrat">
                  Contention
                </h3>
                <p className="text-white text-sm md:text-base leading-relaxed mb-8 font-medium drop-shadow-sm max-w-md font-montserrat">
                  La phase de contention est essentielle après le
                  repositionnement des dents, car elle stabilise les dents dans
                  leur nouvelle configuration et prévient leur retour à la
                  position initiale.
                </p>
                <button
                  onClick={() =>
                    onSelectAppareil && onSelectAppareil("contention")
                  }
                  className="bg-[#1a1a1a] text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-white hover:text-[#1a1a1a] transition self-start shadow-lg transform hover:-translate-y-1 font-montserrat"
                >
                  DÉCOUVRIR
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Parcours = () => {
  const steps = [
    {
      num: "01",
      title: "1ère consultation",
      desc: "Examen clinique (radios, photos), échange avec le praticien, discussion sur le traitement proposé.",
      transition: "Analyse du cas",
    },
    {
      num: "02",
      title: "Bilan",
      desc: "Prise d'empreintes, remise de la fiche diagnostic, création du dossier administratif.",
      transition: "Fabrication de l'appareil",
    },
    {
      num: "03",
      title: "Pose de l'appareil",
      desc: "Début du traitement actif.",
      transition: "RDV d'activation",
    },
    { num: "04", title: "Dépose de l'appareil", desc: "Suivi de contention." },
  ];

  return (
    <section className="py-28 bg-[#faf9f7] overflow-hidden font-montserrat">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="text-center mb-6">
            <span className="text-[#e89c4d] text-xs font-bold tracking-[0.3em] uppercase">
              Votre parcours
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3">
              Parcours de soins
            </h2>
          </div>
        </Reveal>

        {/* Desktop — Card-based timeline */}
        <div className="hidden md:block mt-16">
          <Reveal direction="up" duration={800}>
            <div className="grid grid-cols-4 gap-6 relative">
              {/* Connecting line behind cards */}
              <div className="absolute top-[4.5rem] left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-[#e89c4d]/20 via-[#e89c4d]/40 to-[#e89c4d]/20 z-0" />

              {steps.map((item, idx) => (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center group"
                >
                  {/* Step number */}
                  <div className="text-[#e89c4d]/30 text-6xl font-black leading-none mb-2 group-hover:text-[#e89c4d]/50 transition-colors duration-500">
                    {item.num}
                  </div>

                  {/* Node */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-full border-2 border-[#e89c4d]/40 bg-white flex items-center justify-center transition-all duration-500 group-hover:border-[#e89c4d] group-hover:shadow-[0_0_30px_rgba(232,156,77,0.3)] group-hover:scale-110 parcours-node">
                      <div className="w-5 h-5 rounded-full bg-[#e89c4d]/20 group-hover:bg-[#e89c4d]/60 transition-all duration-500" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group-hover:shadow-lg group-hover:border-[#e89c4d]/20 transition-all duration-500 text-center w-full group-hover:-translate-y-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Transition label */}
                  {item.transition && (
                    <div className="absolute top-[4rem] -right-[1.5rem] translate-x-1/2 z-20">
                      <div className="bg-[#e89c4d]/10 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-[10px] font-semibold text-[#e89c4d] whitespace-nowrap">
                          {item.transition}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Mobile — Vertical card timeline */}
        <div className="md:hidden mt-12">
          <div className="relative pl-14">
            {/* Vertical line */}
            <div className="absolute left-[1.1rem] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e89c4d]/40 via-[#e89c4d]/20 to-[#e89c4d]/40" />

            <div className="space-y-10">
              {steps.map((item, idx) => (
                <Reveal
                  key={idx}
                  delay={idx * 100}
                  direction="left"
                  duration={600}
                >
                  <div className="relative">
                    {/* Node */}
                    <div className="absolute -left-[2.95rem] top-2 w-10 h-10 rounded-full border-2 border-[#e89c4d]/40 bg-white flex items-center justify-center parcours-node">
                      <span className="text-[#e89c4d] text-xs font-bold">
                        {item.num}
                      </span>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <h4 className="text-base font-bold text-gray-900 mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                      {item.transition && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <span className="text-[11px] font-semibold text-[#e89c4d]">
                            {item.transition} →
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Traitements = () => {
  const treatments = [
    {
      title: "Traitement fonctionnel",
      desc: "Le traitement fonctionnel est une méthode qui vise à corriger les dysfonctions comme la succion du pouce ou les troubles de la déglutition.",
      img: "/traitment-functionel.jpg",
    },
    {
      title: "Traitement orthopédique",
      desc: "Le traitement orthopédique utilise des appareils pour corriger les anomalies de croissance des os de la mâchoire chez les enfants et les adolescents. Ce traitement cible la structure osseuse elle-même, cherchant à modifier la croissance faciale pour atteindre un équilibre harmonieux entre les mâchoires et le visage.",
      img: "/traitment-ortho-1.jpg",
    },
    {
      title: "Traitement orthodontique",
      desc: "Le traitement orthodontique est principalement focalisé sur le déplacement des dents à l'intérieur de l'arcade dentaire pour obtenir un alignement optimal et une occlusion fonctionnelle.",
      img: "/traitment-ortho-2.jpg",
    },
    {
      title: "Traitement adulte",
      desc: "L'orthodontie adulte a pour but de corriger les anomalies liées à la dentition chez les adultes. Il est possible d'utiliser tous les appareils d'orthodontie chez les adultes, ceux-ci font plus souvent le choix d'un appareil discret.",
      img: "/traitment-adulte.jpg",
    },
    {
      title: "Chirurgie maxillo-faciale",
      desc: "Les traitements orthodontiques qui impliquent la chirurgie maxillo-faciale sont utilisés pour corriger les anomalies sévères des mâchoires qui ne peuvent être résolues par des appareils orthodontiques seuls. Ce type de traitement est souvent indiqué pour les décalages squelettiques importants.",
      img: "/traitment-chirurgie.jpg",
    },
  ];

  return (
    <section id="traitements" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title Card with orange drop shadow */}
          <Reveal direction="up" duration={800}>
            <div
              className="bg-white rounded-[2rem] p-12 flex flex-col justify-center border border-[#e89c4d]/20 aspect-square md:aspect-auto md:h-full font-montserrat"
              style={{ boxShadow: "8px 8px 0px 0px #e89c4d" }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Nos traitements
              </h2>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Des solutions adaptées à chaque âge et chaque besoin pour un
                sourire harmonieux.
              </p>
            </div>
          </Reveal>

          {/* Treatment Card 1 - Fonctionnel */}
          <Reveal direction="up" delay={100} duration={800}>
            <div className="relative rounded-[2rem] overflow-hidden group cursor-pointer aspect-square">
              <img
                src={treatments[0].img}
                alt={treatments[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Default: title pill */}
              <div className="absolute top-5 left-5 z-20 transition-opacity duration-300 group-hover:opacity-0">
                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm">
                  <span className="text-gray-900 font-semibold text-sm font-montserrat">
                    {treatments[0].title}
                  </span>
                </div>
              </div>
              {/* Hover: orange overlay with description */}
              <div className="absolute inset-0 bg-[#e89c4d]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10">
                <h4 className="text-white text-xl font-bold mb-3 font-montserrat">
                  {treatments[0].title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed font-montserrat">
                  {treatments[0].desc}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Treatment Card 2 - Orthopédique */}
          <Reveal direction="up" delay={150} duration={800}>
            <div className="relative rounded-[2rem] overflow-hidden group cursor-pointer aspect-square">
              <img
                src={treatments[1].img}
                alt={treatments[1].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 z-20 transition-opacity duration-300 group-hover:opacity-0">
                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm">
                  <span className="text-gray-900 font-semibold text-sm font-montserrat">
                    {treatments[1].title}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#e89c4d]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10">
                <h4 className="text-white text-xl font-bold mb-3 font-montserrat">
                  {treatments[1].title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed font-montserrat">
                  {treatments[1].desc}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Treatment Card 3 - Orthodontique */}
          <Reveal direction="up" delay={200} duration={800}>
            <div className="relative rounded-[2rem] overflow-hidden group cursor-pointer aspect-square">
              <img
                src={treatments[2].img}
                alt={treatments[2].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 z-20 transition-opacity duration-300 group-hover:opacity-0">
                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm">
                  <span className="text-gray-900 font-semibold text-sm font-montserrat">
                    {treatments[2].title}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#e89c4d]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10">
                <h4 className="text-white text-xl font-bold mb-3 font-montserrat">
                  {treatments[2].title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed font-montserrat">
                  {treatments[2].desc}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Treatment Card 4 - Adulte */}
          <Reveal direction="up" delay={250} duration={800}>
            <div className="relative rounded-[2rem] overflow-hidden group cursor-pointer aspect-square">
              <img
                src={treatments[3].img}
                alt={treatments[3].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 z-20 transition-opacity duration-300 group-hover:opacity-0">
                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm">
                  <span className="text-gray-900 font-semibold text-sm font-montserrat">
                    {treatments[3].title}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#e89c4d]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10">
                <h4 className="text-white text-xl font-bold mb-3 font-montserrat">
                  {treatments[3].title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed font-montserrat">
                  {treatments[3].desc}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Treatment Card 5 - Chirurgie */}
          <Reveal direction="up" delay={300} duration={800}>
            <div className="relative rounded-[2rem] overflow-hidden group cursor-pointer aspect-square">
              <img
                src={treatments[4].img}
                alt={treatments[4].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-5 left-5 z-20 transition-opacity duration-300 group-hover:opacity-0">
                <div className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-sm">
                  <span className="text-gray-900 font-semibold text-sm font-montserrat">
                    {treatments[4].title}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-[#e89c4d]/85 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 z-10">
                <h4 className="text-white text-xl font-bold mb-3 font-montserrat">
                  {treatments[4].title}
                </h4>
                <p className="text-white/90 text-sm leading-relaxed font-montserrat">
                  {treatments[4].desc}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const IncidentsPage = ({ onClose }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);

  const incidents = [
    {
      title: "Douleurs, inconfort, gêne",
      desc: "Cela reste habituel les jours suivants la pose de l'appareil et chaque réactivation de l'appareil. Si les douleurs persistent, prenez un antalgique type paracétamol.",
      icon: AlertTriangle,
    },
    {
      title: "Bague décollée",
      desc: "Appeler le cabinet, l'équipe évaluera la nécessité de revenir au cabinet avant votre prochain rendez-vous. Faire attention aux consignes alimentaires !",
      icon: Activity,
    },
    {
      title: "Contention cassée",
      desc: "Appelez le cabinet pour réparer l'appareil au plus vite.",
      icon: FileText,
    },
    {
      title: "Extrémité du fil irritante",
      desc: "Vous pouvez, dans la mesure du possible, couper l'extrémité du fil si ce dernier est fin (avec un coupe-ongles propre). N'oubliez pas de contacter le cabinet pour vous remettre un nouveau fil ou bien contactez le cabinet directement pour repositionnement du fil.",
      icon: Activity,
    },
    {
      title: "Traumatisme dentaire",
      desc: "Tout traumatisme dentaire nécessite une visite chez votre dentiste traitant dans un premier temps, dans un second temps, le dentiste pourra demander une visite chez l'orthodontiste si besoin.",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pt-24">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#e89c4d] to-[#d88a3a] py-16 relative overflow-hidden">
          <img
            src="/birdbg.png"
            alt=""
            role="presentation"
            className="absolute left-4 top-0 h-full w-auto opacity-40 z-0"
          />
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Les incidents en orthodontie
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <button onClick={onClose} className="hover:text-white transition">
                Accueil
              </button>
              <span>/</span>
              <span className="text-white">Les incidents en orthodontie</span>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Accordion Content */}
        <div className="max-w-3xl mx-auto px-4 py-16 relative">
          {/* Decorative bird lines in background */}
          <img
            src="/birdbg.png"
            alt=""
            role="presentation"
            className="absolute right-0 top-1/4 w-64 h-auto opacity-10 pointer-events-none"
          />

          <div className="space-y-4 relative z-10">
            {incidents.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                    isOpen
                      ? "bg-[#fae8d1]/40 border-[#e89c4d]/30 shadow-sm"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <div className="flex items-center gap-5 p-6">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen ? "bg-[#e89c4d]/10" : "bg-gray-100"
                      }`}
                    >
                      <item.icon
                        size={28}
                        className={`transition-colors ${isOpen ? "text-[#e89c4d]" : "text-gray-400"}`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3
                      className={`text-lg md:text-xl font-bold flex-grow transition-colors ${isOpen ? "text-gray-900" : "text-gray-700"}`}
                    >
                      {item.title}
                    </h3>
                    <ChevronDown
                      size={22}
                      className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  <div
                    className={`transition-all duration-300 ease-out overflow-hidden ${isOpen ? "max-h-48 pb-6" : "max-h-0"}`}
                  >
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed px-6 pl-[5.75rem]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3D Tooth decoration */}
          <div className="flex justify-center mt-16">
            <button
              onClick={onClose}
              className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg"
            >
              RETOUR
            </button>
          </div>
        </div>
      </div>

      <BirdGradient />
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const conseilsData = [
  {
    id: "hygiene",
    title: "Hygiène bucco-dentaire avec un appareil d'orthodontie",
    videoId: "feyaEbdJgIU",
    sections: [
      {
        heading:
          "Comment bien brosser vos dents avec un appareil d'orthodontie ?",
        body: "Le brossage des dents avec un appareil multiattaches (bagues) nécessite une attention particulière pour maintenir une bonne hygiène bucco-dentaire. Les bagues, les fils et les élastiques retiennent facilement la plaque dentaire et les débris alimentaires. Il est donc essentiel de bien nettoyer vos dents et votre appareil pour éviter les caries, les inflammations des gencives ou d'autres problèmes bucco-dentaires.",
      },
      {
        heading: "Utilisez la bonne brosse à dents",
        body: "Choisissez une brosse à dents à poils souples, ou une brosse à dents électrique à poils souples. Les poils souples aident à nettoyer autour des brackets sans endommager les gencives. Il existe également des brosses interdentaires, idéales pour atteindre les zones entre les brackets et le fil.",
      },
      {
        heading: "Technique de brossage recommandée",
        body: "Brossez vous les dents pendant 2min minimum ! Faites des mouvements circulaires doux en passant par la gencive et les dents, en prenant soin de nettoyer au-dessus et au-dessous des brackets. Brossez chaque dent individuellement et passez du temps sur les zones les plus difficiles d'accès. N'oubliez pas de brosser la surface intérieure des dents.",
      },
      {
        heading: "Minimum 2 fois par jours : matin et soir",
        body: "Avec un appareil multiattaches, il est préférable de vous brosser les dents après chaque repas donc 3 fois par jours. Cela évite que les aliments ne restent coincés dans votre appareil. Le minimum reste un brossage le matin, après le petit-déjeuner et le soir, après le repas.",
      },
      {
        heading:
          "Utilisez un révélateur de plaque ou un dentifrice éducatif pour évaluer votre brossage",
        body: "L'utilisation d'un révélateur de plaque ou d'un dentifrice éducatif est un excellent moyen d'auto-évaluer l'efficacité de votre brossage. Ces produits colorent la plaque dentaire en rose ou en bleu, vous montrant les zones où le brossage est insuffisant. Vous pouvez utiliser le révélateur après le brossage pour vérifier si des résidus persistent autour des bagues, des fils ou des espaces entre les dents. Cela vous permet de mieux cibler les zones à améliorer et de perfectionner votre technique de brossage.",
      },
    ],
    relatedText: "Prendre soin de son appareil orthodontique",
    relatedId: "soin-appareil",
  },
  {
    id: "soin-appareil",
    title: "Prendre soin de son appareil orthodontique",
    videoId: null,
    intro:
      "Entretenir son appareil orthodontique est indispensable pour assurer son efficacité et préserver une bonne santé bucco-dentaire. Un dispositif négligé peut causer des soucis comme des caries, des affections des gencives, voire altérer l'alignement dentaire. Heureusement, quelques démarches simples peuvent avoir un impact significatif.",
    sections: [
      {
        heading: "Hygiène quotidienne : impératif incontournable",
        body: "Tout d'abord, il est essentiel de nettoyer l'appareil orthodontique quotidiennement. Utilisez une brosse à poils doux pour nettoyer délicatement autour des attaches et des fils. Ensuite, brossez-vous les dents après chaque repas pour éviter l'accumulation de plaque et de résidus alimentaires. Par ailleurs, l'utilisation de fil dentaire ou de brossettes interdentaires peut faciliter l'accès aux zones difficiles entre les dents et l'appareillage.",
      },
      {
        heading:
          "Conseils spécifiques pour l'entretien des multi-attaches et des aligneurs transparents",
        body: "Pour les personnes portant des multi-attaches, il est crucial de vérifier régulièrement l'intégrité des attaches pour s'assurer qu'aucune n'est desserrée ou endommagée. De plus, l'application de cire orthodontique peut soulager les irritations causées par les attaches.\n\nEn ce qui concerne les aligneurs transparents, ils doivent être nettoyés séparément avec un produit spécifique pour éviter la décoloration et l'accumulation de bactéries. Respectez les instructions de votre orthodontiste pour leur remplacement afin de garantir un alignement progressif et efficace des dents.",
      },
      {
        heading:
          "Rendez-vous réguliers chez le spécialiste orthodontiste : suivi indispensable",
        body: "Enfin, n'oubliez pas vos consultations chez l'orthodontiste. Ces visites sont essentielles pour ajuster votre dispositif et s'assurer de son bon fonctionnement. De plus, votre orthodontiste peut vous fournir des conseils personnalisés et répondre à vos questions spécifiques. Ainsi, une communication régulière avec votre praticien est cruciale pour assurer le meilleur soin possible de votre appareil dentaire.",
      },
      {
        heading: "Investir dans votre santé bucco-dentaire",
        body: "Investir du temps et de l'attention dans l'entretien de votre appareil orthodontique peut sembler fastidieux, mais les avantages à long terme en valent largement la peine. En prenant soin de votre appareil, vous investissez également dans votre santé bucco-dentaire globale. Des dents bien alignées et une bouche saine peuvent non seulement améliorer votre estime de soi, mais aussi prévenir des problèmes plus graves à l'avenir.",
      },
      {
        heading: "Prévention des complications bucco-dentaires",
        body: "En maintenant une bonne hygiène bucco-dentaire, vous réduisez les risques de caries, de maladies des gencives et d'infections buccales. Cela évite l'inconfort et les dépenses élevées pour des traitements dentaires. Prendre soin de votre appareil orthodontique dès maintenant vous permet d'éviter ces problèmes et de faire des économies à long terme.",
      },
      {
        heading: "Persévérance dans les soins orthodontiques",
        body: "Enfin, rappelez-vous que la persévérance est la clé du succès en matière de soins orthodontiques. Même lorsque vous êtes pressé ou fatigué, prenez le temps de nettoyer correctement votre appareil et de suivre les recommandations de votre orthodontiste. Votre dévouement aujourd'hui se traduira par un sourire sain et éclatant demain.",
      },
      {
        heading: "Des efforts récompensés",
        body: "Prendre soin de son appareil orthodontique demande du temps, de la diligence et de la patience, mais les résultats en valent la peine. En suivant une routine de nettoyage rigoureuse, en prenant des précautions spécifiques pour votre type d'appareil et en maintenant des visites régulières chez votre orthodontiste, vous pouvez préserver la santé et la beauté de votre sourire pour les années à venir.",
      },
      {
        heading: "Clés pour un sourire sain et esthétique",
        body: "En résumé, prendre soin de son appareil orthodontique demande de la constance, mais les efforts sont récompensés. Une routine de nettoyage efficace, des soins adaptés aux particularités de votre dispositif, et des visites régulières chez l'orthodontiste sont les clés pour préserver un sourire sain et esthétique.",
      },
    ],
    relatedText: "Comment réussir son traitement d'orthodontie ?",
    relatedId: "reussir-traitement",
  },
  {
    id: "reussir-traitement",
    title: "Comment réussir son traitement d'orthodontie ?",
    videoId: "5wX_RCJBR3w",
    intro:
      "Comment réussir son traitement d'orthodontie ? Pour parvenir à un sourire éclatant grâce à l'orthodontie, il est indispensable de faire preuve d'engagement et de patience. Pour obtenir les meilleurs résultats et atténuer les éventuels désagréments, suivez ces recommandations.",
    sections: [
      {
        heading:
          "Respectez scrupuleusement les consignes de votre praticien orthodontiste",
        body: "Tout d'abord, il est impératif de suivre attentivement les instructions fournies par votre orthodontiste. Le port régulier de vos appareils (fils, gouttières, etc.) selon les directives données garantit une progression continue du traitement. De plus, les consultations périodiques sont cruciales. Elles permettent d'ajuster le traitement et de surveiller son évolution.",
      },
      {
        heading: "Maintenez une hygiène dentaire irréprochable",
        body: "Ensuite, veillez à maintenir une hygiène bucco-dentaire exemplaire. Brossez-vous les dents après chaque repas afin de prévenir l'apparition de caries et de taches. Utilisez du fil dentaire et des brossettes inter-dentaires adaptées aux appareils orthodontiques pour un nettoyage en profondeur.",
      },
      {
        heading: "Adoptez une alimentation adaptée",
        body: "Enfin, adaptez votre régime alimentaire en évitant les aliments durs ou collants qui pourraient endommager vos appareils. Privilégiez les aliments mous et faciles à mâcher. Réduisez également votre consommation de sucres et de boissons acides pour prévenir l'érosion dentaire et les risques de caries. Une alimentation équilibrée favorise la santé de vos dents pendant toute la durée du traitement.",
      },
      {
        heading: "Maintenez la motivation",
        body: "Pendant le traitement orthodontique, il est normal de ressentir parfois de la fatigue ou de l'impatience. Pour maintenir votre motivation, rappelez-vous constamment les raisons pour lesquelles vous avez entrepris ce parcours. Visualisez le résultat final : un sourire éclatant et une confiance renouvelée. En gardant ces objectifs à l'esprit, vous trouverez la motivation nécessaire pour persévérer, même face aux défis.",
      },
      {
        heading: "Félicitez-vous des progrès accomplis",
        body: "Chaque étape franchie dans votre traitement orthodontique mérite d'être célébrée. Que ce soit l'achèvement d'une phase de traitement ou simplement le respect de vos rendez-vous réguliers, prenez le temps de vous féliciter pour vos progrès. Reconnaître vos efforts et vos réalisations renforce votre motivation et vous encourage à continuer sur la voie de la réussite orthodontique.",
      },
      {
        heading: "Collaborez étroitement avec votre orthodontiste",
        body: "La collaboration entre le patient et l'orthodontiste est un élément fondamental du succès du traitement. Votre orthodontiste est votre partenaire tout au long de ce parcours. Partagez ouvertement vos préoccupations et vos expériences lors des consultations. Cette communication active permet à votre orthodontiste d'adapter le traitement à vos besoins spécifiques. Respectez les conseils et les délais qui vous sont donnés, et n'hésitez pas à poser des questions pour mieux comprendre votre traitement. Cette collaboration active facilite les ajustements nécessaires et contribue à l'obtention de résultats optimaux.",
      },
    ],
    outro:
      "En conclusion, la réussite de votre traitement orthodontique dépend de votre engagement et de votre collaboration étroite avec votre spécialiste. En suivant attentivement les conseils prodigués, en maintenant une hygiène dentaire rigoureuse, en adaptant votre alimentation et en coopérant activement avec votre orthodontiste, vous pourrez obtenir un sourire radieux et en pleine santé.",
    relatedText: "Hygiène bucco-dentaire",
    relatedId: "hygiene",
  },
];

const ConseilDetailPage = ({ conseilId, onClose, onNavigateConseil }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const conseil = conseilsData.find((c) => c.id === conseilId);

  if (!conseil) return null;

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pt-24">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#e89c4d] to-[#d88a3a] py-16 relative overflow-hidden">
          <img
            src="/birdbg.png"
            alt=""
            role="presentation"
            className="absolute left-4 top-0 h-full w-auto opacity-40 z-0"
          />
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight max-w-3xl">
              {conseil.title}
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-sm flex-wrap">
              <button onClick={onClose} className="hover:text-white transition">
                Accueil
              </button>
              <span>/</span>
              <span className="text-white/80">Nos conseils</span>
              <span>/</span>
              <span className="text-white">{conseil.title}</span>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-16 relative">
          <img
            src="/birdbg.png"
            alt=""
            role="presentation"
            className="absolute right-0 top-1/4 w-64 h-auto opacity-10 pointer-events-none"
          />

          <div className="relative z-10">
            {/* Video embed if present */}
            {conseil.videoId && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-xl aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${conseil.videoId}`}
                  title={conseil.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Intro paragraph if present */}
            {conseil.intro && (
              <p className="text-gray-600 text-base leading-relaxed mb-10">
                {conseil.intro}
              </p>
            )}

            {/* Article sections */}
            <div className="space-y-10">
              {conseil.sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
                    {section.heading}
                  </h3>
                  <div className="border-t border-gray-200 pt-4">
                    {section.body.split("\n\n").map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-gray-600 text-sm md:text-base leading-relaxed mb-4"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Outro if present */}
            {conseil.outro && (
              <p className="text-gray-600 text-base leading-relaxed mt-10">
                {conseil.outro}
              </p>
            )}

            {/* Related link */}
            {conseil.relatedText && (
              <p className="text-gray-500 text-sm mt-10">
                À découvrir également :{" "}
                <button
                  onClick={() => onNavigateConseil(conseil.relatedId)}
                  className="text-[#e89c4d] font-semibold hover:underline"
                >
                  {conseil.relatedText}
                </button>{" "}
                au{" "}
                <button
                  onClick={onClose}
                  className="text-[#e89c4d] font-semibold hover:underline"
                >
                  Cabinet d'orthodontie Arcade
                </button>
              </p>
            )}

            {/* Return button */}
            <div className="flex justify-center mt-16">
              <button
                onClick={onClose}
                className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg"
              >
                RETOUR
              </button>
            </div>
          </div>
        </div>
      </div>

      <BirdGradient />
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

// ─── Orthodontiste / Specialist Page (original /code36/) ─────────────────────
const OrthodontistePage = ({ onClose }: { onClose: () => void }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-white pt-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#e89c4d] to-[#f5b976] py-16 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Qu'est-ce qu'un orthodontiste ?
            </h1>
            <p className="text-white/80 text-sm">
              Accueil / Qu'est-ce qu'un orthodontiste ?
            </p>
          </div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Reveal direction="up">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-[#e89c4d]/10 border border-[#e89c4d]/20 rounded-full px-4 py-1.5 mb-6">
                <Stethoscope size={14} className="text-[#e89c4d]" />
                <span className="text-[#e89c4d] text-xs font-bold tracking-wider uppercase">Spécialiste Qualifié</span>
              </div>

              <p className="text-gray-700 leading-relaxed text-justify mb-6">
                En France, l'information des patients sur le fait qu'un praticien en{" "}
                <span className="text-[#e89c4d] font-semibold">orthodontie</span>{" "}
                soit Spécialiste Qualifié ou non n'est pas toujours claire. De nombreux diplômes ou termes créent souvent de la confusion.
              </p>

              <p className="text-gray-700 leading-relaxed text-justify mb-6">
                Le seul diplôme permettant d'accéder au titre de <strong>Spécialiste Qualifié en Orthopédie Dento-Faciale</strong> est le <strong>Diplôme d'Études Spécialisées d'Orthopédie Dento-Faciale (DES-ODF)</strong>, anciennement appelé CECSMO (Certificat d'Études Cliniques Spéciales Mention Orthodontie). Ce diplôme nécessite <strong>trois ans d'études supplémentaires</strong> après le diplôme de docteur en chirurgie dentaire. Pendant ces trois années, le praticien suit un internat de spécialisation à temps plein dans un service d'orthodontie. Cet internat représente plus de <strong>7 600 heures</strong> de formation théorique et clinique, sanctionné par un mémoire.
              </p>

              <p className="text-gray-700 leading-relaxed text-justify mb-6">
                Tout autre diplôme mentionnant "orthodontie" n'équivaut pas à ce titre de spécialiste. Actuellement, la France compte plus de <strong>43 000 dentistes</strong>, mais seulement <strong>2 200 sont des Spécialistes Qualifiés</strong> en orthodontie. L'Assurance Maladie, cependant, ne distingue pas le remboursement entre un Spécialiste en Orthodontie et un non-spécialiste.
              </p>

              <div className="bg-[#fdf6ee] border-l-4 border-[#e89c4d] rounded-r-xl p-6 my-8">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Important :</strong> Des termes comme <em>"Orthodontie Exclusive"</em> signifient que le praticien est un dentiste non-spécialiste pratiquant uniquement l'orthodontie. Seuls les chirurgiens-dentistes ayant fait l'internat ou le CECSMO peuvent utiliser légalement le terme <strong>"orthodontiste"</strong> sur leur plaque professionnelle, imprimés ou supports de communication, selon le Conseil de l'Ordre des dentistes.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed text-justify mb-8">
                Il est possible de vérifier la spécialité d'un dentiste sur{" "}
                <a
                  href="https://www.ordre-chirurgiens-dentistes.fr/annuaire/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e89c4d] font-semibold underline hover:text-[#d88a3a] transition inline-flex items-center gap-1"
                >
                  l'annuaire du conseil de l'ordre des dentistes
                  <ExternalLink size={14} />
                </a>{" "}
                : si votre praticien est indiqué avec une Spécialité : <strong>Orthopédie dento-faciale (ODF)</strong> il est orthodontiste, sinon, il est dentiste non spécialiste, avec peut-être une orientation professionnelle vers l'orthodontie.
              </p>
            </div>
          </Reveal>

          {/* Return button */}
          <div className="flex justify-center mt-16">
            <button
              onClick={onClose}
              className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg"
            >
              RETOUR
            </button>
          </div>
        </div>
      </div>

      <BirdGradient />
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const ConseilsSection = ({ onShowIncidents, onShowConseil }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const conseils = [
    {
      id: "hygiene",
      title: "Hygiène bucco-dentaire avec un appareil d'orthodontie",
      img: "/counseils-1.webp",
    },
    {
      id: "soin-appareil",
      title: "Prendre soin de son appareil orthodontique",
      img: "/counseils-2.webp",
    },
    {
      id: "reussir-traitement",
      title: "Comment réussir son traitement d'orthodontie ?",
      img: "/counseils-3.webp",
    },
  ];

  const videos = [
    {
      title: "Activer son disjoncteur",
      thumbnail: "/video-1.jpg",
      url: "https://player.vimeo.com/progressive_redirect/playback/611627850/rendition/1080p/file.mp4?loc=external&log_user=0&signature=52dee4ff1c850523cfb67f4bdcdc42bd0f28d67d98aa75ca598aa6df7bd14816",
    },
    {
      title: "Comment éviter de casser son appareil ?",
      thumbnail: "/video-2.jpg",
      url: "https://player.vimeo.com/progressive_redirect/playback/511131401/rendition/720p/file.mp4?loc=external&log_user=0&signature=e0e7db8e12e6a80ebe5e1bc5ca5d896728304ad00d8f0a9b35727b7f3d6c7558",
    },
    {
      title: "Conseils pour une hygiène avec un appareil",
      thumbnail: "/video-3.jpg",
      url: "https://player.vimeo.com/progressive_redirect/playback/511131171/rendition/1080p/file.mp4?loc=external&log_user=0&signature=b0e7de609d2d4d74aba19feffb6cf5f10b5a9071bf4e30c65413678642b802ef",
    },
    {
      title: "Les 4 règles de l'orthodontie",
      thumbnail: "/video-4.jpg",
      url: "https://player.vimeo.com/progressive_redirect/playback/474713299/rendition/720p/file.mp4?loc=external&log_user=0&signature=9ed6266a935e8522829e81b6082cac818594ed780594bf0a05e8e9707803d32b",
    },
  ];

  const openVideoModal = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setCurrentVideoUrl("");
  };

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#222222] to-[#1a1a1a]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Decorative orange glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#e89c4d] to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-24 bg-[#e89c4d]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* --- Section header --- */}
        <Reveal direction="up" duration={800}>
          <div className="text-center mb-20">
            <span className="inline-block text-[#e89c4d] text-xs font-bold tracking-[0.3em] uppercase mb-4 font-montserrat">Ressources & Accompagnement</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white font-montserrat leading-tight">
              Conseils, Urgences<br className="hidden sm:block" /> & Informations
            </h2>
            <div className="w-16 h-1 bg-[#e89c4d] mx-auto mt-6 rounded-full" />
          </div>
        </Reveal>

        {/* --- Incidents en orthodontie --- */}
        <Reveal direction="up" duration={800}>
          <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
            {/* Left: text */}
            <div className="w-full lg:w-2/5 font-montserrat">
              <div className="inline-flex items-center gap-2 bg-[#e89c4d]/10 border border-[#e89c4d]/20 rounded-full px-4 py-1.5 mb-6">
                <AlertTriangle size={14} className="text-[#e89c4d]" />
                <span className="text-[#e89c4d] text-xs font-bold tracking-wider uppercase">Urgences</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Les incidents en orthodontie
              </h3>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                Fil cassé, bracket décollé, irritation ? Retrouvez les gestes à adopter en cas d'incident avec votre appareil orthodontique.
              </p>
              <button
                onClick={onShowIncidents}
                className="group bg-[#e89c4d] text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest hover:bg-[#d88a3a] transition-all duration-300 font-montserrat shadow-lg shadow-[#e89c4d]/20 flex items-center gap-2"
              >
                DÉCOUVRIR
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right: staggered stacked images */}
            <div className="w-full lg:w-3/5 relative h-[380px] md:h-[440px]">
              <div className="absolute left-[0%] top-[12%] w-[42%] h-[78%] rounded-2xl overflow-hidden shadow-2xl z-10 border border-white/10 hover:scale-[1.02] transition-transform duration-500">
                <img src="/incidents-a.jpg" alt="Incident orthodontie" className="w-full h-full object-cover" />
              </div>
              <div className="absolute right-[30%] top-[0%] w-[30%] h-[50%] rounded-2xl overflow-hidden shadow-2xl z-20 border border-white/10 hover:scale-[1.02] transition-transform duration-500">
                <img src="/incidents-b.webp" alt="Appareil orthodontique" className="w-full h-full object-cover" />
              </div>
              <div className="absolute right-[0%] top-[20%] w-[42%] h-[78%] rounded-2xl overflow-hidden shadow-2xl z-30 border border-white/10 hover:scale-[1.02] transition-transform duration-500">
                <img src="/incidents-c.webp" alt="Sourire orthodontie" className="w-full h-full object-cover" />
              </div>
              {/* Decorative glow behind images */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#e89c4d]/10 rounded-full blur-3xl" />
            </div>
          </div>
        </Reveal>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-24">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
          <div className="w-2 h-2 rounded-full bg-[#e89c4d]/40" />
          <div className="w-3 h-3 rounded-full bg-[#e89c4d]/60" />
          <div className="w-2 h-2 rounded-full bg-[#e89c4d]/40" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* --- Conseils & Honoraires --- */}
        <div className="mb-20">
          <Reveal direction="up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
                  <FileText size={14} className="text-[#e89c4d]" />
                  <span className="text-gray-400 text-xs font-bold tracking-wider uppercase font-montserrat">Guides Patients</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white font-montserrat">
                  Conseils & Honoraires
                </h3>
              </div>
              <button className="mt-4 sm:mt-0 group bg-white/5 border border-white/20 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-widest hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 font-montserrat flex items-center gap-2">
                TOUT VOIR
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Reveal>

          {/* Advice Cards */}
          <Reveal direction="up" duration={800}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conseils.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onShowConseil(item.id)}
                  className="group relative rounded-2xl overflow-hidden h-[320px] cursor-pointer border border-white/5 hover:border-[#e89c4d]/30 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#e89c4d]/5"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-all duration-500" />

                  {/* Number badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="w-10 h-10 rounded-full bg-[#e89c4d] flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold font-montserrat">0{idx + 1}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <p className="text-white font-bold text-base leading-snug font-montserrat mb-2">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-[#e89c4d] text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span>Lire</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* --- Video Tutorials --- */}
        <Reveal direction="up">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-4">
              <Play size={14} className="text-[#e89c4d]" fill="currentColor" />
              <span className="text-gray-400 text-xs font-bold tracking-wider uppercase font-montserrat">Vidéos</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-montserrat">Tutoriels & Guides Vidéo</h3>
          </div>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {videos.map((video, idx) => (
              <div
                key={idx}
                onClick={() => openVideoModal(video.url)}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video border border-white/10 group-hover:border-[#e89c4d]/40 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-[#e89c4d]/10">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition" />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#e89c4d] group-hover:scale-110 transition-all duration-300 shadow-xl">
                      <Play
                        size={20}
                        className="text-gray-800 group-hover:text-white ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-white text-sm font-semibold font-montserrat leading-snug group-hover:text-[#e89c4d] transition duration-300">
                  {video.title}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Video Modal */}
        {videoModalOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeVideoModal}
          >
            <div
              className="relative w-full max-w-5xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideoModal}
                className="absolute -top-12 right-0 text-white hover:text-[#e89c4d] transition"
              >
                <X size={32} />
              </button>
              <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
                <video
                  className="absolute inset-0 w-full h-full"
                  controls
                  autoPlay
                  src={currentVideoUrl}
                >
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const TechnologiesPage = ({ onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const technologies = [
    {
      title: "Radio panoramique",
      description:
        "La radio panoramique est une technologie permettant l'exploration précise des structures osseuses et dentaires en trois dimensions. Une technologie essentielle dans l'élaboration d'un plan de traitement et pour le suivi de chaque patient.",
      image: "/tech-b.jpg",
      bgColor: "bg-gray-100",
    },
    {
      title: "Empreinte optique",
      description:
        "L'empreinte optique numérique est une technologie de pointe qui permet l'obtention d'image en direct d'une ou de plusieurs dents en trois dimensions et à l'aide d'une caméra intra-buccale couplée à un ordinateur.",
      image: "/tech-c.webp",
      bgColor: "bg-orange-100",
    },
    {
      title: "Communication",
      description:
        "Facilitez le suivi de votre traitement orthodontique avec l'application Dentapoche!",
      image: "/tech-d.webp",
      bgColor: "bg-gray-100",
      hasAppButtons: true,
    },
    {
      title: "Studio photo",
      description:
        "La photographie numérique est une aide essentielle dans le recueil de données, le diagnostic et la transmission d'informations. Un outil incontournable en dentisterie et garant d'un bon suivi thérapeutique pour chaque patient.",
      image: "/tech-a.webp",
      bgColor: "bg-orange-100",
    },
    {
      title: "Stérilisation",
      description:
        "La sécurité et le confort de chaque patient et de chaque membre de l'équipe est une priorité au sein du cabinet, qui applique avec rigueur une procédure de stockage des instruments à l'abri de toute contamination pour garantir une hygiène parfaite entre chaque visite.",
      image: "/tech-f.webp",
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 pt-24">
        {/* Hero Header with bird decoration */}
        <div className="relative bg-gradient-to-r from-[#e89c4d] to-[#f4a860] py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Nos technologies
            </h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <button onClick={onClose} className="hover:text-white transition">
                Accueil
              </button>
              <span>/</span>
              <span className="text-white">Nos technologies</span>
            </div>
          </div>

          {/* Bird decoration */}
          <img
            src="/birdbg.png"
            alt="Bird decoration"
            className="absolute -top-4 right-4 w-48 h-48 md:w-64 md:h-64 opacity-20"
          />
        </div>

        {/* Technologies Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-8">
          {technologies.map((tech, index) => {
            const isEven = index % 2 === 0;
            return (
              <Reveal
                key={index}
                direction={isEven ? "left" : "right"}
                delay={index * 100}
              >
                <div
                  className={`${tech.bgColor} rounded-3xl overflow-hidden shadow-lg flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Image side */}
                  <div className="w-full md:w-1/2 h-[300px] md:h-[350px]">
                    <img
                      src={tech.image}
                      alt={tech.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text side */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {tech.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-justify">
                      {tech.description}
                    </p>

                    {/* App store buttons for Communication section */}
                    {tech.hasAppButtons && (
                      <div className="flex flex-wrap gap-3 mt-6">
                        <a href="#" className="inline-block">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                            alt="Google Play"
                            className="h-12"
                          />
                        </a>
                        <a href="#" className="inline-block">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                            alt="App Store"
                            className="h-12"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Tooth decoration and return button */}
        <div className="flex justify-center pb-16">
          <button
            onClick={onClose}
            className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg"
          >
            RETOUR
          </button>
        </div>

        {/* Decorative tooth */}
        <div className="absolute bottom-8 right-8 opacity-20">
          <img src="/teeth.png" alt="Tooth decoration" className="w-32 h-32" />
        </div>
      </div>

      <BirdGradient />
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

const Technologies = ({ onShowTechnologies }) => {
  return (
    <section
      id="technologies"
      className="py-12 relative overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Left image - tech-a */}
            <div className="w-full md:w-1/3">
              <div className="relative group overflow-hidden rounded-3xl shadow-xl h-64">
                <img
                  src="/tech-a.webp"
                  alt="Technologies orthodontie"
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </div>

            {/* Center content */}
            <div className="w-full md:w-1/3 text-center px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-montserrat">
                Nos technologies
              </h2>
              <button
                onClick={onShowTechnologies}
                className="bg-[#1a1a1a] text-white px-10 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg font-montserrat"
              >
                DÉCOUVRIR
              </button>
            </div>

            {/* Right image - tech-b */}
            <div className="w-full md:w-1/3">
              <div className="relative group overflow-hidden rounded-3xl shadow-xl h-64">
                <img
                  src="/tech-b.jpg"
                  alt="Scanner 3D orthodontie"
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    {
      q: "À quel âge doit-on consulter ?",
      a: "La première consultation est recommandée vers l'âge de 7 ans. À cet âge, les premières molaires définitives sont sorties et nous pouvons détecter d'éventuels problèmes de croissance ou de positionnement dentaire.",
    },
    {
      q: "Est-ce que le traitement est douloureux ?",
      a: "Avec les techniques modernes, l'inconfort est minime. Une légère sensibilité peut être ressentie pendant les 2-3 jours suivant la pose ou l'activation de l'appareil, mais elle s'estompe rapidement.",
    },
    {
      q: "Combien de temps dure un traitement ?",
      a: "La durée varie selon la complexité du cas, généralement entre 6 mois et 2 ans. Un devis précis et une estimation de durée vous seront remis lors du bilan.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <Reveal direction="down">
          <h2 className="text-4xl font-medium text-center text-gray-900 mb-16 font-montserrat">
            Vos questions fréquentes
          </h2>
        </Reveal>
        <div className="space-y-4 font-montserrat">
          {items.map((item, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 100}>
              <div
                className="border border-gray-200 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="bg-gray-50 p-6 flex justify-between items-center hover:bg-gray-100 transition">
                  <h4 className="font-bold text-gray-800">{item.q}</h4>
                  <ChevronDown
                    className={`text-[#e89c4d] transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`}
                  />
                </div>
                <div
                  className={`transition-all duration-300 ease-out overflow-hidden bg-white px-6 ${openIndex === idx ? "max-h-40 py-6" : "max-h-0 py-0"}`}
                >
                  <p className="text-gray-600">{item.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const handleNavigateMentions = () => {
    window.history.pushState(
      { page: "mentions-legales" },
      "",
      "#mentions-legales",
    );
    window.dispatchEvent(
      new PopStateEvent("popstate", { state: { page: "mentions-legales" } }),
    );
    window.scrollTo(0, 0);
  };
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-0 border-t-8 border-[#e89c4d] font-montserrat relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
        <div>
          <div className="flex items-center mb-8">
            <img
              src="/logo.png"
              alt="Arcade Orthodontie"
              className="h-20 w-auto brightness-0 invert"
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Cabinet d'Orthodontie Dr Matthieu Hutin.
            <br />
            Spécialiste qualifié en orthopédie
            <br />
            dento-faciale.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-8 text-[#e89c4d]">Contact</h4>
          <div className="space-y-4 text-sm text-gray-400">
            <p
              className="flex items-start hover:text-white transition cursor-pointer"
              onClick={() =>
                document
                  .getElementById("acces")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              <MapPin size={18} className="mr-3 text-[#e89c4d]" />
              <span>
                69 Rue Alexis de Villeneuve
                <br />
                97400 Saint-Denis
              </span>
            </p>
            <p className="flex items-center hover:text-white transition">
              <Phone size={18} className="mr-3 text-[#e89c4d]" />
              02 62 21 51 21
            </p>
            <p className="flex items-center hover:text-white transition">
              <Mail size={18} className="mr-3 text-[#e89c4d]" />
              contact@arcade-ortho.re
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-bold mb-8 text-[#e89c4d]">Horaires</h4>
          <div className="text-gray-400 text-sm space-y-3">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span>Lundi</span> <span className="text-red-400">Fermé</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span>Mardi</span>{" "}
              <span className="text-white">12h30 - 18h00</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-[#e89c4d]">Mercredi</span>{" "}
              <span className="text-[#e89c4d]">
                9h - 11h30 &middot; 12h30 - 18h00
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span>Jeudi</span>{" "}
              <span className="text-white">12h30 - 18h00</span>
            </div>
            <div className="flex justify-between">
              <span>Vendredi</span>{" "}
              <span className="text-white">
                09h00 - 11h30 &middot; 12h30 - 18h00
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-16 py-8 border-t border-gray-800 text-xs text-gray-600 tracking-wider relative z-10 bg-gray-900/50 backdrop-blur-sm">
        © 2026 Cabinet Arcade. Tous droits réservés.
        <span>
          {" "}
          ·{" "}
          <button
            onClick={handleNavigateMentions}
            className="hover:text-[#e89c4d] transition underline"
          >
            Mentions légales
          </button>
        </span>
      </div>

      {/* Massive Animated Footer Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none select-none pointer-events-none opacity-10">
        <div className="whitespace-nowrap animate-marquee text-[25vw] font-black text-[#e89c4d]">
          ARCADE ORTHODONTIE ARCADE ORTHODONTIE
        </div>
      </div>
    </footer>
  );
};

const MentionsLegales = ({ onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="w-full h-[2px] bg-gradient-to-r from-[#e89c4d] to-[#e89c4d]/20 mb-6" />
      <div className="text-gray-700 leading-relaxed text-[15px] text-justify space-y-3">
        {children}
      </div>
    </div>
  );

  return (
    <div className="font-montserrat">
      <Navbar openModal={() => setModalOpen(true)} onNavigateHome={onClose} />
      <FAB openModal={() => setModalOpen(true)} />

      <div className="min-h-screen bg-white pt-24">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#e89c4d] to-[#f4a860] py-14 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <img
              src="/birdbg.png"
              alt=""
              role="presentation"
              className="absolute -top-2 left-0 w-36 h-36 md:w-48 md:h-48 opacity-25 pointer-events-none"
            />
            <div className="relative ml-12 md:ml-24">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Mentions légales
              </h1>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <button
                  onClick={onClose}
                  className="hover:text-white transition"
                >
                  Accueil
                </button>
                <span>/</span>
                <span className="text-white">Mentions légales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-14">
          <p className="text-gray-700 leading-relaxed text-[15px] text-justify mb-10">
            La consultation de ce site internet suppose l'acceptation pleine et
            sans réserves des mentions suivantes.
          </p>

          <div className="w-full h-[2px] bg-gradient-to-r from-[#e89c4d] to-[#e89c4d]/20 mb-10" />

          <p className="text-gray-700 leading-relaxed text-[15px] text-justify mb-10">
            Le site{" "}
            <a
              href="https://orthodontie-stdenis-arcade-974.re/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e89c4d] hover:underline"
            >
              https://orthodontie-stdenis-arcade-974.re/
            </a>{" "}
            est la propriété du DR MATTHIEU HUTIN, chirurgien-dentiste
            orthopédie dento-faciale enregistré au répertoire partagé des
            professionnels de santé (RPPS) sous le numéro 10101104817.
          </p>

          <Section title="Siège social">
            <p>Cabinet d'orthodontie du DR MATTHIEU HUTIN</p>
            <p>69 Rue ALEXIS DE VILLENEUVE</p>
            <p>97400 ST DENIS</p>
            <p>Tél.: 02 62 21 51 21</p>
          </Section>

          <Section title="Développement du site">
            <p>Le site est développé et maintenu par la société Mediweb.</p>
            <p className="font-semibold">Mediweb</p>
            <p>13, rue de Lattre de Tassigny</p>
            <p>67300 Schiltigheim</p>
            <a
              href="https://www.mediweb.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e89c4d] hover:underline inline-flex items-center gap-1"
            >
              www.mediweb.co <ExternalLink size={12} />
            </a>
          </Section>

          <Section title="Hébergement du site">
            <p>
              Le site{" "}
              <a
                href="https://orthodontie-stdenis-arcade-974.re/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e89c4d] hover:underline"
              >
                https://orthodontie-stdenis-arcade-974.re/
              </a>{" "}
              est hébergé par la société :
            </p>
            <p>Hetzner Online GmbH</p>
            <p>Industriestr. 25</p>
            <p>91710 Gunzenhausen</p>
            <p>Allemagne</p>
          </Section>

          <Section title="Éditeur du site">
            <p>
              Le contenu du site{" "}
              <a
                href="https://orthodontie-stdenis-arcade-974.re/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e89c4d] hover:underline"
              >
                https://orthodontie-stdenis-arcade-974.re/
              </a>{" "}
              est édité par le DR MATTHIEU HUTIN qui assure le rôle de Directeur
              de la Publication.
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              CABINET D'ORTHODONTIE DU DR MATTHIEU HUTIN est propriétaire de la
              structure et de tous les contenus disponibles du site{" "}
              <a
                href="https://orthodontie-stdenis-arcade-974.re/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e89c4d] hover:underline"
              >
                https://orthodontie-stdenis-arcade-974.re/
              </a>{" "}
              : textes, images, illustrations, logos, fichiers et bases de
              données. Toute reproduction ou distribution, totale ou partielle,
              sans autorisation préalable est strictement interdite.
            </p>
          </Section>

          <Section title="Liens">
            <p>
              Ordre National des Chirurgiens Dentistes (ONCD) :{" "}
              <a
                href="https://www.ordre-chirurgiens-dentistes.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e89c4d] hover:underline"
              >
                www.ordre-chirurgiens-dentistes.fr
              </a>
            </p>
          </Section>

          {/* Return button */}
          <div className="text-center mt-8 relative">
            <button
              onClick={onClose}
              className="bg-[#1a1a1a] text-white px-12 py-4 rounded-full text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition duration-300 shadow-lg"
            >
              RETOUR
            </button>
            {/* Decorative tooth image */}
            <img
              src="/tooth-decoration.png"
              alt=""
              className="hidden md:block absolute -right-20 bottom-0 w-32 h-32 opacity-80 pointer-events-none"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </div>

      <BirdGradient />
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <CookieConsent />
    </div>
  );
};

const CookieConsent = ({
  onNavigateMentions,
}: {
  onNavigateMentions?: () => void;
}) => {
  const [accepted, setAccepted] = useState(() => {
    try {
      return localStorage.getItem("cookie-consent") === "accepted";
    } catch {
      return false;
    }
  });
  const [expanded, setExpanded] = useState(false);

  if (accepted) return null;

  const handleAccept = () => {
    setAccepted(true);
    try {
      localStorage.setItem("cookie-consent", "accepted");
    } catch {}
  };

  const handleMentions = () => {
    if (onNavigateMentions) {
      onNavigateMentions();
    } else {
      window.history.pushState(
        { page: "mentions-legales" },
        "",
        "#mentions-legales",
      );
      window.dispatchEvent(
        new PopStateEvent("popstate", { state: { page: "mentions-legales" } }),
      );
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {/* Backdrop when expanded */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70]"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Cookie consent */}
      <div
        className={`fixed z-[75] font-montserrat transition-all duration-500 ease-out ${
          expanded
            ? "bottom-4 left-4 w-[min(520px,calc(100vw-2rem))]"
            : "bottom-4 left-4"
        }`}
      >
        {expanded ? (
          /* Full consent dialog */
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{
              animation: "cookieExpand 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <span className="text-base font-semibold text-gray-900">
                Gérer le consentement
              </span>
              <button
                onClick={() => setExpanded(false)}
                aria-label="Fermer le panneau de consentement"
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                Pour offrir les meilleures expériences, nous utilisons des
                technologies telles que les cookies pour stocker et/ou accéder
                aux informations des appareils. Le fait de consentir à ces
                technologies nous permettra de traiter des données telles que le
                comportement de navigation ou les ID uniques sur ce site. Le
                fait de ne pas consentir ou de retirer son consentement peut
                avoir un effet négatif sur certaines caractéristiques et
                fonctions.
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-4 flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-[#e89c4d] hover:bg-[#d4883d] text-white font-semibold py-3 rounded-xl text-sm transition-colors duration-200"
              >
                Accepter
              </button>
              <button
                onClick={() => setExpanded(false)}
                className="flex-1 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors duration-200"
              >
                Voir les préférences
              </button>
            </div>

            {/* Links */}
            <div className="px-6 pb-5 flex gap-4">
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-[#e89c4d] hover:underline"
              >
                Politique de cookies
              </button>
              <button
                onClick={handleMentions}
                className="text-xs text-[#e89c4d] hover:underline"
              >
                Mentions légales
              </button>
            </div>
          </div>
        ) : (
          /* Collapsed tab */
          <button
            onClick={() => setExpanded(true)}
            className="group bg-white rounded-xl shadow-lg border border-gray-100 px-5 py-3 flex items-center gap-2.5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <Cookie size={16} className="text-[#e89c4d]" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition">
              Gérer le consentement
            </span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes cookieExpand {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-montserrat">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Orange header band */}
        <div className="relative bg-gradient-to-br from-[#e89c4d] to-[#d4883d] px-8 pt-10 pb-14 text-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
          {/* Bird decoration */}
          <img
            src="/birdbg.png"
            alt=""
            role="presentation"
            className="absolute top-2 right-4 w-24 h-24 opacity-15 pointer-events-none"
          />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white">
              Prendre rendez-vous
            </h3>
          </div>
        </div>

        {/* Content — overlaps the header */}
        <div className="relative -mt-6 bg-white rounded-t-3xl px-8 pt-8 pb-6">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X size={16} className="text-gray-500" />
          </button>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Pour prendre rendez-vous, veuillez nous contacter par téléphone ou
            utilisez l'application{" "}
            <strong className="text-gray-900">Dentapoche</strong> si vous êtes
            déjà patient.
          </p>

          {/* Phone CTA */}
          <a
            href="tel:0262215121"
            className="flex items-center gap-4 w-full bg-[#1a1a1a] hover:bg-[#e89c4d] text-white rounded-2xl px-6 py-4 transition-all duration-300 group mb-3"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition">
              <Phone size={20} />
            </div>
            <div>
              <span className="text-xs text-white/60 uppercase tracking-wider">
                Appeler le cabinet
              </span>
              <p className="text-lg font-bold">02 62 21 51 21</p>
            </div>
          </a>

          {/* Dentapoche CTA */}
          <a
            href="https://apps.apple.com/fr/app/dentapoche/id1459356041"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full bg-gray-50 hover:bg-orange-50 text-gray-900 rounded-2xl px-6 py-4 transition-all duration-300 border border-gray-100 hover:border-[#e89c4d]/30 group"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition">
              <Smartphone size={20} className="text-[#e89c4d]" />
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Déjà patient ?
              </span>
              <p className="text-base font-bold">Ouvrir Dentapoche</p>
            </div>
          </a>

          {/* Hours hint */}
          <p className="text-center text-xs text-gray-400 mt-5">
            Mar - Ven : 12h30 - 18h00 &middot; Mer & Ven matin : 9h - 11h30
          </p>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash once per session
    return !sessionStorage.getItem('arcade-splash-seen');
  });
  const [splashFading, setSplashFading] = useState(false);

  // Splash animation timing
  useEffect(() => {
    if (!showSplash) return;
    const fadeTimer = setTimeout(() => setSplashFading(true), 2200);
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('arcade-splash-seen', '1');
    }, 2900);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, [showSplash]);

  // Page state - only one can be active at a time
  const [currentPage, setCurrentPage] = useState<
    "home" | "doctor" | "cabinet" | string
  >("home");

  // Listen for browser back/forward button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = event.state?.page || "home";
      setCurrentPage(page);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);

    // Initialize history state
    if (!window.history.state) {
      window.history.replaceState({ page: "home" }, "", "/");
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigate to a page (pushes to history)
  const navigateToPage = (page: string) => {
    setCurrentPage(page);
    window.history.pushState({ page }, "", `#${page}`);
    window.scrollTo(0, 0);
  };

  // Helper to close any detail page and return home
  const goHome = () => {
    setCurrentPage("home");
    window.history.pushState({ page: "home" }, "", "/");
    window.scrollTo(0, 0);
  };

  // Global styles - shared across all pages
  const globalStyles = (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-montserrat, body, h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea {
          font-family: 'Montserrat', sans-serif !important;
        }
        html { scroll-behavior: smooth; scroll-padding-top: 6rem; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes nodeGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(232,156,77,0.2), 0 0 0 0 rgba(232,156,77,0); }
          50% { box-shadow: 0 0 24px rgba(232,156,77,0.35), 0 0 50px rgba(232,156,77,0.12); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .parcours-node { animation: nodeGlow 3s ease-in-out infinite; }
        .parcours-pulse { animation: pulseRing 3s ease-in-out infinite; }
        @keyframes splashLogoIn {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes splashTextUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes splashLineGrow {
          0% { width: 0; }
          100% { width: 80px; }
        }
      `}</style>
    </>
  );

  // Render detail pages as completely separate pages (not overlays)
  if (currentPage === "doctor") {
    return (
      <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
        {globalStyles}
        <DoctorProfile onClose={goHome} />
        <CookieConsent
          onNavigateMentions={() => navigateToPage("mentions-legales")}
        />
      </div>
    );
  }

  if (currentPage === "cabinet") {
    return (
      <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
        {globalStyles}
        <CabinetPage onClose={goHome} />
        <CookieConsent
          onNavigateMentions={() => navigateToPage("mentions-legales")}
        />
      </div>
    );
  }

  if (currentPage === "incidents") {
    return (
      <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
        {globalStyles}
        <IncidentsPage onClose={goHome} />
        <CookieConsent
          onNavigateMentions={() => navigateToPage("mentions-legales")}
        />
      </div>
    );
  }

  if (currentPage === "technologies") {
    return (
      <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
        {globalStyles}
        <TechnologiesPage onClose={goHome} />
        <CookieConsent
          onNavigateMentions={() => navigateToPage("mentions-legales")}
        />
      </div>
    );
  }

  if (currentPage.startsWith("conseil-")) {
    const conseilId = currentPage.replace("conseil-", "");
    return (
      <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
        {globalStyles}
        <ConseilDetailPage
          conseilId={conseilId}
          onClose={goHome}
          onNavigateConseil={(id) => navigateToPage(`conseil-${id}`)}
        />
        <CookieConsent
          onNavigateMentions={() => navigateToPage("mentions-legales")}
        />
      </div>
    );
  }

  if (currentPage === "mentions-legales") {
    return (
      <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
        {globalStyles}
        <MentionsLegales onClose={goHome} />
      </div>
    );
  }

  // Orthodontiste specialist page
  if (currentPage === "orthodontiste") {
    return (
      <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
        {globalStyles}
        <OrthodontistePage onClose={goHome} />
        <CookieConsent
          onNavigateMentions={() => navigateToPage("mentions-legales")}
        />
      </div>
    );
  }

  // Check if it's an appareil detail page
  if (currentPage.startsWith("appareil-")) {
    const appareilId = currentPage.replace("appareil-", "");
    const appareil = appareilsData.find((a) => a.id === appareilId);
    if (appareil) {
      return (
        <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
          {globalStyles}
          <AppareilDetail
            appareil={appareil}
            onClose={goHome}
            onNavigateAppareil={(id) => navigateToPage(`appareil-${id}`)}
            onNavigateOrthodontiste={() => navigateToPage("orthodontiste")}
          />
          <CookieConsent
            onNavigateMentions={() => navigateToPage("mentions-legales")}
          />
        </div>
      );
    }
  }

  // Default: render the home/landing page
  return (
    <div className="bg-gray-50 text-gray-800 font-sans selection:bg-[#e89c4d] selection:text-white font-montserrat">
      {globalStyles}

      {/* Intro Splash Animation */}
      {showSplash && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1a1a1a]"
          style={{
            transition: 'opacity 0.7s ease',
            opacity: splashFading ? 0 : 1,
            pointerEvents: splashFading ? 'none' : 'auto',
          }}
        >
          {/* Logo */}
          <img
            src="/logo-white.png"
            alt="Arcade Orthodontie"
            className="w-20 h-20 mb-6"
            style={{ animation: 'splashLogoIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
          />
          {/* Text */}
          <h2
            className="text-white text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase font-montserrat"
            style={{ animation: 'splashTextUp 0.6s ease forwards 0.5s', opacity: 0 }}
          >
            ARCADE
          </h2>
          <p
            className="text-[#e89c4d] text-xs tracking-[0.5em] uppercase mt-2 font-montserrat"
            style={{ animation: 'splashTextUp 0.6s ease forwards 0.7s', opacity: 0 }}
          >
            ORTHODONTIE
          </p>
          {/* Decorative line */}
          <div
            className="h-[2px] bg-[#e89c4d] mt-6 rounded-full"
            style={{ animation: 'splashLineGrow 0.8s ease forwards 1s', width: 0 }}
          />
        </div>
      )}

      <Navbar
        openModal={() => setModalOpen(true)}
        onNavigateHome={goHome}
        onNavigateCabinet={() => navigateToPage("cabinet")}
      />
      <FAB openModal={() => setModalOpen(true)} />

      <main>
        <Hero />
        <Team onShowDoctorProfile={() => navigateToPage("doctor")} />
        <Cabinet onShowCabinetPage={() => navigateToPage("cabinet")} />
        <Appareils
          onSelectAppareil={(id) => navigateToPage(`appareil-${id}`)}
        />
        <Parcours />
        <Traitements />
        <ConseilsSection
          onShowIncidents={() => navigateToPage("incidents")}
          onShowConseil={(id) => navigateToPage(`conseil-${id}`)}
        />
        <Technologies
          onShowTechnologies={() => navigateToPage("technologies")}
        />
        <FAQ />

        {/* Accès & Contact Section */}
        <section id="acces" className="py-20 bg-gray-50 font-montserrat">
          <div className="max-w-7xl mx-auto px-4">
            <Reveal direction="up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
                Accès & Contact
              </h2>
              <p className="text-gray-500 text-center text-lg mb-14">
                69 Rue Alexis de Villeneuve, 97400 Saint-Denis, La Réunion
              </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map Column */}
              <Reveal direction="left">
                <div className="rounded-3xl overflow-hidden shadow-xl h-full min-h-[450px]">
                  <iframe
                    title="Cabinet Arcade Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.297746864571!2d55.44591131540106!3d-20.87890008608269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x217876274e0e5677%3A0x8e8334887304523!2s69%20Rue%20Alexis%20de%20Villeneuve%2C%20Saint-Denis%2097400%2C%20R%C3%A9union!5e0!3m2!1sen!2sfr!4v1642158798452!5m2!1sen!2sfr"
                  ></iframe>
                </div>
              </Reveal>

              {/* Contact Form Column */}
              <Reveal direction="right">
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 h-full flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Contactez-nous
                  </h3>

                  <form
                    className="flex flex-col gap-4 flex-1"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Nom et prénom *"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e89c4d] focus:ring-2 focus:ring-[#e89c4d]/20 transition"
                      />
                      <input
                        type="tel"
                        placeholder="Téléphone *"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e89c4d] focus:ring-2 focus:ring-[#e89c4d]/20 transition"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email *"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e89c4d] focus:ring-2 focus:ring-[#e89c4d]/20 transition"
                    />
                    <textarea
                      placeholder="Votre message *"
                      rows={5}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e89c4d] focus:ring-2 focus:ring-[#e89c4d]/20 transition resize-none flex-1 min-h-[120px]"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl text-xs font-bold tracking-widest hover:bg-[#e89c4d] transition-all duration-300 mt-auto"
                    >
                      ENVOYER
                    </button>
                  </form>

                  {/* Quick info row */}
                  <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Phone size={14} className="text-[#e89c4d]" /> 02 62 21 51
                      21
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#e89c4d]" /> Accès PMR
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-[#e89c4d]" /> À 5 min de
                      la Gare centrale
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <CookieConsent
        onNavigateMentions={() => navigateToPage("mentions-legales")}
      />
    </div>
  );
}
