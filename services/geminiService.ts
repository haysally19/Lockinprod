import { GoogleGenAI, Type, Chat } from "@google/genai";
import { ClassSubject, EssayFeedback, Flashcard, QuizQuestion } from "../types";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Gemini API key is missing. AI features will not work.');
  }
  return new GoogleGenAI({ apiKey });
};

// Map subjects to system instructions
const getSystemInstruction = (subject: ClassSubject, courseName: string): string => {
  return `You are an expert tutor for the class "${courseName}" which covers ${subject}. 
  Your goal is to help the student understand concepts, solve problems, and prepare for exams.
  
  **CRITICAL INSTRUCTIONS FOR ACCURACY:**
  1. **NEVER GUESS.** If a question is ambiguous or you do not have enough information to answer accurately, ask the student for clarification.
  2. **NO HALLUCINATIONS.** Do not invent facts, quotes, citations, or formulas. If you don't know the answer, admit it.
  3. **REASONING.** For complex problems, think step-by-step. Show your work clearly.
  4. **VERIFICATION.** Double-check your calculations and logic before outputting the final answer.
  
  **FORMATTING RULES:**
  1. Use Markdown for text formatting (bold key terms, use lists).
  2. **FOR MATH:** You MUST use LaTeX for all mathematical expressions. 
     - Use $...$ for inline math (e.g. $E=mc^2$).
     - Use $$...$$ for block math equations.
     - Example: "The solution is $x = 5$."
  3. If the subject is Computer Science, provide code snippets in relevant languages.
  `;
};

export const createChatSession = async (subject: ClassSubject, courseName: string): Promise<Chat> => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: getSystemInstruction(subject, courseName),
    },
  });
};

export const gradeEssay = async (essayText: string, topic: string): Promise<EssayFeedback> => {
  const ai = getClient();
  
  const prompt = `
    Please grade the following essay based on the topic: "${topic}".
    Provide a score out of 100, a brief summary, a list of strengths, a list of weaknesses, and a list of specific improvements.
    
    Essay Content:
    ${essayText}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Score out of 100" },
          summary: { type: Type.STRING, description: "Brief summary of feedback" },
          strengths: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of strong points"
          },
          weaknesses: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of weak points"
          },
          improvements: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Actionable improvements"
          },
        },
        required: ["score", "summary", "strengths", "weaknesses", "improvements"],
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text.trim()) as EssayFeedback;
};

export const enhanceNote = async (content: string, action: 'summarize' | 'cleanup' | 'continue'): Promise<string> => {
  const ai = getClient();
  let prompt = "";
  switch(action) {
    case 'summarize': 
      prompt = `You are an expert academic tutor. Analyze the following class notes and create a comprehensive, structured summary.
      
      Guidelines:
      1. Start with a clear Title.
      2. Use Markdown headers (##) to separate key topics.
      3. Use bullet points for details.
      4. Bold **key terms** and definitions.
      5. Highlight important dates or formulas if present.
      6. Output ONLY the summary.
      
      Notes to summarize:`; 
      break;
    case 'cleanup': 
      prompt = `Reformat and organize the following rough class notes into a clean, professional Markdown document.
      
      Guidelines:
      1. Fix structure, indentation, and basic grammar/spelling errors.
      2. Group related ideas under clear headings.
      3. Convert loose sentences into bullet points where appropriate.
      4. Maintain ALL original information, just improve the presentation.
      
      Notes to cleanup:`; 
      break;
    case 'continue': 
      prompt = "Continue writing these notes logically, adding relevant information, concepts, and examples based on the context. Keep the tone consistent:"; 
      break;
  }
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${prompt}\n\n${content}`,
  });
  return response.text || content;
};

