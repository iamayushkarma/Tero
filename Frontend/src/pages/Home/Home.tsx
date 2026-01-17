import AIScoringExplanation from "../../components/modules/AIScoringExplanation";
import FAQSection from "../../components/modules/FAQSection";
import Features from "../../components/modules/Features";
import HeroSection from "../../components/modules/HeroSection";
import StartResumeScan from "../../components/modules/StartResumeScan";
import WhyTeroStandsOut from "../../components/modules/WhyTeroStandsOut";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="mt-16">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
      >
        <HeroSection />
      </motion.section>
      <WhyTeroStandsOut />
      <section id="how-it-works" className="scroll-mt-12">
        <AIScoringExplanation />
      </section>
      <section id="tero-features" className="scroll-mt-12">
        <Features />
      </section>
      <section id="ats-score" className="scroll-mt-24">
        <StartResumeScan />
      </section>
      <section id="faq" className="scroll-mt-24">
        <FAQSection />
      </section>
    </div>
  );
}

export default Home;
