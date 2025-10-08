import { Target, Users, Trophy, BookOpen, LineChart, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "Personalized Learning",
    description: "AI-powered study plans tailored to your skill level and target score.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Materials",
    description: "Complete coverage of all TOEIC sections with thousands of practice questions.",
  },
  {
    icon: Headphones,
    title: "Listening Practice",
    description: "Authentic audio materials with various accents to master the listening section.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description: "Detailed analytics to monitor your improvement and identify weak areas.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description: "Get guidance from certified TOEIC instructors and join study groups.",
  },
  {
    icon: Trophy,
    title: "Mock Tests",
    description: "Full-length practice tests that simulate the actual TOEIC exam experience.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose Our TOEIC Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to achieve your target TOEIC score in one place
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border hover:shadow-soft transition-all duration-300 hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
