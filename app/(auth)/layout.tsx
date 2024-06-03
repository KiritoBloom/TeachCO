"use client";

import { ModeToggle } from "@/components/theme-toggle";
import themeHook from "@/hooks/theme";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const resolvedTheme = themeHook();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm dark:bg-[#18181C]">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6 dark:border-[#3A3A3D] dark:bg-[#18181C]">
          <Link className="flex items-center gap-2" href="#">
            <Image
              src={resolvedTheme === "dark" ? "/logo-white.png" : "/logo.png"}
              width={25}
              height={30}
              alt="logo"
            />
            <span className="text-lg font-semibold">TeachCO</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-4 md:flex">
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                Home
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#about"
              >
                About
              </Link>
              <Link
                className="text-sm font-medium hover:underline underline-offset-4"
                href="#"
              >
                Contact
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Link
                className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#star"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 dark:bg-black">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Elevate Your Teaching with TeachCO
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover a platform that empowers educators to create engaging
                online courses and connect with a global community of learners.
              </p>
              <div className=" flex gap-2 min-[400px]:flex-row">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#star"
                >
                  Get Started
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  href="#about"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <Image
              alt="TeachCO"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              height="310"
              src="/placeholder.svg"
              width="550"
            />
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-[#28282A]"
          id="about"
        >
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2">
            <Image
              alt="TeachCO Features"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src="/placeholder.svg"
              width="550"
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Empower Your Teaching
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  TeachCO provides a comprehensive suite of tools to help you
                  create, manage, and grow your online courses. From intuitive
                  course builders to powerful analytics, we&apos;ve got you
                  covered.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Explore Features
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Trusted by Educators Worldwide
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                TeachCO has empowered thousands of instructors to create
                engaging online courses and connect with a global community of
                learners.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 lg:grid-cols-5 items-center justify-center gap-8 lg:gap-12 [&>img]:mx-auto">
              <Image
                alt="Logo"
                className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                height="70"
                src="/placeholder.svg"
                width="140"
              />
              <Image
                alt="Logo"
                className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                height="70"
                src="/placeholder.svg"
                width="140"
              />
              <Image
                alt="Logo"
                className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                height="70"
                src="/placeholder.svg"
                width="140"
              />
              <Image
                alt="Logo"
                className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                height="70"
                src="/placeholder.svg"
                width="140"
              />
              <Image
                alt="Logo"
                className="aspect-[2/1] col-span-2 lg:col-span-1 overflow-hidden rounded-lg object-contain object-center"
                height="70"
                src="/placeholder.svg"
                width="140"
              />
            </div>
            <div
              className="mt-[20%] text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
              id="star"
            >
              <h2>Get Started: Sign Up or Sign In</h2>
            </div>
            <div className="flex justify-center">{children}</div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TeachCO. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </>
  );
};

export default AuthLayout;
