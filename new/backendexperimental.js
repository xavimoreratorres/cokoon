const axios = require('axios');  // Use Axios for the HTTP request

module.exports = async function (context, req) {
    context.log('HTTP trigger function received a request.');

    // Log the full request body for debugging
    context.log('Request Body:', JSON.stringify(req.body));

    // Get the data sent from the frontend (req.body)
    const collectedData = req.body;

    // Use environment variable for API key (make sure it's set in your environment)
    const apiKey = process.env.OPENAI_API_KEY;

    // Check if collectedData is an array and has at least one item
    if (Array.isArray(collectedData) && collectedData.length > 0) {
        // Create a structured userPreferences object
        let userPreferences = {};
        collectedData.forEach(entry => {
            let key = "";
            switch (entry.question.toLowerCase()) {
                case 'format':
                    key = 'format';
                    break;
                case 'user wants to':
                    key = 'desires';
                    break;
                case 'excluding':
                    key = 'excluding';
                    break;
                case 'platform':
                    key = 'platforms';
                    break;
                case 'additional user preferences':
                    key = 'additionalPreferences';
                    break;
                default:
                    key = entry.question.replace(/\s+/g, '').toLowerCase();
            }
            userPreferences[key] = entry.answer;
        });

        context.log('User Preferences:', JSON.stringify(userPreferences));

        try {
            context.log('Making request to OpenAI API...');

            // Prepare the messages for the chat completion
            const messages = [
                {
                    role: "system",
                    content: "You are a movie recommendation assistant."
                },
                {
                    role: "user",
                    content: JSON.stringify(userPreferences)
                }
            ];

            // Prepare the function parameters
            const functionDefinition = {
                name: "generate_movie_suggestions",
                description: "Generates 3 movie or TV show recommendations with detailed metadata",
                parameters: {
                    type: "object",
                    properties: {
                        rec1_cardformattext: { type: "string", enum: ["TV Show", "Movie"], description: "TV Show or Movie" },
                        rec1_cardcontenttitletext: { type: "string", description: "Title of the recommended TV Show or Movie" },
                        rec1_cardseasonstext: { type: "string", nullable: true, description: "Number of seasons (if applicable for TV Show)" },
                        rec1_cardepisodestext: { type: "string", nullable: true, description: "Number of episodes (if applicable for TV Show)" },
                        rec1_carddurationtext: { type: "string", description: "Duration of the Movie or average episode length" },
                        rec1_cardyeartext: { type: "string", nullable: true, description: "Year of release (for Movie)" },
                        rec1_carddescriptiontext: { type: "string", description: "An engaging description matching user's preferences" },
                        rec1_platformtext: { type: "string", description: "Comma-separated list of platforms where the Movie or TV Show is available" },
                        rec1_tagtext: { type: "string", description: "A tag describing the Movie or TV Show" },
                        rec1_tagtext2: { type: "string", description: "A second tag describing the Movie or TV Show" },
                        rec1_tagtext3: { type: "string", description: "A third tag describing the Movie or TV Show" },
                        // Similar structure for rec2 and rec3
                        rec2_cardformattext: { type: "string", enum: ["TV Show", "Movie"] },
                        rec2_cardcontenttitletext: { type: "string" },
                        rec2_cardseasonstext: { type: "string", nullable: true },
                        rec2_cardepisodestext: { type: "string", nullable: true },
                        rec2_carddurationtext: { type: "string" },
                        rec2_cardyeartext: { type: "string", nullable: true },
                        rec2_carddescriptiontext: { type: "string" },
                        rec2_platformtext: { type: "string" },
                        rec2_tagtext: { type: "string" },
                        rec2_tagtext2: { type: "string" },
                        rec2_tagtext3: { type: "string" },
                        rec3_cardformattext: { type: "string", enum: ["TV Show", "Movie"] },
                        rec3_cardcontenttitletext: { type: "string" },
                        rec3_cardseasonstext: { type: "string", nullable: true },
                        rec3_cardepisodestext: { type: "string", nullable: true },
                        rec3_carddurationtext: { type: "string" },
                        rec3_cardyeartext: { type: "string", nullable: true },
                        rec3_carddescriptiontext: { type: "string" },
                        rec3_platformtext: { type: "string" },
                        rec3_tagtext: { type: "string" },
                        rec3_tagtext2: { type: "string" },
                        rec3_tagtext3: { type: "string" }
                    },
                    required: [
                        "rec1_cardformattext",
                        "rec1_cardcontenttitletext",
                        "rec1_carddurationtext",
                        "rec1_carddescriptiontext",
                        "rec1_platformtext",
                        "rec2_cardformattext",
                        "rec2_cardcontenttitletext",
                        "rec2_carddurationtext",
                        "rec2_carddescriptiontext",
                        "rec2_platformtext",
                        "rec3_cardformattext",
                        "rec3_cardcontenttitletext",
                        "rec3_carddurationtext",
                        "rec3_carddescriptiontext",
                        "rec3_platformtext"
                    ]
                }
            };

            // Make a request to the OpenAI API using Axios
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    functions: [functionDefinition],
                    function_call: { name: "generate_movie_suggestions" }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Log the status and data of the response
            context.log(`OpenAI API Response Status: ${response.status}`);
            context.log('OpenAI API Response Data:', JSON.stringify(response.data));

            // Extract the function call arguments (which contain the structured JSON)
            const functionCallArguments = response.data.choices[0].message.function_call.arguments;

            // Parse the arguments from stringified JSON
            const recommendations = JSON.parse(functionCallArguments);

            // Send the parsed recommendations back to the frontend
            context.res = {
                status: 200,
                body: recommendations  // Send back the structured output (JSON object)
            };

        } catch (error) {
            context.log.error('Error calling OpenAI API:', error.message);

            // Log detailed error information, including response data if available
            if (error.response) {
                context.log.error('OpenAI API Response Error Data:', JSON.stringify(error.response.data));
                context.log.error('OpenAI API Response Status:', error.response.status);
            }

            context.res = {
                status: 500,
                body: {
                    message: "Error processing the request",
                    error: error.message
                }
            };
        }

    } else {
        context.log.error('Invalid request: No valid collected data provided.');
        context.res = {
            status: 400,
            body: { message: 'Invalid data, please send valid collected data.' }
        };
    }
};
