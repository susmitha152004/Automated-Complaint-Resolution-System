import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini API client on the server side
const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface ComplaintAnalysisResult {
  category: 'Water Supply' | 'Electricity' | 'Roads' | 'Garbage' | 'Street Lights' | 'Internet' | 'Education' | 'Health' | 'Pollution' | 'Public Transport' | 'Others';
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  summary: string;
  automatedResponse: string;
  suggestedDepartment: string;
  estimatedResolutionTime: string;
  possibleSolution: string;
  confidenceScore: number;
}

export async function analyzeComplaintWithGemini(
  title: string,
  description: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<ComplaintAnalysisResult> {
  const defaultFallback: ComplaintAnalysisResult = {
    category: determineCategoryFallback(title, description),
    priority: determinePriorityFallback(title, description),
    summary: `${title.trim()}: ${description.slice(0, 100)}...`,
    automatedResponse: `We have received your complaint regarding "${title}". It has been logged and assigned for review. We expect to take action within 24-48 hours.`,
    suggestedDepartment: determineDepartmentFallback(title, description),
    estimatedResolutionTime: '24-48 Hours',
    possibleSolution: 'Our field inspection team will investigate the location and dispatch appropriate maintenance resources.',
    confidenceScore: 0.85,
  };

  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. Using rule-based complaint classifier fallback.');
    return defaultFallback;
  }

  try {
    const promptText = `
You are an expert AI Civil & Municipal Complaint Resolution System.
Analyze the following citizen complaint carefully.

Complaint Title: "${title}"
Complaint Details: "${description}"

Categories available:
1. Water Supply
2. Electricity
3. Roads
4. Garbage
5. Street Lights
6. Internet
7. Education
8. Health
9. Pollution
10. Public Transport
11. Others

Priorities available:
- Low (non-urgent cosmetic issues or general inquiries)
- Medium (moderate inconvenience, minor service disruption)
- High (major service outage, structural issue, public hazard)
- Emergency (immediate safety danger, severe flood, exposed high-voltage wires, life safety risk)

Please perform the following tasks:
1. Select the exact Category from the 11 categories provided above.
2. Determine the Priority level (Low, Medium, High, Emergency).
3. Provide a concise 1-2 sentence Summary of the issue.
4. Write a professional, empathetic Automated Response acknowledging receipt, explaining immediate next steps, and assuring the citizen that action is being taken.
5. Identify the exact Suggested Department (e.g., "Water Supply & Sewage Department", "Electricity Board", "Road Works & Maintenance", "Municipal Solid Waste Dept", etc.).
6. Give a realistic Estimated Resolution Time (e.g., "12 Hours", "24 Hours", "48 Hours", "3-5 Days").
7. Provide a practical Possible Solution or immediate workaround instructions for the citizen/department.
8. Rate your AI confidence score between 0.80 and 0.99.
`;

    const contentsArray: any[] = [];

    if (imageBase64 && imageMimeType) {
      // Clean base64 string if data URL prefix exists
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contentsArray.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    contentsArray.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contentsArray,
      config: {
        systemInstruction:
          'You are an official municipal citizen grievance classifier. Return strict JSON matching the provided schema. Be objective, accurate, empathetic, and professional.',
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: 'Exact category from the allowed 11 options',
            },
            priority: {
              type: Type.STRING,
              description: 'Low, Medium, High, or Emergency',
            },
            summary: {
              type: Type.STRING,
              description: 'Short 1-2 sentence summary',
            },
            automatedResponse: {
              type: Type.STRING,
              description: 'Empathetic automated acknowledgment message',
            },
            suggestedDepartment: {
              type: Type.STRING,
              description: 'Official department responsible',
            },
            estimatedResolutionTime: {
              type: Type.STRING,
              description: 'Expected resolution timeframe',
            },
            possibleSolution: {
              type: Type.STRING,
              description: 'Recommended initial resolution action or advice',
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: 'Confidence between 0.8 and 1.0',
            },
          },
          required: [
            'category',
            'priority',
            'summary',
            'automatedResponse',
            'suggestedDepartment',
            'estimatedResolutionTime',
            'possibleSolution',
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      return defaultFallback;
    }

    const parsed = JSON.parse(textOutput.trim());

    // Sanitize category
    const validCategories = [
      'Water Supply',
      'Electricity',
      'Roads',
      'Garbage',
      'Street Lights',
      'Internet',
      'Education',
      'Health',
      'Pollution',
      'Public Transport',
      'Others',
    ];

    const category = validCategories.includes(parsed.category)
      ? parsed.category
      : defaultFallback.category;

    // Sanitize priority
    const validPriorities = ['Low', 'Medium', 'High', 'Emergency'];
    const priority = validPriorities.includes(parsed.priority)
      ? parsed.priority
      : defaultFallback.priority;

    return {
      category,
      priority,
      summary: parsed.summary || defaultFallback.summary,
      automatedResponse: parsed.automatedResponse || defaultFallback.automatedResponse,
      suggestedDepartment: parsed.suggestedDepartment || defaultFallback.suggestedDepartment,
      estimatedResolutionTime: parsed.estimatedResolutionTime || defaultFallback.estimatedResolutionTime,
      possibleSolution: parsed.possibleSolution || defaultFallback.possibleSolution,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.92,
    };
  } catch (error) {
    console.error('Error calling Gemini API for complaint analysis:', error);
    return defaultFallback;
  }
}

