
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Check, Rocket, DollarSign, Wrench, Calendar, Code, RotateCcw } from "lucide-react";
import { StartupIdea } from "@/pages/Index";

interface StartupResultProps {
  idea: StartupIdea;
  onStartOver: () => void;
}

const StartupResult = ({ idea, onStartOver }: StartupResultProps) => {
  const [copiedHtml, setCopiedHtml] = useState(false);

  const copyHtmlToClipboard = () => {
    if (idea.landingPageHtml) {
      navigator.clipboard.writeText(idea.landingPageHtml);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Startup Idea</h1>
          <p className="text-blue-200">Here's your personalized micro-startup concept</p>
        </div>

        {/* Main Result Card */}
        <Card className="max-w-4xl mx-auto p-8 bg-white/15 backdrop-blur-sm border-white/20 mb-8">
          {/* Startup Name & Concept */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Rocket className="h-8 w-8 text-yellow-300" />
              <h2 className="text-3xl font-bold text-white">{idea.name}</h2>
            </div>
            <p className="text-xl text-blue-100 leading-relaxed">{idea.concept}</p>
          </div>

          <Separator className="bg-white/20 my-8" />

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Monetization Strategy */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-6 w-6 text-green-300" />
                <h3 className="text-xl font-semibold text-white">Monetization Strategy</h3>
              </div>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <p className="text-blue-100">{idea.monetization}</p>
              </Card>
            </div>

            {/* Tools Needed */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-6 w-6 text-blue-300" />
                <h3 className="text-xl font-semibold text-white">Tools & Skills Needed</h3>
              </div>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <ul className="space-y-2">
                  {idea.toolsNeeded.map((tool, index) => (
                    <li key={index} className="text-blue-100 flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full" />
                      {tool}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* MVP Plan */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-purple-300" />
              <h3 className="text-xl font-semibold text-white">1-Week MVP Plan</h3>
            </div>
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="space-y-3">
                {idea.mvpPlan.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-blue-100">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Landing Page HTML */}
          {idea.landingPageHtml && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-6 w-6 text-orange-300" />
                <h3 className="text-xl font-semibold text-white">Landing Page HTML</h3>
              </div>
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="bg-gray-900 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
                  <pre className="text-green-300 text-sm whitespace-pre-wrap">
                    {idea.landingPageHtml}
                  </pre>
                </div>
                <Button
                  onClick={copyHtmlToClipboard}
                  className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy HTML Code
                    </>
                  )}
                </Button>
              </Card>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="text-center">
          <Button
            onClick={onStartOver}
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Generate Another Idea
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartupResult;
