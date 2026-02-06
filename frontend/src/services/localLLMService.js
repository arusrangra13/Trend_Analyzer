import axios from 'axios';

class LocalLLMService {
    constructor() {
        this.baseUrl = 'http://localhost:11434';
    }

    // Check if Ollama is running
    async checkConnection() {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`);
            return { connected: true, models: response.data.models };
        } catch (error) {
            console.error('Ollama connection check failed:', error);
            return { connected: false, error: error.message };
        }
    }

    // Generate text completion
    async generateCompletion(model, prompt, onChunk) {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    prompt: prompt,
                    stream: true
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                try {
                    // Ollama can send multiple JSON objects in one chunk
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        const json = JSON.parse(line);
                        if (json.response) {
                            fullText += json.response;
                            if (onChunk) onChunk(json.response);
                        }
                        if (json.done) return fullText;
                    }
                } catch (e) {
                    console.error('Error parsing JSON chunk', e);
                }
            }
            return fullText;

        } catch (error) {
            console.error('Ollama generation failed:', error);
            throw error;
        }
    }

    // Chat completion (for conversation history)
    async chatCompletion(model, messages, onChunk) {
        try {
            const response = await fetch(`${this.baseUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    stream: true
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                try {
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        const json = JSON.parse(line);
                        if (json.message?.content) {
                            fullText += json.message.content;
                            if (onChunk) onChunk(json.message.content);
                        }
                        if (json.done) return fullText;
                    }
                } catch (e) {
                    console.error('Error parsing JSON chunk', e);
                }
            }
            return fullText;

        } catch (error) {
            console.error('Ollama chat failed:', error);
            throw error;
        }
    }

    // Pull (download) a new model
    async pullModel(modelName, onProgress) {
        try {
            const response = await fetch(`${this.baseUrl}/api/pull`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: modelName,
                    stream: true
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                try {
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');
                    for (const line of lines) {
                        const json = JSON.parse(line);

                        if (json.error) {
                            throw new Error(json.error);
                        }

                        // Pass progress back to UI
                        if (onProgress) {
                            // json.total and json.completed roughly give bytes
                            if (json.total && json.completed) {
                                const percent = Math.round((json.completed / json.total) * 100);
                                onProgress({ status: json.status, percent: percent });
                            } else {
                                onProgress({ status: json.status });
                            }
                        }
                    }
                } catch (e) {
                    // Ignore JSON parse errors for incomplete chunks
                }
            }
            return { success: true };

        } catch (error) {
            console.error('Ollama pull failed:', error);
            throw error;
        }
    }
}

export default new LocalLLMService();
