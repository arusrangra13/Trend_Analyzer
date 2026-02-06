// Google Gemini AI Service for Real Script Generation
export class GeminiService {

  // Test API connection and list available models
  static async testConnection() {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await response.json();

      console.log('Available Gemini Models:', data.models?.map(m => ({ name: m.name, supportedMethods: m.supportedGenerationMethods })));
      return data;
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      throw error;
    }
  }

  static async generateScript(data) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
      }

      const { topic, platform, style, length, domain, trendingKeywords } = data;

      // Create context-aware prompt based on platform and style
      const prompt = this.createPrompt(topic, platform, style, length, domain, trendingKeywords);

      // Try different model names in order of preference
      const modelNames = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.0-pro',
        'gemini-pro'
      ];

      let lastError;
      for (const modelName of modelNames) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
              }
            })
          });

          if (response.ok) {
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
              throw new Error('No content generated from Gemini API');
            }

            console.log(`Successfully used model: ${modelName}`);
            return this.formatScript(generatedText, platform, data.wordCount);
          } else {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || response.statusText;
            console.log(`Model ${modelName} failed (${response.status}):`, errorMessage);
            lastError = new Error(`Model ${modelName} failed: ${errorMessage}`);
          }
        } catch (error) {
          console.log(`Model ${modelName} failed:`, error.message);
          lastError = error;
          continue; // Try next model
        }
      }

      throw lastError || new Error('All Gemini models failed');
    } catch (error) {
      console.error('Gemini API Error:', error);

      // Fallback to simulated response if API fails
      console.warn('Falling back to simulated script generation due to API failure');
      return this.generateFallbackScript(data);
    }
  }

  static generateFallbackScript(data) {
    const { topic, platform, style, wordCount } = data;

    const templates = {
      youtube: {
        casual: `Hey everyone! Welcome back to the channel. Today we're talking about ${topic}.\n\n${topic} has been trending lately, and for good reason. Let me break down what you need to know...\n\nFirst off, ${topic} is changing the game because it offers unique opportunities that many people haven't discovered yet.\n\nIf you found this helpful, don't forget to like and subscribe!`,
        professional: `In today's comprehensive analysis, we'll examine ${topic} and its implications for the industry.\n\n${topic} represents a significant shift in how we approach current challenges. Let's explore the key factors:\n\n1. Understanding the fundamentals of ${topic}\n2. Recent developments and trends\n3. Future implications and opportunities\n\nThank you for watching. Please share your thoughts in the comments below.`,
        energetic: `WHAT'S UP EVERYONE! 🔥 Today we're diving deep into ${topic} and trust me, you don't want to miss this!\n\n${topic} is absolutely blowing up right now and I'm here to tell you WHY!\n\nLet's go! 💪\n\nSMASH that like button if you're excited about ${topic}!`
      },
      instagram: {
        casual: `${topic} ✨\n\nBeen seeing this everywhere lately and had to share my thoughts!\n\nWhat do you guys think about ${topic}? Drop a comment below! 👇\n\n#${topic.replace(/\s+/g, '')} #trending #viral`,
        professional: `Understanding ${topic}: A Professional Perspective\n\nKey insights on ${topic} and its impact on our industry.\n\nFollow for more expert analysis on trending topics.\n\n#${topic.replace(/\s+/g, '')} #business #professional`,
        energetic: `${topic} IS TAKING OVER! 🚀\n\nCan't believe how fast ${topic} is growing!\n\nWho else is excited about this?! 🙌\n\n#${topic.replace(/\s+/g, '')} #trending #viral #excited`
      },
      twitter: {
        casual: `${topic} is trending and I have thoughts... 🤔\n\nWhat's your take on ${topic}?\n\n#${topic.replace(/\s+/g, '')} #trending`,
        professional: `Analysis: ${topic} represents a significant development in the industry. Key implications include...\n\n#${topic.replace(/\s+/g, '')} #analysis #business`,
        energetic: `${topic} IS EVERYWHERE RIGHT NOW! 🔥\n\nIf you're not talking about ${topic}, you're missing out!\n\n#${topic.replace(/\s+/g, '')} #trending #viral`
      }
    };

    const platformTemplates = templates[platform] || templates.youtube;
    const script = platformTemplates[style] || platformTemplates.casual;

    // Adjust word count to match target
    return this.adjustWordCount(script, wordCount, script.split(/\s+/).filter(word => word.length > 0).length);
  }

  static createPrompt(topic, platform, style, wordCount, domain, trendingKeywords = []) {
    const platformInstructions = {
      youtube: {
        casual: "Create a casual, conversational YouTube script that feels like talking to a friend. Use 'you' and 'I', include engaging questions, and add calls-to-action like 'like and subscribe'.",
        professional: "Create a professional, educational YouTube script with clear structure, expert insights, and valuable takeaways. Use formal language and include data-driven points.",
        energetic: "Create a high-energy, exciting YouTube script with enthusiasm, exclamation points, and engaging hooks. Use trending slang and create FOMO (fear of missing out)."
      },
      instagram: {
        casual: "Create a casual Instagram post with emojis, personal stories, and engaging questions. Use hashtags naturally and keep it under 2200 characters.",
        professional: "Create a professional Instagram post with industry insights, clean formatting, and valuable expertise. Use professional hashtags and maintain brand voice.",
        energetic: "Create an energetic Instagram post with excitement, emojis, and viral potential. Use trending hashtags and create engagement through questions."
      },
      twitter: {
        casual: "Create a casual tweet with conversational tone, personal opinions, and engaging questions. Keep under 280 characters with relevant hashtags.",
        professional: "Create a professional tweet with industry insights, data points, and expert commentary. Use professional hashtags and maintain credibility.",
        energetic: "Create an energetic tweet with excitement, trending topics, and viral potential. Use emojis and create engagement through bold statements."
      }
    };

    const lengthInstructions = `Create content that is exactly ${wordCount} words. Be precise with the word count - not shorter, not longer. This is a strict requirement.`;

    const domainContext = domain ? `
Domain Context: The user specializes in ${domain}. Tailor the content to this niche with relevant terminology and audience understanding.
` : '';

    const keywordsContext = trendingKeywords.length > 0 ? `
Trending Keywords: Naturally incorporate these trending keywords: ${trendingKeywords.join(', ')}.
` : '';

    const prompt = `
You are an expert content creator and social media strategist. Generate engaging content based on the following requirements:

TOPIC: ${topic}
PLATFORM: ${platform.toUpperCase()}
STYLE: ${style.toUpperCase()}
WORD COUNT: ${wordCount} words (EXACT - this is a strict requirement)

${domainContext}
${keywordsContext}

PLATFORM-SPECIFIC INSTRUCTIONS:
${platformInstructions[platform]?.[style] || platformInstructions.youtube.casual}

WORD COUNT REQUIREMENTS:
Create content that is EXACTLY ${wordCount} words. This is not a suggestion - it is a strict requirement. Count every word carefully. The final content must be precisely ${wordCount} words, no more and no less.

ADDITIONAL REQUIREMENTS:
- Make the content authentic and engaging
- Include relevant hashtags for social media platforms
- Add natural call-to-actions where appropriate
- Ensure the content is platform-optimized
- Use current trending topics and cultural references when relevant
- Make it shareable and engaging
- CRITICAL: The content must be EXACTLY ${wordCount} words - count them carefully before responding

Generate the content now and ensure it is exactly ${wordCount} words:
`;

    return prompt;
  }

  static formatScript(generatedText, platform, targetWordCount) {
    // Clean up and format the generated text
    let formatted = generatedText.trim();

    // Remove any markdown formatting
    formatted = formatted.replace(/\*\*/g, '');
    formatted = formatted.replace(/\*/g, '');

    // Remove excessive newlines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    // Count words
    const words = formatted.split(/\s+/).filter(word => word.length > 0);
    const currentWordCount = words.length;

    // Adjust word count if needed
    if (currentWordCount !== targetWordCount) {
      formatted = this.adjustWordCount(formatted, targetWordCount, currentWordCount);

      // Final verification - ensure exact word count
      const finalWords = formatted.split(/\s+/).filter(word => word.length > 0);
      const finalWordCount = finalWords.length;

      if (finalWordCount !== targetWordCount) {
        console.log(`Final adjustment: ${finalWordCount} -> ${targetWordCount} words`);
        // Force exact match by truncating or padding
        if (finalWordCount > targetWordCount) {
          formatted = finalWords.slice(0, targetWordCount).join(' ');
        } else {
          // Add single words to reach exact count
          const wordsNeeded = targetWordCount - finalWordCount;
          const fillerWords = ['very', 'really', 'truly', 'absolutely', 'completely', 'totally'];
          for (let i = 0; i < wordsNeeded; i++) {
            formatted += ' ' + fillerWords[i % fillerWords.length];
          }
        }
      }
    }

    // Platform-specific formatting
    switch (platform) {
      case 'instagram':
        // Ensure hashtags are properly formatted
        formatted = formatted.replace(/#(\w+)/g, '#$1');
        // Add line breaks for readability
        formatted = formatted.replace(/([.!?])\s+/g, '$1\n\n');
        break;

      case 'twitter':
        // Ensure it's under 280 characters
        if (formatted.length > 280) {
          formatted = formatted.substring(0, 277) + '...';
        }
        break;

      case 'youtube':
        // Add timestamps for longer scripts
        if (formatted.length > 500) {
          const sections = formatted.split('\n\n');
          formatted = sections.map((section, index) => {
            if (index === 0) return section;
            return `[${index * 30}:00] ${section}`;
          }).join('\n\n');
        }
        break;
    }

    return formatted;
  }

  static adjustWordCount(text, targetWordCount, currentWordCount) {
    const words = text.split(/\s+/).filter(word => word.length > 0);

    if (currentWordCount < targetWordCount) {
      // Need to add words - use more granular approach
      const wordsToAdd = targetWordCount - currentWordCount;
      let result = text;

      // Single words for precise control
      const singleWords = [
        'important', 'key', 'essential', 'crucial', 'vital', 'critical',
        'significant', 'major', 'valuable', 'helpful', 'useful', 'effective',
        'powerful', 'strong', 'impactful', 'meaningful', 'relevant', 'strategic',
        'smart', 'better', 'best', 'top', 'premium', 'quality', 'excellent',
        'amazing', 'awesome', 'great', 'fantastic', 'wonderful', 'perfect'
      ];

      // Short phrases for medium adjustments
      const shortPhrases = [
        'is very important', 'makes sense', 'works well', 'adds value',
        'is key here', 'really matters', 'helps a lot', 'is effective',
        'makes difference', 'is essential', 'is crucial', 'is vital'
      ];

      // Add words one by one for precise control
      for (let i = 0; i < wordsToAdd; i++) {
        if (i % 3 === 0 && i < wordsToAdd - 2) {
          // Use short phrase when we have room for 2+ words
          const phrase = shortPhrases[i % shortPhrases.length];
          if (result.endsWith('.')) {
            result += ' ' + phrase + '.';
          } else {
            result += '. ' + phrase + '.';
          }
          i += phrase.split(' ').length - 1; // Account for multiple words added
        } else {
          // Add single word
          const word = singleWords[i % singleWords.length];
          if (result.endsWith('.')) {
            result += ' ' + word + '.';
          } else {
            result += ' ' + word;
          }
        }
      }

      return result;

    } else if (currentWordCount > targetWordCount) {
      // Need to remove words - be more precise
      return words.slice(0, targetWordCount).join(' ');
    }

    return text;
  }

  static async generateMultipleScripts(data, count = 3) {
    try {
      const scripts = [];
      for (let i = 0; i < count; i++) {
        const script = await this.generateScript(data);
        scripts.push(script);
      }
      return scripts;
    } catch (error) {
      console.error('Error generating multiple scripts:', error);
      throw error;
    }
  }

  static async analyzeScript(script, platform) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = `
Analyze this ${platform} script for engagement potential and provide insights:

SCRIPT:
${script}

Provide analysis on:
1. Engagement potential (1-10 scale)
2. Viral potential (1-10 scale)
3. Strengths
4. Areas for improvement
5. Suggested hashtags
6. Best posting time
7. Target audience

Format as JSON response.
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      const analysis = result.candidates?.[0]?.content?.parts?.[0]?.text;

      return analysis;
    } catch (error) {
      console.error('Script analysis error:', error);
      return null;
    }
  }
  static async generateCustomAIContent(prompt) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key not configured');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
      });

      if (!response.ok) {
        throw new Error('AI Content generation failed');
      }

      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      console.error('Custom AI Content Error:', error);
      return null;
    }
  }
}
