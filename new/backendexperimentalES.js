const axios = require('axios');  // Usar Axios para la solicitud HTTP

module.exports = async function (context, req) {
    context.log('La función de activación HTTP ha recibido una solicitud.');

    // Registrar el cuerpo completo de la solicitud para depuración
    context.log('Cuerpo de la solicitud:', JSON.stringify(req.body));

    // Obtener los datos enviados desde el frontend (req.body)
    const collectedData = req.body;

    // Usar la variable de entorno para la clave de API (asegúrate de que esté configurada en tu entorno)
    const apiKey = process.env.OPENAI_API_KEY;

    // Verificar si collectedData es un array y tiene al menos un elemento
    if (Array.isArray(collectedData) && collectedData.length > 0) {
        // Crear un objeto estructurado userPreferences
        let userPreferences = {};
        collectedData.forEach(entry => {
            let key = "";
            switch (entry.question.toLowerCase()) {
                case 'format':
                    key = 'formato';
                    break;
                case 'user wants to':
                    key = 'deseos';
                    break;
                case 'excluding':
                    key = 'exclusiones';
                    break;
                case 'platform':
                    key = 'plataformas';
                    break;
                case 'additional user preferences':
                    key = 'preferenciasAdicionales';
                    break;
                default:
                    key = entry.question.replace(/\s+/g, '').toLowerCase();
            }
            userPreferences[key] = entry.answer;
        });

        context.log('Preferencias del usuario:', JSON.stringify(userPreferences));

        try {
            context.log('Realizando solicitud a la API de OpenAI...');

            // Preparar los mensajes para la finalización del chat
            const messages = [
                {
                    role: "system",
                    content: "Eres un asistente de recomendaciones de películas."
                },
                {
                    role: "user",
                    content: JSON.stringify(userPreferences)
                }
            ];

            // Preparar los parámetros de la función
            const functionDefinition = {
                name: "generar_sugerencias_de_peliculas",
                description: "Genera 3 recomendaciones de películas o programas de TV con metadatos detallados",
                parameters: {
                    type: "object",
                    properties: {
                        rec1_cardformattext: { type: "string", enum: ["TV Show", "Movie"], description: "Programa de TV o Película" },
                        rec1_cardcontenttitletext: { type: "string", description: "Título de la película o programa de TV recomendado" },
                        rec1_cardseasonstext: { type: "string", nullable: true, description: "Número de temporadas (si aplica para programas de TV)" },
                        rec1_cardepisodestext: { type: "string", nullable: true, description: "Número de episodios (si aplica para programas de TV)" },
                        rec1_carddurationtext: { type: "string", description: "Duración de la película o duración promedio de episodios" },
                        rec1_cardyeartext: { type: "string", nullable: true, description: "Año de lanzamiento (para películas)" },
                        rec1_carddescriptiontext: { type: "string", description: "Una descripción atractiva que coincida con las preferencias del usuario" },
                        rec1_platformtext: { type: "string", description: "Lista separada por comas de plataformas donde está disponible la película o el programa de TV" },
                        rec1_tagtext: { type: "string", description: "Una etiqueta que describe la película o programa de TV" },
                        rec1_tagtext2: { type: "string", description: "Una segunda etiqueta que describe la película o programa de TV" },
                        rec1_tagtext3: { type: "string", description: "Una tercera etiqueta que describe la película o programa de TV" },
                        // Estructura similar para rec2 y rec3
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

            // Hacer una solicitud a la API de OpenAI usando Axios
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    functions: [functionDefinition],
                    function_call: { name: "generar_sugerencias_de_peliculas" }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Registrar el estado y los datos de la respuesta
            context.log(`Estado de la respuesta de la API de OpenAI: ${response.status}`);
            context.log('Datos de la respuesta de la API de OpenAI:', JSON.stringify(response.data));

            // Extraer los argumentos de la llamada de función (que contienen el JSON estructurado)
            const functionCallArguments = response.data.choices[0].message.function_call.arguments;

            // Parsear los argumentos de JSON en formato string
            const recommendations = JSON.parse(functionCallArguments);

            // Enviar las recomendaciones parseadas de vuelta al frontend
            context.res = {
                status: 200,
                body: recommendations  // Enviar de vuelta la salida estructurada (objeto JSON)
            };

        } catch (error) {
            context.log.error('Error al llamar a la API de OpenAI:', error.message);

            // Registrar información detallada del error, incluyendo los datos de la respuesta si están disponibles
            if (error.response) {
                context.log.error('Datos de error de la respuesta de la API de OpenAI:', JSON.stringify(error.response.data));
                context.log.error('Estado de la respuesta de la API de OpenAI:', error.response.status);
            }

            context.res = {
                status: 500,
                body: {
                    message: "Error al procesar la solicitud",
                    error: error.message
                }
            };
        }

    } else {
        context.log.error('Solicitud no válida: No se proporcionaron datos válidos.');
        context.res = {
            status: 400,
            body: { message: 'Datos no válidos, por favor envía datos válidos.' }
        };
    }
};