export const generateStudyGuide = async (content: string): Promise<string> => {
    const ai = getClient();
    const prompt = `Based on the following notes, generate a study guide. The study guide should include:
1.  A list of **Key Concepts** with brief definitions.
2.  A list of 3-5 potential **Quiz Questions** with answers.
3.  A final, concise **Summary** of the entire note.

Format the entire response using Markdown. Use headings, bold text, and bullet points.

Notes:
---
${content}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
    });
    return response.text || "Could not generate a study guide from these notes.";
};


export const getAssignmentTips = async (title: string, dueDate: string, subject: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `I have an assignment for ${subject} called "${title}" due on ${dueDate}. 
    Give me a 3-step actionable plan to finish this on time. Keep it brief, motivating, and formatted with Markdown bullets.`,
  });
  return response.text || "Just start working!";
};

// --- New Premium Features ---

export const generateFlashcards = async (context: string, count: number = 5): Promise<Flashcard[]> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate ${count} study flashcards based on the following notes/context. 
    Make the front of the card a clear question or term, and the back a concise definition or answer.
    
    Context:
    ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            front: { type: Type.STRING, description: "The term or question on the front of the card" },
            back: { type: Type.STRING, description: "The definition or answer on the back" }
          },
          required: ["front", "back"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];
  
  const cards = JSON.parse(text.trim()) as Flashcard[];
  // Ensure unique IDs
  return cards.map((c, i) => ({ ...c, id: Date.now().toString() + i }));
};

export const generateQuiz = async (context: string, count: number = 5): Promise<QuizQuestion[]> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a multiple-choice quiz with ${count} questions based on the following material.
    Provide 4 options for each question.
    
    Material:
    ${context}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.NUMBER, description: "0-based index of the correct answer" },
            explanation: { type: Type.STRING, description: "Explanation of why the answer is correct" }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  const text = response.text;
  if (!text) return [];

  const questions = JSON.parse(text.trim()) as QuizQuestion[];
  return questions.map((q, i) => ({ ...q, id: Date.now().toString() + i }));
};

// --- Vision / Camera Solver Feature ---

export const solveWithVision = async (base64Image: string, mode: 'nerd' | 'bro' = 'nerd'): Promise<string> => {
  const ai = getClient();

  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const comprehensivePrompt = mode === 'bro' ? `
You are an expert tutor helping a student understand their homework. Analyze this image carefully.

**YOUR TASK:**
1. **Identify** what type of problem or question this is (math, science, history, language, etc.)
2. **Extract** all text, equations, diagrams, or relevant information from the image
3. **Solve** the problem with a complete, step-by-step explanation
4. **Provide** the final answer clearly

**FORMATTING RULES:**
- Use Markdown for all formatting
- For math expressions, use LaTeX: $x = 5$ for inline, $$x = 5$$ for block equations
- Use **bold** for important steps
- Number your steps clearly
- Keep language simple and friendly - explain like you're talking to a friend
- Use relatable examples when helpful

**STRUCTURE:**
1. Start by stating what the problem is asking
2. Show each step of your work
3. Explain WHY you're doing each step
4. End with a clear final answer

Be thorough but conversational. Make sure the student really understands!
` : `
You are an elite academic tutor and problem solver. Analyze this image with precision.

**YOUR TASK:**
1. **Identify** the subject area and problem type (mathematics, physics, chemistry, biology, history, literature, computer science, etc.)
2. **Extract** all relevant information: text, equations, diagrams, graphs, chemical structures, etc.
3. **Solve** with rigorous step-by-step methodology
4. **Verify** your answer and show your verification

**FORMATTING REQUIREMENTS:**
- Use Markdown for structure and emphasis
- Mathematical notation MUST use LaTeX:
  - Inline: $E = mc^2$
  - Block: $$\\int_a^b f(x)dx$$
- Use proper scientific notation and units
- Bold key concepts and important results
- Number all steps systematically

**RESPONSE STRUCTURE:**
## Problem Identification
[State what is being asked]

## Given Information
[List all provided data, equations, constraints]

## Solution Strategy
[Outline your approach]

## Step-by-Step Solution
[Detailed work with explanations]

## Final Answer
[Clear, boxed or highlighted result with units]

## Verification
[Optional: Check your work]

Be comprehensive, accurate, and pedagogically sound. Show professional-grade problem solving.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: [
        {
          role: 'user',
          parts: [
            { text: comprehensivePrompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: cleanBase64
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.2,
        topP: 0.95,
        topK: 40,
      }
    });

    const result = response.text;
    if (!result || result.trim().length === 0) {
      throw new Error("Empty response from AI");
    }

    return result;
  } catch (error) {
    console.error("Vision API Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
    throw new Error("Failed to process image. Please try again with a clearer photo.");
  }
};

export const generateSimilarProblems = async (problemContext: string, count: number = 5): Promise<string> => {
  const ai = getClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Based on the following problem and solution, generate ${count} similar practice problems. Make them progressively slightly harder. Format each as a numbered list. Only provide the problems, not the solutions.

Problem Context:
${problemContext}`,
    });

    return response.text || "Could not generate practice problems.";
  } catch (error) {
    console.error("Generate problems error:", error);
    throw new Error("Failed to generate practice problems.");
  }
};