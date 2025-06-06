
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { generateStartupIdea } from "@/utils/aiGenerator";
import { StartupIdea } from "@/pages/Index";

interface FormData {
  timeCommitment: string;
  interests: string;
  desiredIncome: string;
  skills: string;
}

interface StartupFormProps {
  onSubmit: (idea: StartupIdea) => void;
  onBack: () => void;
}

const StartupForm = ({ onSubmit, onBack }: StartupFormProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    timeCommitment: "",
    interests: "",
    desiredIncome: "",
    skills: ""
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const idea = await generateStartupIdea(formData);
      onSubmit(idea);
    } catch (error) {
      console.error("Error generating startup idea:", error);
      // For demo purposes, show a sample result
      const sampleIdea: StartupIdea = {
        name: "QuickKitchen",
        concept: "A platform for sharing quick, healthy recipes with video tutorials and meal planning tools.",
        monetization: "Paid premium courses ($29/month) + affiliate marketing for kitchen tools and ingredients",
        toolsNeeded: ["Video editing software", "Social media accounts", "Basic website/landing page", "Content calendar"],
        mvpPlan: [
          "Week 1: Create 5 short recipe videos for social media",
          "Set up basic website with Gumroad integration",
          "Post content on TikTok and Instagram",
          "Reach out to 3 kitchen tool brands for affiliate partnerships",
          "Launch email list with free meal planning template"
        ],
        landingPageHtml: `<!DOCTYPE html>
<html>
<head>
    <title>QuickKitchen - Healthy Recipes Made Simple</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 800px; margin: 0 auto; text-align: center; }
        .cta-button { background: #ff6b6b; color: white; padding: 15px 30px; border: none; border-radius: 25px; font-size: 18px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍳 QuickKitchen</h1>
        <h2>Healthy Recipes in Under 10 Minutes</h2>
        <p>Join thousands learning to cook delicious, nutritious meals that fit your busy lifestyle.</p>
        <button class="cta-button">Start Cooking Today - $29/month</button>
    </div>
</body>
</html>`
      };
      onSubmit(sampleIdea);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.timeCommitment.trim() !== "";
      case 2: return formData.interests.trim() !== "";
      case 3: return formData.desiredIncome.trim() !== "";
      case 4: return formData.skills.trim() !== "";
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8 bg-white/15 backdrop-blur-sm border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tell Us About You</h1>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= step ? 'bg-yellow-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-blue-100">Step {step} of 4</p>
          </div>

          {/* Form Steps */}
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">How much time can you dedicate?</h2>
                  <p className="text-blue-200">Be realistic about your weekly availability</p>
                </div>
                <div>
                  <Label htmlFor="timeCommitment" className="text-white">Hours per week</Label>
                  <Input
                    id="timeCommitment"
                    placeholder="e.g., 5-10 hours"
                    value={formData.timeCommitment}
                    onChange={(e) => handleInputChange("timeCommitment", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">What are your interests?</h2>
                  <p className="text-blue-200">Tell us about your hobbies, passions, or areas of expertise</p>
                </div>
                <div>
                  <Label htmlFor="interests" className="text-white">Interests & Hobbies</Label>
                  <Textarea
                    id="interests"
                    placeholder="e.g., cooking, fitness, photography, gaming, writing..."
                    value={formData.interests}
                    onChange={(e) => handleInputChange("interests", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 min-h-24"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">What's your income goal?</h2>
                  <p className="text-blue-200">How much would you like to earn monthly from this venture?</p>
                </div>
                <div>
                  <Label htmlFor="desiredIncome" className="text-white">Monthly income target</Label>
                  <Input
                    id="desiredIncome"
                    placeholder="e.g., $500, $1000, $5000"
                    value={formData.desiredIncome}
                    onChange={(e) => handleInputChange("desiredIncome", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">What skills do you have?</h2>
                  <p className="text-blue-200">List your current skills, tools, or experience</p>
                </div>
                <div>
                  <Label htmlFor="skills" className="text-white">Skills & Tools</Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., video editing, social media, writing, design, programming..."
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 min-h-24"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              onClick={step === 1 ? onBack : handlePrevious}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 1 ? "Back" : "Previous"}
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate My Startup"
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StartupForm;
