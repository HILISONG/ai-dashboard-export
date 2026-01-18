
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Hero, CardData, StoryPhase } from '../types';
import { PHASE_CONFIG } from '../constants';

// Lazy initialization to prevent crash on module load
let aiInstance: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
  if (!aiInstance) {
    // Fallback to a dummy key if env is missing to allow UI to load (calls will fail gracefully later)
    const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : 'MISSING_KEY';
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// Updated style to remove "miniature/toy" feel and add "adventure/scale"
const IMAGE_STYLE = "3D stylized rendering, pixar-style animation, high-quality CGI, immersive fantasy atmosphere, wide angle cinematic composition, detailed environment, vibrant and rich colors, soft global illumination, volumetric lighting, distinct textures, 8k resolution, magical realism";

const SYSTEM_INSTRUCTION = `
You are a children's book author writing for a 4-10 year old audience. 
The setting is 'Sky Island' (Rules: floating islands, cloud sea, whimsical). 

STORY STRUCTURE RULES:
1.  **Phase 1 (Setup):** Tone: Welcoming. Goal: Establish world/motivation.
2.  **Phase 2 (Adventure):** Tone: Exciting. Goal: Explore, meet NPCs, minor obstacles.
3.  **Phase 3 (Climax):** Tone: Dramatic/Epic. Goal: High stakes, boss challenge, or mystery reveal.
4.  **Phase 4 (Resolution):** Tone: Warm. Goal: Winding down, reward, conclusion.

GENERAL RULES:
Rule 1: Keep sentences VERY SHORT and punchy. Maximum 30-40 words per page.
Rule 2: **CONTINUITY IS CRITICAL.** You must explicitly connect the new page to the events of the previous page. Do not jump randomly.
Rule 3: If a Card is played, the protagonist must find/use/encounter that object IMMEDIATELY in the scene. Narrate the discovery.
Rule 4: Output strictly in JSON format.
`;

const STORY_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    storyText: {
      type: Type.STRING,
      description: "The narrative text for the story page. Strictly under 40 words. Simple vocabulary.",
    },
    imagePrompt: {
      type: Type.STRING,
      description: `A detailed description to generate a children's book illustration for this page. 
      CRITICAL INSTRUCTION FOR CHARACTER CONSISTENCY:
      1. You MUST include the specific physical traits from the 'Appearance' (skin color, hair style/color, facial features) in every single prompt.
      2. For clothing: Use the 'Appearance' clothing as the DEFAULT. 
      3. EXCEPTION: If the 'Card' played involves wearing something (e.g. 'Glider Cape', 'Armor'), or the plot changes the outfit (e.g. 'Space Suit'), OVERRIDE the default clothing with the new item.
      4. Always append the style: "${IMAGE_STYLE}".`,
    },
    companionStatus: {
        type: Type.STRING,
        enum: ["STAYS", "LEAVES"],
        description: "If a companion (NPC) is present in the scene, return 'STAYS' if they continue with the hero to the next page, or 'LEAVES' if they separate. Default to 'STAYS' if not mentioned."
    }
  },
  required: ["storyText", "imagePrompt", "companionStatus"],
};

