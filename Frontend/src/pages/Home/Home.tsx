import AIScoringExplanation from "../../components/modules/AIScoringExplanation";
import FAQSection from "../../components/modules/FAQSection";
import Features from "../../components/modules/Features";
import HeroSection from "../../components/modules/HeroSection";
import StartResumeScan from "../../components/modules/StartResumeScan";
import WhyTeroStandsOut from "../../components/modules/WhyTeroStandsOut";
function Home() {
  return (
    <div className="mt-16">
      <HeroSection />
      <WhyTeroStandsOut />
      <section id="how-it-works" className="scroll-mt-12">
        <AIScoringExplanation />
      </section>
      <Features />
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
