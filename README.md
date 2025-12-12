<div align="center">
  <img width="1200" height="475" alt="Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Sanad — Absher AI Assistant

Sanad is an intelligent assistant designed to understand Arabic user queries related to Absher services and classify them into correct intents using **local AI models** (no external API keys required).

The project uses:
- **@xenova/transformers** for local semantic embeddings  
- **Custom KNN + cosine similarity** for intent classification  
- **Static knowledge base** for fallback answers  
- Fully offline intent detection (no LLM / no internet required)

---

## 🚀 Run Locally

### **Prerequisites:**  
- Node.js 18+

### **Steps:**

1. Install dependencies:

```bash
npm install
