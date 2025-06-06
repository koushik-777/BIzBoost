import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Rocket, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StartupIdea } from "@/pages/Index";
import { Json } from "@/integrations/supabase/types";

interface StartupHistoryProps {
  onViewIdea: (idea: StartupIdea) => void;
  onBack: () => void;
}

interface SavedIdea {
  id: string;
  name: string;
  concept: string;
  monetization: string;
  tools_needed: Json;
  mvp_plan: Json;
  landing_page_html: string | null;
  created_at: string;
}

const StartupHistory = ({ onViewIdea, onBack }: StartupHistoryProps) => {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('startup_ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your startup ideas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      const { error } = await supabase
        .from('startup_ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setIdeas(ideas.filter(idea => idea.id !== id));
      toast({
        title: "Deleted",
        description: "Startup idea deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete startup idea.",
        variant: "destructive",
      });
    }
  };

  const viewIdea = (savedIdea: SavedIdea) => {
    const idea: StartupIdea = {
      name: savedIdea.name,
      concept: savedIdea.concept,
      monetization: savedIdea.monetization,
      toolsNeeded: Array.isArray(savedIdea.tools_needed) ? savedIdea.tools_needed as string[] : [],
      mvpPlan: Array.isArray(savedIdea.mvp_plan) ? savedIdea.mvp_plan as string[] : [],
      landingPageHtml: savedIdea.landing_page_html || undefined,
    };
    onViewIdea(idea);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading your ideas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-8">
      <div className="container mx-auto px-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 absolute top-8 left-8"
        >
          ← Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Startup Ideas</h1>
          <p className="text-blue-200">Review and manage your generated concepts</p>
        </div>

        {ideas.length === 0 ? (
          <Card className="max-w-2xl mx-auto p-8 bg-white/15 backdrop-blur-sm border-white/20 text-center">
            <Rocket className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Ideas Yet</h2>
            <p className="text-blue-200">Generate your first startup idea to get started!</p>
          </Card>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {ideas.map((idea) => (
              <Card key={idea.id} className="p-6 bg-white/15 backdrop-blur-sm border-white/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{idea.name}</h3>
                    <p className="text-blue-100 mb-3">{idea.concept}</p>
                    <div className="flex items-center gap-2 text-blue-300 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(idea.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => viewIdea(idea)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => deleteIdea(idea.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator className="bg-white/20 my-4" />
                
                <div className="text-blue-200 text-sm">
                  <strong>Monetization:</strong> {idea.monetization}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupHistory;