export const generateStoryPage = async (
  hero: Hero,
  previousContext: string,
  phase: StoryPhase,
  companion?: Hero | null,
  card?: CardData,
  isEnding: boolean = false
): Promise<{ text: string; imagePrompt: string; companionStatus: 'STAYS' | 'LEAVES' }> => {

  const model = "gemini-3-flash-preview"; 
  const phaseInfo = PHASE_CONFIG[phase];

  // Inject appearance into the prompt to ensure consistency
  let prompt = `
    HERO PROFILE (Visual Anchor):
    Name: ${hero.name}
    Appearance (Baseline): ${hero.appearance || "a young child"}
    Power: ${hero.power}
    Trait: ${hero.aiInstruction}
    
    CURRENT SITUATION:
    Phase: ${phase} (${phaseInfo.tone})
    Goal: ${phaseInfo.goal}

    PRIOR CONTEXT (The Story So Far): 
    "${previousContext || "The story begins on a floating island."}"
  `;

  if (companion) {
      prompt += `
      
      ACTIVE COMPANION (NPC):
      Name: ${companion.name}
      Appearance: ${companion.appearance}
      Trait: ${companion.aiInstruction}
      
      INSTRUCTION FOR COMPANION:
      The hero is currently accompanied by ${companion.name}.
      1. You MUST mention ${companion.name} by name in the story text.
      2. You MUST include ${companion.name} in the visual description (imagePrompt) interacting with the hero.
      3. They should stay with the hero unless the plot forces them to leave.
      `;
  }

  if (card) {
    prompt += `
    
    NEW ACTION REQUIRED:
    The user just played the card: "${card.name}" (${card.rarity}).
    Card Description/Effect: "${card.description}"
    `;

    // Special Logic for Riddle Gate to ensure it generates an actual riddle
    if (card.name === 'The Riddle Gate' || card.id === 'a_g2') {
       prompt += `
       SPECIAL INSTRUCTION:
       The story must include the gatekeeper asking a short, rhyming riddle about the sky, wind, or clouds.
       The protagonist should hear this riddle in the text.
       `;
    }

    prompt += `
    INSTRUCTION:
    Write the next page. You MUST start by bridging the gap from the PRIOR CONTEXT to this NEW ACTION. 
    How does the hero find this item or meet this person based on where they just were? 
    Make it feel like a continuous movie scene, not a random event.
    `;
  } else if (isEnding) {
    prompt += `
    
    INSTRUCTION:
    Bring the story to a heartwarming conclusion based on the PRIOR CONTEXT. Wrap up the adventure.
    `;
  } else if (phase === StoryPhase.SETUP) {
    // Intro / Transition without card for Page 1/2
    prompt += `
    
    INSTRUCTION:
    Write the opening scene. Introduce the hero and the beautiful Sky Island setting.
    Do NOT state a specific major goal, quest, or conflict yet. Just let the hero exist in the world and enjoy the view.
    `;
  } else {
    // Generic transition
    prompt += `
    
    INSTRUCTION:
    Continue the story naturally. Move the plot forward towards the ${phase} goal.
    `;
  }

  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: STORY_SCHEMA,
      },
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("No text response from Gemini");
    
    const json = JSON.parse(textResponse);
    
    return {
        text: json.storyText,
        imagePrompt: json.imagePrompt,
        companionStatus: json.companionStatus || 'STAYS'
    };
  } catch (error) {
    console.error("Story Gen Error:", error);
    return {
      text: "The clouds swirled mysteriously, hiding the path ahead. (The scribe lost their pen!)",
      imagePrompt: `A mysterious cloud fog covering a floating island, ${IMAGE_STYLE}`,
      companionStatus: 'STAYS'
    };
  }
};

// Helper to convert URL to Base64
const urlToBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data:image/xyz;base64, part if present to get raw base64
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Could not load reference image for generation:", error);
    return null;
  }
};

// Optimization: Compress and resize image before sending to API
const resizeAndCompressImage = async (base64Data: string, maxWidth = 512): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `data:image/jpeg;base64,${base64Data}`;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(base64Data); // Fallback to original
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            
            // Export as JPEG with 60% quality
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
            // Return raw base64 (without header)
            resolve(compressedDataUrl.split(',')[1]);
        };

        img.onerror = (e) => {
            console.warn("Image compression failed, using original", e);
            resolve(base64Data);
        };
    });
};

const prepareImageForApi = async (imageUrl: string): Promise<string | null> => {
    let base64Data: string | null = null;
    if (imageUrl.startsWith('data:')) {
        base64Data = imageUrl.split(',')[1];
    } else {
        base64Data = await urlToBase64(imageUrl);
    }
    
    if (base64Data) {
        return await resizeAndCompressImage(base64Data);
    }
    return null;
};

