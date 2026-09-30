![Sanad](public/sanad.png)

# Sanad — Absher AI Assistant Prototype

> A finalist project in the Absher Tuwaiq Hackathon, AI & Predictive Security Track.

Sanad (سَنَد) is an Arabic AI assistant prototype designed to simplify access to government-service information through natural-language conversations. The project demonstrates how users could ask about common Absher-related services, receive proactive reminders, review important account items, and interact with simulated service workflows from one conversational interface.

> **Important:** Sanad is an independent educational prototype. It is not an official Absher product, is not affiliated with the Ministry of Interior, and is not connected to live government systems.

## Achievement

- Selected as a finalist in the **Absher Tuwaiq Hackathon**.
- Developed under the **AI & Predictive Security** track.
- Built collaboratively as a working MVP for the final demonstration.

## Key Features

- Arabic natural-language intent detection.
- Hybrid classification using keyword matching and semantic similarity.
- Multilingual sentence embeddings powered by MiniLM.
- Context-aware Arabic responses for common service questions.
- A “Check All” experience that summarizes simulated user items.
- Proactive reminders and service guidance.
- Interactive mock widgets, including fines summaries and payment-success states.
- Optional Gemini integration for more flexible conversational responses and tool calling.
- Browser-side inference after the model has been downloaded and cached.

## How It Works

1. The assistant first checks for strong keyword and phrase matches.
2. If needed, the user message is converted into a semantic embedding.
3. The embedding is compared with predefined Arabic intent examples using cosine similarity.
4. The closest intent is accepted when its similarity score passes the configured threshold of **0.38**.
5. Sanad returns the relevant response or renders a simulated service widget.
6. When no reliable match is found, the assistant falls back to general guidance.

This hybrid approach combines fast rule-based matching with semantic understanding, making the MVP practical for Arabic service requests while keeping inference lightweight.

## AI Components

- **Model:** Xenova/paraphrase-multilingual-MiniLM-L12-v2
- **Task:** Arabic intent classification and semantic matching
- **Embedding runtime:** Transformers.js / @xenova/transformers
- **Similarity method:** Cosine similarity
- **Decision threshold:** 0.38
- **Fallback knowledge:** Curated Arabic FAQs and intent examples
- **Optional generative layer:** Gemini 2.5 Flash with function declarations

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Transformers.js
- Multilingual MiniLM embeddings
- Gemini API (optional prototype integration)

## Project Structure

```text
sanad-absher-ai-assistant/
├── components/            # Reusable interface components
├── data/                  # Intent examples and local knowledge
├── services/
│   ├── localAIService.ts  # Local semantic intent-classification pipeline
│   └── geminiService.ts   # Optional Gemini integration
├── public/                # Logos and static assets
├── App.tsx                # Main application experience
└── vite.config.ts         # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

```bash
git clone https://github.com/Mhdi57/sanad-absher-ai-assistant.git
cd sanad-absher-ai-assistant
npm install
npm run dev
```

Then open the local URL displayed by Vite.

### Optional Gemini Configuration

The local semantic-classification flow does not require a Gemini key. To experiment with the optional Gemini service during local development, create a `.env.local` file:

```env
VITE_GEMINI_API_KEY=your_development_key
```

Do not commit API keys. Variables prefixed with `VITE_` are exposed to client-side code, so a production deployment must place AI-provider credentials behind a secure backend.

## Offline Behavior

The local AI pipeline runs in the browser. The model must be downloaded from its hosting provider on the first load, which requires an internet connection. After the browser caches the model, later inference can run locally without sending the user's message to an external AI service.

## My Contribution

I contributed collaboratively across the project lifecycle, including:

- Shaping the concept and user experience for the hackathon challenge.
- Designing Arabic intents, example phrases, responses, and service flows.
- Developing and refining the hybrid keyword and semantic-classification approach.
- Integrating embeddings, cosine-similarity matching, and confidence handling.
- Building interface components and simulated service widgets.
- Supporting integration, testing, debugging, and final-demo preparation.

## Security and Privacy

- The repository does not require real Absher credentials.
- All user records, payments, fines, and service actions shown in the prototype are simulated.
- The application is not connected to official Absher APIs or production databases.
- Real deployment would require secure authentication, authorization, encrypted backend services, audit logging, and formal approval from the relevant authorities.

## Current Limitations

- Intent coverage is limited to the curated prototype dataset.
- Service results and transactions are mock responses.
- Semantic accuracy has not yet been evaluated on a large labeled benchmark.
- The optional Gemini integration is client-side and intended only for development demonstrations.
- Initial local-model loading depends on network access and browser storage.

## Future Improvements

- Add a secure backend and secrets management.
- Integrate authorized government APIs where formally permitted.
- Expand and evaluate the Arabic intent dataset.
- Add voice input and accessible speech responses.
- Introduce authentication, observability, and audit trails.
- Build automated testing and an MLOps evaluation pipeline.
- Package the application for reliable cloud deployment.

## Disclaimer

This repository is an independent hackathon and educational prototype created to demonstrate an AI-assisted government-services experience. It is not an official Absher service and does not represent, access, or operate any Ministry of Interior system.
