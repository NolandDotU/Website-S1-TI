import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const HeroBanner = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      })
      .fromTo(
      ".hero-title",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        ".hero-desc",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ".hero-buttons a",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" },
        "-=0.4"
      );
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-left lg:py-16 border-r-2">
        <h1 className="hero-title mb-4 text-4xl font-extrabold font-montserrat leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          S1 Teknik Informatika
        </h1>
        <p className="hero-desc mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:px-48 lg:text-xl">
          Lingkungan akademik modern, riset berkelas, dan komunitas yang
          mendorong inovasi. Jelajahi program, fasilitas, dan kesempatan untuk
          bertumbuh.
        </p>
        <div className="hero-buttons flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 pb-8">
          <a
            href="https://www.uksw.edu/informasi-pendaftaran/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://www.uksw.edu/informasi-pendaftaran/",
                "_blank",
                "noopener,noreferrer",
              );
            }}>
            Daftar Sekarang
            <svg
              className="ms-2 h-3.5 w-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
          <a
            href="#academics"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 sm:ms-4 mt-4 sm:mt-0"
            onClick={(e) => {
              e.preventDefault();
              window.open("/tentang-program-studi", "_blank");
            }}>
            Lihat Program
          </a>
          <a
            href="/prestasi"
            className="inline-flex items-center justify-center rounded-lg border border-blue-300 px-5 py-3 text-center text-base font-medium text-blue-700 hover:bg-blue-50 focus:ring-4 focus:ring-blue-100 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-gray-800 dark:focus:ring-blue-900 sm:ms-4 mt-4 sm:mt-0"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/prestasi";
            }}>
            Prestasi / Achievment
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
