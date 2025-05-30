
import { toast } from "@/hooks/use-toast";


const getOpenRouterProxyUrl = () => {  

  return "https://tikdkicchnfbztyuuhso.supabase.co/functions/v1/openrouter-proxy";
};


export const callOpenRouterProxy = async (body: any): Promise<any> => {
  try {
    const proxyUrl = getOpenRouterProxyUrl();
    
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      console.error("OpenRouter Proxy Error:", response.status, response.statusText);
      const errorData = await response.json();
      console.error("Error Data:", errorData);
      throw new Error(`OpenRouter Proxy error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("Error calling OpenRouter Proxy:", error);
    toast({
      title: "AI Error",
      description: `Could not process your request. ${error.message || error}`,
      variant: "destructive",
    });
    throw error;
  }
};


export const callOpenRouter = async (messages: any[]): Promise<string> => {
  try {
    const data = await callOpenRouterProxy({
      model: "mistralai/mistral-medium",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No choices returned from OpenRouter API");
    }
    
    const messageContent = data.choices[0].message.content;
    
    if (!messageContent) {
      throw new Error("No content returned from OpenRouter API");
    }
    
    return messageContent.trim();
  } catch (error: any) {
    console.error("Error calling OpenRouter API:", error);
    toast({
      title: "AI Error",
      description: `Could not process your request. ${error.message || error}`,
      variant: "destructive",
    });
    throw error;
  }
};


const promptToMessages = (prompt: string): any[] => {
  return [{ role: "user", content: prompt }];
};


export const generateTaskTitle = async (description: string): Promise<string> => {
  try {
    return await callOpenRouter(promptToMessages(`Generate a concise title based on: ${description}`));
  } catch (error) {
    console.error("Error generating task title:", error);
    throw error;
  }
};


export const summarizeTaskDescription = async (description: string): Promise<string> => {
  try {
    return await callOpenRouter(promptToMessages(`Summarize the following task: ${description}`));
  } catch (error) {
    console.error("Error summarizing task description:", error);
    throw error;
  }
};


export const suggestTaskMetadata = async (taskInfo: string): Promise<any> => {
  try {
    return await callOpenRouter(promptToMessages(`Suggest metadata for: ${taskInfo}`));
  } catch (error) {
    console.error("Error suggesting task metadata:", error);
    throw error;
  }
};


export const generateSubtasks = async (description: string): Promise<string[]> => {
  try {
    const response = await callOpenRouter(promptToMessages(`Generate subtasks for: ${description}`));
    return response.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error("Error generating subtasks:", error);
    throw error;
  }
};


export const explainDependency = async (taskId: string, dependencyId: string): Promise<string> => {
  try {
    return await callOpenRouter(promptToMessages(`Explain why task ${taskId} depends on ${dependencyId}`));
  } catch (error) {
    console.error("Error explaining dependency:", error);
    throw error;
  }
};


export const summarizeBoard = async (): Promise<string> => {
  try {
    return await callOpenRouter(promptToMessages("Summarize the current board state"));
  } catch (error) {
    console.error("Error summarizing board:", error);
    throw error;
  }
};


export const listBlockedTasks = async (): Promise<string[]> => {
  try {
    const response = await callOpenRouter(promptToMessages("List all blocked tasks"));
    return response.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error("Error listing blocked tasks:", error);
    throw error;
  }
};


export const listOverdueTasks = async (): Promise<string[]> => {
  try {
    const response = await callOpenRouter(promptToMessages("List all overdue tasks"));
    return response.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error("Error listing overdue tasks:", error);
    throw error;
  }
};


export const suggestPriorities = async (): Promise<string[]> => {
  try {
    const response = await callOpenRouter(promptToMessages("Suggest task priorities"));
    return response.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error("Error suggesting priorities:", error);
    throw error;
  }
};


export const safeJsonParse = (text: string): any => {
  try {

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : text;
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    

    return {
      columns: ["Backlog", "In Progress", "Done"],
      tasks: [
        {
          title: "Sample task",
          column: "Backlog",
          priority: "medium",
          description: "This is a sample task"
        }
      ]
    };
  }
};


export const generateTeamTemplate = async (teamType: string): Promise<any> => {
  try {
    const promptMessage = `Generate a Kanban board template for a a '${teamType}' project. Include labels, assignees if relevant, and 1-2 subtasks per task. team. Include suggested columns and 3-5 sample tasks with priorities. Format as JSON: {"columns": ["...", "..."], "sampleTasks": [{"title": "...", "column": "...", "priority": "..."}]}`;
    
    const response = await callOpenRouter(promptToMessages(promptMessage));
    

    const template = safeJsonParse(response);
    

    return {
      columns: template.columns || ["Backlog", "In Progress", "Done"],
      tasks: (template.sampleTasks || template.tasks || []).map((task: any) => ({
        title: task.title || "Sample task",
        description: task.description || "",
        priority: task.priority?.toLowerCase() || "medium",
        column: task.column || template.columns?.[0] || "Backlog",
        subtasks: task.subtasks || [],
        assignees: task.assignees || [],
        labels: task.labels || []
      }))
    };
  } catch (error) {
    console.error("Error generating team template:", error);
    

    return {
      columns: ["Backlog", "In Progress", "Done"],
      tasks: [
        {
          title: "Getting started",
          description: "Initial task to get the project started",
          priority: "high",
          column: "Backlog",
          subtasks: [
            { title: "Define project scope" },
            { title: "Set up initial resources" }
          ]
        }
      ]
    };
  }
};


export const parseNaturalLanguageAutomation = async (description: string): Promise<string> => {
  try {
    return await callOpenRouter(promptToMessages(`Parse this natural language request into a structured automation format: ${description}`));
  } catch (error) {
    console.error("Error parsing natural language automation:", error);
    throw error;
  }
};


export const testOpenRouterIntegration = async (): Promise<string> => {
  try {
    return await callOpenRouter(promptToMessages("Suggest 3 subtasks for 'Build login flow'"));
  } catch (error) {
    console.error("OpenRouter test failed:", error);
    return "OpenRouter integration test failed. Check console for details.";
  }
};
