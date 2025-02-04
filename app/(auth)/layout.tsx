"use client";

import { ModeToggle } from "@/components/theme-toggle";
import themeHook from "@/hooks/theme";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBook,
  FaBullseye,
  FaChartLine,
  FaCheckCircle,
  FaGlobeAmericas,
  FaGraduationCap,
  FaHandshake,
} from "react-icons/fa";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const resolvedTheme = themeHook();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={
                    resolvedTheme === "dark" ? "/logo-white.png" : "/logo.png"
                  }
                  width={30}
                  height={35}
                  alt="TeachCO Logo"
                />
              </motion.div>
              <span
                className={`text-xl font-bold transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-800 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                TeachCO
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  href="#about"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  About
                </Link>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Contact
                </Link>
              </nav>
              <ModeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-b from-white dark:from-gray-900 to-gray-100 dark:to-gray-800"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight">
              Empower Your Teaching Journey
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-6">
              Create, manage, and deliver engaging online courses with TeachCO -
              your all-in-one platform for digital education.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10"
            >
              <Link
                href="#star"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-300"
              >
                Get Started
                <FaHandshake className="ml-2 text-lg" />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 md:py-24 lg:py-32"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={itemVariants}
                className="order-last md:order-first"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                    className="absolute -top-8 -left-8 -z-10"
                  >
                    <FaGraduationCap className="text-blue-400 text-7xl" />
                  </motion.div>
                  <Image
                    src="/placeholder.svg"
                    width={500}
                    height={350}
                    alt="About TeachCO"
                    className="rounded-lg shadow-xl relative"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  <span className="text-blue-500">Unlock</span> Your Potential
                  as an Educator
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  TeachCO provides you with the tools and the platform to share
                  your expertise, connect with a global community of learners,
                  and make a lasting impact on the world.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3 text-lg" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Create engaging, interactive courses
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3 text-lg" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Track student progress with robust analytics
                    </span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-3 text-lg" />
                    <span className="text-gray-700 dark:text-gray-200">
                      Build a thriving community of learners
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-12">
              Features That <span className="text-blue-500">Empower</span> You
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500">
                  <FaBook className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Intuitive Course Creation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build engaging courses easily with our user-friendly interface
                  and multimedia support.
                </p>
              </motion.div>

              {/* Feature Card 2 */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500">
                  <FaChartLine className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Data-Driven Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gain valuable insights into student performance and engagement
                  with powerful analytics.
                </p>
              </motion.div>

              {/* Feature Card 3 */}
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500">
                  <FaGlobeAmericas className="text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Global Reach
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with learners from all over the world and expand your
                  impact.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-16 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-950"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-12">
              What Educators Are Saying
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md relative overflow-hidden"
              >
                <FaBullseye className="absolute top-2 right-2 text-blue-400 text-5xl opacity-20" />
                <p className="text-gray-600 dark:text-gray-300 italic mb-4 relative">
                  &quot;TeachCO has revolutionized the way I teach. It&apos;s so
                  easy to create engaging courses and connect with my students
                  on a whole new level.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg"
                    width={40}
                    height={40}
                    alt="Educator 1"
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      Sarah L.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      History Professor
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 2 */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md relative overflow-hidden"
              >
                <FaBullseye className="absolute top-2 right-2 text-blue-400 text-5xl opacity-20" />
                <p className="text-gray-600 dark:text-gray-300 italic mb-4 relative">
                  &quot;The analytics dashboard is a game-changer. I can see
                  exactly how my students are doing and tailor my teaching to
                  their needs.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg"
                    width={40}
                    height={40}
                    alt="Educator 2"
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      John D.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mathematics Teacher
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial 3 */}
              <motion.div
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md relative overflow-hidden"
              >
                <FaBullseye className="absolute top-2 right-2 text-blue-400 text-5xl opacity-20" />
                <p className="text-gray-600 dark:text-gray-300 italic mb-4 relative">
                  &quot;I love the community aspect of TeachCO. I&apos;ve
                  connected with so many other educators and learned so much
                  from them.&quot;
                </p>
                <div className="flex items-center">
                  <Image
                    src="/placeholder.svg"
                    width={40}
                    height={40}
                    alt="Educator 3"
                    className="rounded-full"
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      Emily R.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Science Educator
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Get Started Section */}
        <motion.section
          id="star"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight mb-6">
              Start Your Teaching Journey Today
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Sign up or sign in to unlock the full potential of TeachCO and
              join our global community of educators.
            </p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-md mx-auto rounded-xl"
            >
              <div className="flex-col justify-center items-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                  Get Started
                </h3>
                <div className="mr-12">{children}</div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="bg-gray-200 dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TeachCO. All rights reserved.
            </p>
            <nav className="mt-4 sm:mt-0">
              <ul className="flex gap-6">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
