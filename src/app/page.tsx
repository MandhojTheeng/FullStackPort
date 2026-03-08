import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <About />
      
      {/* Projects Section */}
      <Projects />
      
      {/* Contact Section */}
      <Contact />
      
      {/* Footer */}
      <Footer />
      
      {/* AI Chat Assistant */}
      <AIChat />
    </div>
  );
}

