import Features from "../../components/modules/Features";
import HeroSection from "../../components/modules/HeroSection";
import WhyTeroStandsOut from "../../components/modules/WhyTeroStandsOut";

function Home() {
  return (
    <div className="mt-16">
      <HeroSection />
      <WhyTeroStandsOut />
      <Features />
      {/* Problem Section 
      Features Before/After Improvement (Optional)
      Bottom CTA Footer */}
    </div>
  );
}

export default Home;