export const generateIllustration = async (imagePrompt: string, mainCharImageUrl?: string, secondaryImageUrl?: string): Promise<string> => {
  const model = "gemini-2.5-flash-image"; 
  
  try {
    const ai = getAi();
    
    // Default prompt if no images
    let promptText = imagePrompt;
    const parts: any[] = [];

    // 1. Handle Main Character Image
    if (mainCharImageUrl) {
        const optimizedMain = await prepareImageForApi(mainCharImageUrl);
        if (optimizedMain) {
            parts.push({
                inlineData: { mimeType: "image/jpeg", data: optimizedMain }
            });
        }
    }

    // 2. Handle Secondary Character Image (NPC)
    if (secondaryImageUrl) {
         const optimizedSecondary = await prepareImageForApi(secondaryImageUrl);
         if (optimizedSecondary) {
             parts.push({
                 inlineData: { mimeType: "image/jpeg", data: optimizedSecondary }
             });
         }
    }

    // 3. Construct Prompt based on images available - MODIFIED FOR DYNAMIC POSES
    if (mainCharImageUrl && secondaryImageUrl) {
        promptText = `
        IMAGE 1 (First attachment) is the MAIN CHARACTER.
        IMAGE 2 (Second attachment) is the SECONDARY CHARACTER (NPC/COMPANION).
        
        INSTRUCTION: Generate a scene containing BOTH characters interacting.
        - The Main Character MUST look like Image 1 (same clothing/colors/face).
        - The Secondary Character MUST look like Image 2.
        - CRITICAL: **IGNORE THE POSE** in the reference images. Generate a **NEW, DYNAMIC ACTION POSE** for both characters that fits the scene description.
        
        SCENE DESCRIPTION: ${imagePrompt}`;
    } else if (mainCharImageUrl) {
        promptText = `
        Use the attached image as a strict visual reference for the character's **physical appearance** (features, colors, clothing).
        
        CRITICAL: **DO NOT COPY THE POSE** from the reference image.
        The character must be in a **NEW, DYNAMIC POSE** that matches the action in the scene description below.
        
        SCENE DESCRIPTION: ${imagePrompt}`;
    }

    // Add text prompt last
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
        model,
        contents: {
          parts: parts
        },
        config: {
            imageConfig: {
                aspectRatio: "3:4", 
            }
        }
    });

    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen Error:", error);
    return `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22800%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e0f2fe%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23333%22%3EImage%20Generation%20Unavailable%3C%2Ftext%3E%3C%2Fsvg%3E`;
  }
};

export const analyzeCharacterImage = async (base64Data: string): Promise<{ isValid: boolean; description?: string; error?: string }> => {
  const model = "gemini-3-flash-preview"; 
  
  const prompt = `
    Analyze this image to create a consistent 3D character reference for a children's book.

    Task:
    1. Determine if this contains a human/character suitable for a story.
    2. Create a HIGHLY DETAILED physical description.
    
    IMPORTANT - FULL BODY EXTRAPOLATION:
    If the image is a headshot or partial view, you MUST 'hallucinate' or invent a matching outfit for the lower body (pants, shoes) to complete the character. Do not say "not visible". Pick something that matches the style of the visible parts.

    Extract the following details:
    - Age group (e.g. 5-year old, 8-year old)
    - Precise Skin Tone (e.g. warm beige, deep brown, pale with freckles)
    - Hair: Color, Texture, Style (e.g. messy curly dark brown hair tied in a red bun)
    - Face: distinct features (glasses, freckles, gap in teeth)
    - Clothing Top: Color, type, fabric texture (e.g. bright yellow knitted sweater)
    - Clothing Bottom (Invent if needed): e.g. blue denim shorts, green cargo pants
    - Shoes (Invent if needed): e.g. red sneakers with white laces
    - Accessories: e.g. a silver necklace, a blue backpack

    Return valid JSON matching this schema:
    {
       "isValid": boolean,
       "fullDescription": "A complete, prose description combining all physical and clothing traits into one dense paragraph suitable for an image generation prompt."
    }
  `;

  try {
     const ai = getAi();
     // OPTIMIZATION: Compress analysis image as well
     const optimizedBase64 = await resizeAndCompressImage(base64Data);

     const response = await ai.models.generateContent({
        model,
        contents: {
            parts: [
                { inlineData: { mimeType: "image/jpeg", data: optimizedBase64 } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: "application/json"
        }
    });
    
    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    const json = JSON.parse(text);
    return { 
        isValid: json.isValid, 
        description: json.fullDescription 
    };

  } catch (e) {
      console.error("Vision Analysis Error", e);
      return { isValid: false, error: "Could not analyze image." };
  }
};

export const generateAvatarFromDescription = async (description: string): Promise<string> => {
    const model = "gemini-2.5-flash-image";
    
    const prompt = `
      A cute, happy close-up portrait of a character matching this description: "${description}".
      The character is smiling warmly at the camera.
      Style: ${IMAGE_STYLE}
      Solid soft blue background.
    `;

    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1"
                }
            }
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        throw new Error("No avatar generated");
    } catch (e) {
        console.error("Avatar Gen Error", e);
        // Return a fallback emoji avatar if generation fails
        return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=fallback`;
    }
};
