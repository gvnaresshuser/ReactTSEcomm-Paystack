import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import HowItWorks from "../components/home/HowItWorks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Contact from "../components/home/Contact";
/* import Navbar from "../components/home/Navbar"; */

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <WhyChooseUs />
      <Contact />
    </main>
  );
}
