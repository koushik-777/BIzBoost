
import { StartupIdea } from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  timeCommitment: string;
  interests: string;
  desiredIncome: string;
  skills: string;
}

export const generateStartupIdea = async (formData: FormData): Promise<StartupIdea> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-startup-idea', {
      body: formData
    });

    if (error) {
      console.error('Edge function error:', error);
      throw error;
    }

    return {
      name: data.name,
      concept: data.concept,
      monetization: data.monetization,
      toolsNeeded: data.toolsNeeded,
      mvpPlan: data.mvpPlan,
      landingPageHtml: data.landingPageHtml,
    };
  } catch (error) {
    console.error('Error generating startup idea:', error);
    
    // Fallback to template-based generation
    const { timeCommitment, interests, desiredIncome, skills } = formData;
    
    const fallbackIdea = {
      name: "SkillBoost",
      concept: `A consulting and educational service leveraging your expertise in ${interests} to help others learn and succeed.`,
      monetization: `Online courses (${desiredIncome}/month target) + one-on-one consulting + affiliate partnerships`,
      toolsNeeded: ["Content creation tools", "Online course platform", "Social media presence", "Basic website"],
      mvpPlan: [
        `Create free content around ${interests} to build audience`,
        "Set up simple website with contact form and service descriptions",
        "Launch email newsletter with weekly tips and insights",
        "Offer free consultation calls to validate demand",
        "Develop first paid offering based on most common needs"
      ],
      landingPageHtml: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillBoost - Transform Your ${interests}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            padding: 40px 20px;
            text-align: center;
        }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { font-size: 3rem; margin-bottom: 20px; }
        .cta-button { 
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white; 
            padding: 18px 40px; 
            border: none; 
            border-radius: 50px; 
            font-size: 1.1rem; 
            cursor: pointer; 
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 SkillBoost</h1>
        <p>Transform your expertise in ${interests} into a thriving business</p>
        <button class="cta-button">Start Your Journey - ${desiredIncome} Goal</button>
    </div>
</body>
</html>`
    };

    // Simulate delay for fallback
    await new Promise(resolve => setTimeout(resolve, 1000));
    return fallbackIdea;
  }
};
