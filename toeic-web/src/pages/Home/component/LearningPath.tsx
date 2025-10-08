import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

const courses = [
  {
    level: "Beginner",
    title: "TOEIC Premium",
    description: "Perfect for those starting their TOEIC journey. Build essential vocabulary and grammar.",
    duration: "4 weeks",
    students: "12,450",
    badge: "Most Popular",
    originalPrice: "299K VND",
    discountPrice: "249K VND",
    discount: "17%",
  },
  {
    level: "Intermediate",
    title: "TOEIC Premium",
    description: "Advanced strategies and techniques to boost your score to 750+ in 6 months.",
    duration: "6 months",
    students: "8,320",
    badge: "Recommended",
    originalPrice: "499K VND",
    discountPrice: "339K VND",
    discount: "33%",
  },
  {
    level: "Advanced",
    title: "TOEIC Premium",
    description: "Achieve 900+ scores with intensive practice and expert coaching.",
    duration: "12 months",
    students: "5,680",
    badge: "Premium",
    originalPrice: "$799K VND",
    discountPrice: "599K VND",
    discount: "50%",
  },
];

const LearningPath = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured courses designed for every proficiency level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <Card
              key={index}
              className="relative hover:shadow-glow transition-all duration-300 hover:-translate-y-2 animate-scale-in border-2 hover:border-primary/50"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="mb-2">
                    {course.badge}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {course.students} enrolled
                  </div>
                  {/* Discount Section */}
                  <div className="bg-primary/10 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="destructive" className="text-xs">
                        {course.discount} OFF
                      </Badge>
                      <span className="text-sm text-muted-foreground line-through">
                        {course.originalPrice}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {course.discountPrice}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Limited time offer
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant={index === 1 ? "hero" : "default"}>
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPath;
