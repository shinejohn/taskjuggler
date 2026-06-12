import api from '@/utils/api'

export interface McpApiKey {
  id: number
  name: string
  created_at: string
  last_used_at?: string
}

export interface CreateMcpKeyRequest {
  name: string
}

export interface CreateMcpKeyResponse {
  id: number
  name: string
  api_key: string // Only returned on creation
}

export const mcpApi = {
  listKeys: () => api.get<{ data: McpApiKey[] }>('/scanner/mcp/keys'),
  createKey: (data: CreateMcpKeyRequest) => api.post<{ data: CreateMcpKeyResponse }>('/scanner/mcp/keys', data),
  revokeKey: (keyId: number) => api.delete(`/scanner/mcp/keys/${keyId}`),
}

