import HowItWorks from "../../components/modules/HowItWorks";
import HeroSection from "../../components/modules/HeroSection";

function Home() {
  return (
    <div className="mt-16">
      <HeroSection />
      <HowItWorks />
      {/* Problem Section 
      How It Works 
      Features Before/After Improvement (Optional)
      Why Choose Tero 
      Testimonials (Optional) 
      Bottom CTA Footer */}
    </div>
  );
}

export default Home;
