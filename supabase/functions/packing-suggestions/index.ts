const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  weatherCode: number;
  uvIndex: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, destinationType, weather, tripDays } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate weather summary
    const avgMaxTemp = weather.reduce((sum: number, d: WeatherDay) => sum + d.maxTemp, 0) / weather.length;
    const avgMinTemp = weather.reduce((sum: number, d: WeatherDay) => sum + d.minTemp, 0) / weather.length;
    const totalRain = weather.reduce((sum: number, d: WeatherDay) => sum + d.precipitation, 0);
    const maxUV = Math.max(...weather.map((d: WeatherDay) => d.uvIndex));

    const weatherSummary = `
      - Average high temperature: ${Math.round(avgMaxTemp)}°C
      - Average low temperature: ${Math.round(avgMinTemp)}°C
      - Total expected rainfall: ${Math.round(totalRain)}mm
      - Max UV index: ${Math.round(maxUV)}
    `;

    const systemPrompt = `You are a helpful travel packing assistant. Generate practical packing suggestions based on the destination, weather forecast, and trip type. Be concise and specific. Return suggestions in categories.`;

    const userPrompt = `Generate packing suggestions for a ${tripDays}-day trip to ${destination} (${destinationType} destination).

Weather forecast:
${weatherSummary}

Provide suggestions in these categories:
1. Clothing (based on temperature and weather)
2. Accessories (based on UV, rain, activities)
3. Electronics & Gadgets
4. Health & Safety
5. Destination-specific items

Keep each item brief (2-4 words). Provide 3-5 items per category. Focus on practical, essential items.`;

    console.log('Generating packing suggestions for:', destination);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'suggest_packing',
              description: 'Return categorized packing suggestions',
              parameters: {
                type: 'object',
                properties: {
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', description: 'Category name' },
                        icon: { type: 'string', enum: ['shirt', 'sunglasses', 'smartphone', 'first-aid', 'map-pin'] },
                        items: { 
                          type: 'array', 
                          items: { type: 'string' },
                          description: 'List of items to pack'
                        },
                      },
                      required: ['name', 'icon', 'items'],
                      additionalProperties: false,
                    },
                  },
                  tips: {
                    type: 'array',
                    items: { type: 'string' },
                    description: '2-3 essential packing tips for this trip'
                  },
                },
                required: ['categories', 'tips'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'suggest_packing' } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'AI credits exhausted. Please add funds.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate suggestions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.error('No tool call in response');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const suggestions = JSON.parse(toolCall.function.arguments);
    console.log('Packing suggestions generated successfully');

    return new Response(
      JSON.stringify({ success: true, ...suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating packing suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});