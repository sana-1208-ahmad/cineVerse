import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { tmdbService } from '../tmdb.js';
import { REAL_MOVIES } from '../data/moviesData.js';

export const aiRouter = Router();

// Recommendation endpoint
aiRouter.post('/recommend', async (req: Request, res: Response) => {
  try {
    const {
      mood,
      companion,
      era,
      pace,
      customQuery,
      profilePreferences,
      maturityLimit
    } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    const canUseGemini = Boolean(apiKey && apiKey.trim().length > 5 && !apiKey.includes('MY_GEMINI_API_KEY'));

    let aiRecommendations: any[] = [];

    if (canUseGemini) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `
You are the CineVerse AI Cinematic Discovery Engine.
Recommend 4 to 6 REAL, acclaimed, and fitting movies based on the user's specific request:

User Criteria:
- Mood: ${mood || 'Any mood'}
- Watching with: ${companion || 'Solo'}
- Preferred Era: ${era || 'Any era'}
- Narrative Pace: ${pace || 'Balanced'}
- Custom Request / Prompt: "${customQuery || ''}"
- Profile Favorite Genres: ${profilePreferences?.preferredGenres?.join(', ') || 'Any'}
- Maturity Limit: ${maturityLimit || 'NC-17'}

Return ONLY a valid JSON array of objects with the following schema:
[
  {
    "title": "Exact Title of Real Movie",
    "year": 2024,
    "tmdb_search_hint": "Search query for TMDB",
    "match_percentage": 97,
    "vibe_tags": ["Atmospheric", "Philosophical", "Visual Spectacle"],
    "why_you_will_love_it": "A concise 2-sentence explanation of why this movie matches their current mood and taste."
  }
]
Do not wrap in markdown quotes if possible, output pure JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are an elite Hollywood film critic and cinematic curator for CineVerse. You only suggest real, verified movies and output strictly valid JSON.'
          }
        });

        const text = response.text?.trim() || '[]';
        aiRecommendations = JSON.parse(text);
      } catch (geminiError) {
        console.warn('Gemini recommendation call failed or rate-limited; switching to intelligent fallback:', geminiError);
      }
    }

    // Fallback if Gemini didn't return or was unavailable
    if (!aiRecommendations || aiRecommendations.length === 0) {
      aiRecommendations = getRuleBasedRecommendations(mood, pace, era);
    }

    // Match each AI recommendation against our TMDB / Real Movies database
    const enrichedResults = [];
    for (const rec of aiRecommendations) {
      const searchTitle = (rec.title || rec.tmdb_search_hint || '').trim();
      if (!searchTitle) continue;

      let found = await tmdbService.searchMovies(searchTitle);

      // If not found, clean query (e.g. remove year in parentheses) and try once more
      if (found.length === 0) {
        const cleaned = searchTitle.replace(/\s*\(\d{4}\)/, '').trim();
        if (cleaned && cleaned !== searchTitle) {
          found = await tmdbService.searchMovies(cleaned);
        }
      }

      // Never substitute a random unrelated movie; only accept confirmed TMDB matches
      if (found.length > 0) {
        const movie = found[0];
        // Avoid duplicate movie entries
        if (!enrichedResults.some(m => m.id === movie.id)) {
          enrichedResults.push({
            ...movie,
            ai_match_score: rec.match_percentage || Math.floor(92 + Math.random() * 7),
            vibe_tags: rec.vibe_tags || ['Cinematic', 'Must Watch', 'Critically Acclaimed'],
            why_you_will_love_it: rec.why_you_will_love_it || `A captivating selection that echoes your desire for ${mood || 'great storytelling'}.`
          });
        }
      }
    }

    // If no direct matches resolved, safely resolve rule-based verified titles
    if (enrichedResults.length === 0) {
      const fallbackRecs = getRuleBasedRecommendations(mood, pace, era);
      for (const fallback of fallbackRecs) {
        const found = await tmdbService.searchMovies(fallback.title);
        if (found.length > 0 && !enrichedResults.some(m => m.id === found[0].id)) {
          enrichedResults.push({
            ...found[0],
            ai_match_score: fallback.match_percentage,
            vibe_tags: fallback.vibe_tags,
            why_you_will_love_it: fallback.why_you_will_love_it
          });
        }
      }
    }

    return res.json({
      recommendations: enrichedResults,
      poweredBy: canUseGemini ? 'Gemini 2.5 Flash' : 'CineVerse Discovery Engine'
    });
  } catch (err: any) {
    console.error('AI Recommend Error:', err);
    return res.status(500).json({ error: err.message || 'AI Recommendation failed' });
  }
});

// Explain Why Match endpoint
aiRouter.post('/explain', async (req: Request, res: Response) => {
  try {
    const { movieId, movieTitle, profileName, profileGenres } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const canUseGemini = Boolean(apiKey && apiKey.trim().length > 5 && !apiKey.includes('MY_GEMINI_API_KEY'));

    if (canUseGemini) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `
Explain in 2-3 engaging, cinematic sentences why the movie "${movieTitle}" is an exceptional match for ${profileName || 'the viewer'}.
Mention cinematography, storytelling, or tone. Profile affinity tags: ${profileGenres?.join(', ') || 'Eclectic cinema lover'}.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        return res.json({
          explanation: response.text?.trim() || `"${movieTitle}" offers an immaculate blend of visionary pacing and stellar performances perfectly aligned with your viewing history.`
        });
      } catch (err) {
        console.warn('Gemini explain error:', err);
      }
    }

    return res.json({
      explanation: `"${movieTitle}" is widely acclaimed for its masterful narrative and immersive direction, resonating strongly with viewers who appreciate deep character arcs and bold visual storytelling.`
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Conversational Chatbot endpoint
aiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    const canUseGemini = Boolean(apiKey && apiKey.trim().length > 5 && !apiKey.includes('MY_GEMINI_API_KEY'));

    if (canUseGemini) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `
You are CineBot, the AI film scholar and movie recommender at CineVerse.
The user says: "${message}".
Conversation context: ${JSON.stringify(history || [])}.

Answer warmly with cinematic expertise.
Recommend 2-3 specific real movies. Highlight their director, tone, and why they stand out.
Keep your response concise (under 120 words), well-formatted, and exciting.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are CineBot, an insightful, warm, and highly knowledgeable film expert for the CineVerse streaming platform.'
          }
        });

        return res.json({
          reply: response.text?.trim(),
          source: 'Gemini 2.5 Flash'
        });
      } catch (err) {
        console.warn('Gemini chat error:', err);
      }
    }

    // Fallback response
    return res.json({
      reply: `I love that taste in cinema! Based on "${message}", I highly recommend checking out "Dune: Part Two" for towering scope and "Blade Runner 2049" for unmatched atmospheric neon noir. Both deliver profound visual mastery and rich character journeys!`,
      source: 'CineBot Engine'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

function getRuleBasedRecommendations(mood?: string, pace?: string, era?: string) {
  const m = (mood || '').toLowerCase();
  if (m.includes('mind') || m.includes('sci-fi') || m.includes('think')) {
    return [
      { title: 'Inception', year: 2010, match_percentage: 98, vibe_tags: ['Mind-Bending', 'High Stakes', 'Heist'], why_you_will_love_it: 'A multi-layered architectural dream journey with breathtaking set pieces and relentless momentum.' },
      { title: 'Interstellar', year: 2014, match_percentage: 97, vibe_tags: ['Cosmic', 'Emotional', 'Epic'], why_you_will_love_it: 'Transcendent space exploration backed by Hans Zimmer\'s towering score and gut-wrenching heart.' },
      { title: 'Blade Runner 2049', year: 2017, match_percentage: 95, vibe_tags: ['Cyberpunk', 'Moody', 'Philosophical'], why_you_will_love_it: 'Stunning cinematography and a slow-burning mystery investigating what it means to be human.' }
    ];
  } else if (m.includes('adren') || m.includes('action') || m.includes('rush')) {
    return [
      { title: 'The Dark Knight', year: 2008, match_percentage: 99, vibe_tags: ['Intense', 'Masterpiece', 'Crime'], why_you_will_love_it: 'Uncompromising psychological warfare between the Caped Crusader and Heath Ledger’s legendary Joker.' },
      { title: 'Dune: Part Two', year: 2024, match_percentage: 98, vibe_tags: ['Visceral', 'Desert War', 'Spectacle'], why_you_will_love_it: 'Pure cinematic adrenaline featuring colossal sandworm riders and epic desert combat.' },
      { title: 'The Matrix', year: 1999, match_percentage: 94, vibe_tags: ['Kung Fu', 'Revolution', 'Groundbreaking'], why_you_will_love_it: 'Revolutionary action choreography and reality-questioning cyber warfare.' }
    ];
  } else if (m.includes('cozy') || m.includes('feel') || m.includes('heart') || m.includes('family')) {
    return [
      { title: 'Spirited Away', year: 2001, match_percentage: 98, vibe_tags: ['Enchanting', 'Whimsical', 'Nostalgic'], why_you_will_love_it: 'A deeply comforting and gorgeous journey through a fantastical bathhouse of Japanese folklore.' },
      { title: 'Spider-Man: Across the Spider-Verse', year: 2023, match_percentage: 96, vibe_tags: ['Vibrant', 'Family', 'Inspiring'], why_you_will_love_it: 'Visual poetry with incredible emotional resonance as Miles Morales defines his own destiny.' },
      { title: 'Your Name.', year: 2016, match_percentage: 95, vibe_tags: ['Romantic', 'Time Travel', 'Tearjerker'], why_you_will_love_it: 'A breathtakingly beautiful anime romance connected across space, time, and dreams.' }
    ];
  } else {
    return [
      { title: 'Parasite', year: 2019, match_percentage: 97, vibe_tags: ['Dark Comedy', 'Social Thriller', 'Twists'], why_you_will_love_it: 'An electric, unpredictable masterpiece that shifts genres from laugh-out-loud comedy to nerve-shredding thriller.' },
      { title: 'Oppenheimer', year: 2023, match_percentage: 96, vibe_tags: ['Biographical', 'Tense', 'Historical'], why_you_will_love_it: 'Electrifying dialogue and unrelenting tempo as humanity stands on the precipice of doom.' },
      { title: 'The Shawshank Redemption', year: 1994, match_percentage: 99, vibe_tags: ['Triumph', 'Friendship', 'Classic'], why_you_will_love_it: 'The ultimate tale of unshakeable resilience, brotherhood, and hard-earned freedom.' }
    ];
  }
}
