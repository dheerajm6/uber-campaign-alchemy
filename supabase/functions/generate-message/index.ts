
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
    console.log('API Key length:', hyperleapApiKey?.length)
    console.log('Replacements received:', replacements)
    console.log('=========================')

    // Correct request format based on Hyperleap API docs
    const requestBody = {
      prompt_id: '9ab5aa1f-b408-4881-9355-d82bf23c52dd',
      prompt_version_id: '7c3a9c75-150e-4d92-99de-af31ff065bb9',
      replacements: replacements
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    console.log('Making request to Hyperleap API...')
    
    const response = await fetch('https://api.hyperleap.ai/prompts/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hyperleapApiKey}`,
      },
      body: JSON.stringify(requestBody),
    })
    
    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('=== API ERROR RESPONSE ===')
      console.error('Status:', response.status)
      console.error('StatusText:', response.statusText)
      console.error('Response body:', errorText)
      console.error('Request URL:', 'https://api.hyperleap.ai/prompts/run')
      console.error('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${hyperleapApiKey?.substring(0, 10)}...`,
      })
      console.error('==========================')
      
      return new Response(
        JSON.stringify({ 
          error: `Hyperleap API Error: ${response.status} ${response.statusText}`,
          details: errorText,
          requestBody: requestBody
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const data = await response.json()
    console.log('API Response structure:', Object.keys(data))
    console.log('Full API Response:', JSON.stringify(data, null, 2))

    // Based on the docs, the response should have an 'output' field
    const generatedMessage = data.output

    if (!generatedMessage) {
      console.error('No output found in response. Available fields:', Object.keys(data))
      return new Response(
        JSON.stringify({ 
          error: 'No generated message found in API response',
          responseData: data,
          availableFields: Object.keys(data)
        }),
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
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'edge_function_error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
