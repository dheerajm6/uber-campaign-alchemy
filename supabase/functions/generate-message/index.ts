
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { replacements } = await req.json()
    
    // Get the Hyperleap API key from Supabase secrets
    const hyperleapApiKey = Deno.env.get('HYPERLEAP_API_KEY')
    
    if (!hyperleapApiKey) {
      console.error('HYPERLEAP_API_KEY not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('=== EDGE FUNCTION DEBUG ===')
    console.log('API Key available:', !!hyperleapApiKey)
    console.log('API Key length:', hyperleapApiKey.length)
    console.log('Replacements received:', replacements)
    console.log('=========================')

    const requestBody = {
      promptId: '9ab5aa1f-b408-4881-9355-d82bf23c52dd',
      promptVersionId: '7c3a9c75-150e-4d92-99de-af31ff065bb9',
      replacements: replacements
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    console.log('Making request to Hyperleap API...')
    
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response;
    try {
      response = await fetch('https://api.hyperleap.ai/prompt-runs/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hl-api-key': hyperleapApiKey,
          'User-Agent': 'Supabase-Edge-Function/1.0',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      console.error('Error name:', fetchError.name);
      console.error('Error message:', fetchError.message);
      
      // Check if it's a timeout
      if (fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Request timeout - Hyperleap API did not respond within 30 seconds' }),
          { 
            status: 408,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      // Check if it's a network error
      if (fetchError.message.includes('network')) {
        return new Response(
          JSON.stringify({ error: 'Network error - Unable to reach Hyperleap API' }),
          { 
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      throw fetchError; // Re-throw if it's a different error
    }
    
    clearTimeout(timeoutId);
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('Raw response:', responseText)

    if (!response.ok) {
      console.error('API Error Response:', responseText)
      return new Response(
        JSON.stringify({ 
          error: `Hyperleap API Error: ${response.status} - ${responseText}`,
          status: response.status,
          details: responseText
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
      console.log('Parsed response data:', data)
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON response from Hyperleap API' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Try multiple possible response fields
    const generatedMessage = data.output || data.result || data.message || data.text || data.content || data.response

    if (!generatedMessage) {
      console.error('No message found in response. Full response:', data)
      return new Response(
        JSON.stringify({ error: 'No generated message found in API response' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('=== SUCCESS ===')
    console.log('Generated message:', generatedMessage)
    console.log('===============')

    return new Response(
      JSON.stringify({ message: String(generatedMessage).trim() }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===')
    console.error('Error details:', error)
    console.error('Error message:', error instanceof Error ? error.message : String(error))
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('===========================')
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
