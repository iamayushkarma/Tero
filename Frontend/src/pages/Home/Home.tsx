import AIScoringExplanation from "../../components/modules/AIScoringExplanation";
import Features from "../../components/modules/Features";
import HeroSection from "../../components/modules/HeroSection";
import WhyTeroStandsOut from "../../components/modules/WhyTeroStandsOut";

function Home() {
  return (
    <div className="mt-16">
      <HeroSection />
      <WhyTeroStandsOut />
      <AIScoringExplanation />
      <Features />
    </div>
  );
}

export default Home;
