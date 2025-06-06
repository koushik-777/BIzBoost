
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { timeCommitment, interests, desiredIncome, skills } = await req.json()
    
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found')
    }

    const prompt = `Generate a personalized micro-startup idea based on these details:
- Time available: ${timeCommitment}
- Interests: ${interests}
- Desired income: ${desiredIncome}
- Skills: ${skills}

Please respond with a JSON object containing:
{
  "name": "Startup name (catchy, 2-3 words)",
  "concept": "Clear description of the business concept (1-2 sentences)",
  "monetization": "Specific monetization strategy with pricing",
  "toolsNeeded": ["list", "of", "tools", "and", "resources", "needed"],
  "mvpPlan": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "landingPageHtml": "Complete HTML landing page code with inline CSS"
}

Make it realistic for someone with ${timeCommitment} time commitment and ${skills} skills. The landing page should be professional and conversion-focused.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0]?.content?.parts[0]?.text

    if (!generatedText) {
      throw new Error('No response from Gemini API')
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini')
    }

    const startupIdea = JSON.parse(jsonMatch[0])

    // Save to database
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('startup_ideas')
      .insert({
        user_id: user.id,
        name: startupIdea.name,
        concept: startupIdea.concept,
        monetization: startupIdea.monetization,
        tools_needed: startupIdea.toolsNeeded,
        mvp_plan: startupIdea.mvpPlan,
        landing_page_html: startupIdea.landingPageHtml,
        user_inputs: { timeCommitment, interests, desiredIncome, skills }
      })

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return new Response(
      JSON.stringify(startupIdea),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
