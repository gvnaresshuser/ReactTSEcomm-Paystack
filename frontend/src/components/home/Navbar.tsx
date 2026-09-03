import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { NavLink } from "react-router-dom";
import globe from "../../assets/globe.png";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "How It Works", href: "#process" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const scrollToSection = (id:any) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    closeMenu();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-8 lg:h-26 lg:px-10">
        {/* ================= BRAND ================= */}

        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2 sm:gap-3"
        >
          {/* Rotating Globe */}
          <div className="flex items-center [perspective:600px]">
            <img
              src={globe}
              alt="Deblessco Globe"
              className="h-14 w-14 object-contain animate-[globeSpin_8s_linear_infinite] sm:h-16 sm:w-16"
            />
          </div>

          {/* Brand */}
          <div className="leading-tight text-center">
            <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-base font-extrabold text-transparent sm:text-xl">
              DEBLESSCO
            </h1>

            {/* LOGISTICS */}
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <span className="h-px w-5 bg-amber-400 sm:w-8" />

              <span className="text-[8px] font-semibold tracking-[0.15em] text-amber-400 sm:text-[10px] sm:tracking-[0.18em]">
                LOGISTICS
              </span>

              <span className="h-px w-5 bg-amber-400 sm:w-8" />
            </div>

            <p className="text-[8px] font-medium tracking-wide text-slate-500 sm:text-[10px] sm:tracking-wider">
              Your Gateway to Global Trade
            </p>
          </div>
        </NavLink>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();

                const id = item.href.replace("#", "");
                scrollToSection(id);
              }}
              className="relative text-[15px] font-semibold tracking-wide text-slate-700 transition-all duration-300 hover:text-[#0057D9] after:absolute after:bottom-[-6px] after:left-0 after:h-[2px] after:w-0 after:bg-[#0057D9] after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* ================= DESKTOP CTA ================= */}

        {/* <a
          href="#contact"
          className="hidden rounded-full bg-[#0B1F3A] px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#0057D9] lg:block"
        >
          Request Quote
        </a> */}
        <div className="hidden items-center gap-5 lg:flex">
          <NavLink
            to="/login"
            className="inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-[#0057D9]"
          >
            <LogIn size={18} />
            Login
          </NavLink>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
            className="rounded-full bg-[#0B1F3A] px-8 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#0057D9]"
          >
            Request Quote
          </a>
        </div>

        {/* ================= MOBILE BUTTON ================= */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-6 shadow-xl lg:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            {/*  {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-lg font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0057D9]"
              >
                {item.name}
              </a>
            ))} */}
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();

                  const id = item.href.replace("#", "");
                  scrollToSection(id);
                }}
                className="block rounded-xl px-4 py-3.5 text-lg font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0057D9]"
              >
                {item.name}
              </a>
            ))}

            <NavLink
              to="/login"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-lg font-medium text-slate-700 transition hover:bg-slate-100 hover:text-[#0057D9]"
            >
              <LogIn size={20} />
              Login
            </NavLink>

            <a
              href="#contact"
              onClick={closeMenu}
              className="mt-5 block rounded-full bg-[#0B1F3A] py-4 text-center font-semibold text-white transition hover:bg-[#0057D9]"
            >
              Request Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
