import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Master TOEIC with
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Achieve your target score with our comprehensive TOEIC preparation
              platform. Expert-designed courses, practice tests, and personalized
              learning paths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                <BookOpen className="mr-2 h-5 w-5" />
                View Courses
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="text-3xl font-bold text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-glow">
              <img
                src={heroImage}
                alt="Students learning English together"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-card p-6 rounded-xl shadow-soft border animate-fade-up hidden lg:block">
              <div className="text-sm text-muted-foreground mb-1">Average Score Improvement</div>
              <div className="text-3xl font-bold text-primary">+150 points</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
