import api from '@/utils/api';

export const aiService = {
    /**
     * Execute a specific AI tool action
     * @param tool Tool name (e.g. 'task', 'project')
     * @param action Action name (e.g. 'create', 'list')
     * @param params Additional parameters for the action
     */
    executeTool: async (tool: string, action: string, params: any = {}) => {
        try {
            const response = await api.post(`/ai/v1/tools/${tool}`, {
                action,
                ...params
            });
            return response.data?.result;
        } catch (error) {
            console.error(`AI Tool Execution Failed: ${tool}/${action}`, error);
            throw error;
        }
    },

    /**
     * Create a task using AI infrastructure
     */
    createTask: async (title: string, description?: string, params: any = {}) => {
        return aiService.executeTool('task', 'create', {
            title,
            description,
            ...params
        });
    },

    /**
     * List projects using AI infrastructure
     */
    listProjects: async (params: any = {}) => {
        return aiService.executeTool('project', 'list', params);
    },

    /**
     * Get team workload using AI infrastructure
     */
    getTeamWorkload: async (teamId: string) => {
        return aiService.executeTool('team', 'workload', { id: teamId });
    }
};
