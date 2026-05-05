const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic();

class MockAI {
    constructor() { this.history = []; }

    async getResponse(message) {
        this.history.push({ role: 'user', content: message });
        
        const msg = await anthropic.messages.create({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 500,
            messages: this.history
        });
        
        const response = msg.content[0].text;
        this.history.push({ role: 'assistant', content: response });
        return response;
    }
}
