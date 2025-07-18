
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
    
    console.log('=== DETAILED ENVIRONMENT DEBUG ===')
    console.log('All environment variables:')
    for (const [key, value] of Object.entries(Deno.env.toObject())) {
      if (key.includes('HYPERLEAP') || key.includes('API')) {
        console.log(`${key}: ${value ? `${value.slice(0, 8)}...` : 'undefined'}`)
      }
    }
    console.log('HYPERLEAP_API_KEY specifically:', hyperleapApiKey ? `${hyperleapApiKey.slice(0, 8)}...` : 'NOT FOUND')
    console.log('================================')
    
    if (!hyperleapApiKey) {
      console.error('HYPERLEAP_API_KEY not found in environment variables')
      console.error('Available environment variables containing API or HYPERLEAP:')
      for (const [key, value] of Object.entries(Deno.env.toObject())) {
        if (key.toUpperCase().includes('API') || key.toUpperCase().includes('HYPERLEAP')) {
          console.error(`- ${key}: ${value ? 'SET' : 'NOT SET'}`)
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'HYPERLEAP_API_KEY not configured in Supabase Edge Function Secrets',
          availableKeys: Object.keys(Deno.env.toObject()).filter(key => 
            key.toUpperCase().includes('API') || key.toUpperCase().includes('HYPERLEAP')
          )
        }),
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

    // Request body for Hyperleap API
    const requestBody = {
      promptId: '9ab5aa1f-b408-4881-9355-d82bf23c52dd',
      promptVersionId: '7c3a9c75-150e-4d92-99de-af31ff065bb9',
      replacements: replacements
    }

    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    console.log('Making request to Hyperleap API...')
    
    // Add retry logic with exponential backoff
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}/3 to call Hyperleap API`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
        
        const response = await fetch('https://api.hyperleapai.com/prompt-runs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-hl-api-key': hyperleapApiKey,
            'User-Agent': 'Supabase-Edge-Function/1.0',
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        
        console.log(`Attempt ${attempt} - Response status:`, response.status)
        console.log(`Attempt ${attempt} - Response statusText:`, response.statusText)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`=== API ERROR RESPONSE (Attempt ${attempt}) ===`)
          console.error('Status:', response.status)
          console.error('StatusText:', response.statusText)
          console.error('Response body:', errorText)
          console.error('========================================')
          
          // If it's a 4xx error, don't retry
          if (response.status >= 400 && response.status < 500) {
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
          
          // For 5xx errors, continue to retry
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
          if (attempt === 3) throw lastError
          continue
        }

        const data = await response.json()
        console.log('API Response structure:', Object.keys(data))
        console.log('Full API Response:', JSON.stringify(data, null, 2))

        // Extract message from the response structure
        const generatedMessage = data.choices?.[0]?.message?.content || data.output

        if (!generatedMessage) {
          console.error('No message found in response. Available fields:', Object.keys(data))
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
        
      } catch (fetchError) {
        console.error(`=== FETCH ERROR (Attempt ${attempt}) ===`)
        console.error('Error details:', fetchError)
        console.error('Error message:', fetchError instanceof Error ? fetchError.message : String(fetchError))
        console.error('Error name:', fetchError instanceof Error ? fetchError.name : 'Unknown')
        console.error('=====================================')
        
        lastError = fetchError
        
        // If this is the last attempt, break
        if (attempt === 3) break
        
        // Wait before retrying (exponential backoff: 1s, 2s)
        const delay = Math.pow(2, attempt - 1) * 1000
        console.log(`Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    // If we get here, all attempts failed
    throw lastError

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
