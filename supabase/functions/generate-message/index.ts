
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
    console.log('Deno version:', Deno.version)
    console.log('User agent will be:', 'Supabase-Edge-Function/1.0')
    console.log('=========================')

    const requestBody = {
      promptId: '9ab5aa1f-b408-4881-9355-d82bf23c52dd',
      promptVersionId: '7c3a9c75-150e-4d92-99de-af31ff065bb9',
      replacements: replacements
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    console.log('Making request to Hyperleap API...')
    console.log('URL:', 'https://api.hyperleap.ai/prompt-runs/run')
    console.log('Headers will include x-hl-api-key')
    
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('Request timeout triggered after 45 seconds')
      controller.abort()
    }, 45000); // Increased to 45 second timeout

    let response;
    try {
      console.log('Starting fetch request...')
      
      response = await fetch('https://api.hyperleap.ai/prompt-runs/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hl-api-key': hyperleapApiKey,
          'User-Agent': 'Supabase-Edge-Function/1.0',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })
      
      console.log('Fetch completed successfully')
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('=== FETCH ERROR DETAILS ===')
      console.error('Fetch error:', fetchError);
      console.error('Error name:', fetchError.name);
      console.error('Error message:', fetchError.message);
      console.error('Error constructor:', fetchError.constructor.name);
      console.error('Error cause:', fetchError.cause);
      console.error('============================')
      
      // Check if it's a timeout
      if (fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Request timeout - Hyperleap API did not respond within 45 seconds' }),
          { 
            status: 408,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      // Check if it's a network error
      if (fetchError.message.includes('network') || fetchError.message.includes('sending request')) {
        return new Response(
          JSON.stringify({ 
            error: 'Network connectivity issue - Unable to reach Hyperleap API from Edge Function environment',
            details: fetchError.message,
            suggestion: 'This might be resolved when deployed to production (Netlify)'
          }),
          { 
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
      
      // For any other fetch errors
      return new Response(
        JSON.stringify({ 
          error: 'Request failed',
          details: fetchError.message,
          type: fetchError.name
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    clearTimeout(timeoutId);
    console.log('Response received!')
    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log('Raw response body length:', responseText.length)
    console.log('Raw response first 500 chars:', responseText.substring(0, 500))

    if (!response.ok) {
      console.error('=== API ERROR RESPONSE ===')
      console.error('Status:', response.status)
      console.error('Status text:', response.statusText)
      console.error('Response body:', responseText)
      console.error('==========================')
      
      return new Response(
        JSON.stringify({ 
          error: `Hyperleap API Error: ${response.status} ${response.statusText}`,
          status: response.status,
          statusText: response.statusText,
          details: responseText,
          suggestion: response.status === 401 ? 'Check API key validity' : 
                     response.status === 403 ? 'Check API permissions and CORS settings' :
                     response.status === 429 ? 'Rate limit exceeded' : 'Check API request format'
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
      console.log('Successfully parsed JSON response')
      console.log('Response data keys:', Object.keys(data))
      console.log('Full response data:', JSON.stringify(data, null, 2))
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError)
      console.error('Response was:', responseText)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON response from Hyperleap API', rawResponse: responseText }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Try multiple possible response fields
    const generatedMessage = data.output || data.result || data.message || data.text || data.content || data.response || data.generated_text

    if (!generatedMessage) {
      console.error('No message found in response. Available fields:', Object.keys(data))
      console.error('Full response:', JSON.stringify(data, null, 2))
      return new Response(
        JSON.stringify({ 
          error: 'No generated message found in API response',
          availableFields: Object.keys(data),
          fullResponse: data
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('=== SUCCESS ===')
    console.log('Generated message found!')
    console.log('Message length:', String(generatedMessage).length)
    console.log('Message:', generatedMessage)
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
    console.error('Error name:', error instanceof Error ? error.constructor.name : 'Unknown')
    console.error('===========================')
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
