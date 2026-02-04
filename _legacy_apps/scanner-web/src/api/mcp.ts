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
  listKeys: () => api.get<{ data: McpApiKey[] }>('/api/scanner/mcp/keys'),
  createKey: (data: CreateMcpKeyRequest) => api.post<{ data: CreateMcpKeyResponse }>('/api/scanner/mcp/keys', data),
  revokeKey: (keyId: number) => api.delete(`/api/scanner/mcp/keys/${keyId}`),
}

