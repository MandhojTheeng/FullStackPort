import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";
import BlogPage from "./blog/page";
import { HeroData, AboutData, FooterData } from "@/lib/admin-types";
import fs from "fs";
import path from "path";

async function getSiteData() {
  const filePath = path.join(process.cwd(), "data", "site.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(fileContents);
  return data;
}

export default async function Home() {
  const siteData = await getSiteData();
  const heroData: HeroData = siteData.hero;
  const aboutData: AboutData = siteData.about;
  const footerData: FooterData = siteData.footer;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero heroData={heroData} />
      
      {/* About Section */}
      <About aboutData={aboutData} />
      
      {/* Projects Section */}
      <Projects />

      <BlogPage/>
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer footerData={footerData} />
      
      {/* AI Chat Assistant */}
      <AIChat />
    </div>
  );
}