// Fallback rule-based helper functions
function determineCategoryFallback(title: string, desc: string): ComplaintAnalysisResult['category'] {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('water') || text.includes('pipe') || text.includes('leak') || text.includes('tap') || text.includes('drain')) return 'Water Supply';
  if (text.includes('electri') || text.includes('power') || text.includes('wire') || text.includes('transformer') || text.includes('outage') || text.includes('voltage')) return 'Electricity';
  if (text.includes('pothole') || text.includes('road') || text.includes('tar') || text.includes('asphalt') || text.includes('highway') || text.includes('crack')) return 'Roads';
  if (text.includes('garbage') || text.includes('trash') || text.includes('waste') || text.includes('dump') || text.includes('clean')) return 'Garbage';
  if (text.includes('street light') || text.includes('lamp') || text.includes('dark street') || text.includes('light pole')) return 'Street Lights';
  if (text.includes('internet') || text.includes('fiber') || text.includes('broadband') || text.includes('wifi') || text.includes('network')) return 'Internet';
  if (text.includes('school') || text.includes('education') || text.includes('teacher') || text.includes('college')) return 'Education';
  if (text.includes('hospital') || text.includes('health') || text.includes('clinic') || text.includes('sanitation') || text.includes('dengue')) return 'Health';
  if (text.includes('smoke') || text.includes('pollut') || text.includes('noise') || text.includes('factory') || text.includes('toxic')) return 'Pollution';
  if (text.includes('bus') || text.includes('metro') || text.includes('train') || text.includes('transport') || text.includes('traffic')) return 'Public Transport';
  return 'Others';
}

function determinePriorityFallback(title: string, desc: string): ComplaintAnalysisResult['priority'] {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('emergency') || text.includes('danger') || text.includes('fire') || text.includes('spark') || text.includes('fatal') || text.includes('life') || text.includes('burst')) return 'Emergency';
  if (text.includes('no water') || text.includes('power cut') || text.includes('days') || text.includes('major') || text.includes('blocking')) return 'High';
  if (text.includes('delay') || text.includes('broken') || text.includes('overflow') || text.includes('dim')) return 'Medium';
  return 'Low';
}

function determineDepartmentFallback(title: string, desc: string): string {
  const cat = determineCategoryFallback(title, desc);
  switch (cat) {
    case 'Water Supply': return 'Water Supply & Sewerage Board';
    case 'Electricity': return 'State Electricity Distribution Co.';
    case 'Roads': return 'Public Works Department (PWD)';
    case 'Garbage': return 'Municipal Solid Waste Management';
    case 'Street Lights': return 'Electrical Infrastructure & Lighting';
    case 'Internet': return 'Telecommunications Authority';
    case 'Education': return 'Department of Public Education';
    case 'Health': return 'Public Health & Sanitation Dept';
    case 'Pollution': return 'Environmental Pollution Control Board';
    case 'Public Transport': return 'Metropolitan Transport Corporation';
    default: return 'General Public Grievance Cell';
  }
}
