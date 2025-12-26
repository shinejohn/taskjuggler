import { test, expect } from '@playwright/test';

/**
 * Comprehensive Platform Test Suite
 * 
 * Tests all major functionality across the entire platform
 */

test.describe('TaskJuggler Platform - Comprehensive Tests', () => {
  let authToken: string;
  let userId: string;

  test.beforeAll(async ({ request }) => {
    // Register test user
    const registerResponse = await request.post('/api/auth/register', {
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        password_confirmation: 'password123',
      },
    });

    expect(registerResponse.ok()).toBeTruthy();
    const registerData = await registerResponse.json();
    authToken = registerData.token;
    userId = registerData.user.id;
  });

  test.describe('Authentication Flow', () => {
    test('should register new user', async ({ request }) => {
      const response = await request.post('/api/auth/register', {
        data: {
          name: 'New User',
          email: `newuser-${Date.now()}@example.com`,
          password: 'password123',
          password_confirmation: 'password123',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.token).toBeDefined();
    });

    test('should login existing user', async ({ request }) => {
      const email = `login-${Date.now()}@example.com`;
      
      // Register first
      await request.post('/api/auth/register', {
        data: {
          name: 'Login User',
          email,
          password: 'password123',
          password_confirmation: 'password123',
        },
      });

      // Then login
      const response = await request.post('/api/auth/login', {
        data: {
          email,
          password: 'password123',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.token).toBeDefined();
    });

    test('should get current user', async ({ request }) => {
      const response = await request.get('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBe(userId);
    });
  });

  test.describe('Task Management', () => {
    let taskId: string;

    test('should create task', async ({ request }) => {
      const response = await request.post('/api/tasks', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          title: 'Test Task',
          description: 'Test Description',
          priority: 'high',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBeDefined();
      expect(data.title).toBe('Test Task');
      taskId = data.id;
    });

    test('should list tasks', async ({ request }) => {
      const response = await request.get('/api/tasks', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(Array.isArray(data.data)).toBeTruthy();
    });

    test('should get task details', async ({ request }) => {
      const response = await request.get(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBe(taskId);
    });

    test('should update task', async ({ request }) => {
      const response = await request.put(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          title: 'Updated Task',
          description: 'Updated Description',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.title).toBe('Updated Task');
    });

    test('should complete task', async ({ request }) => {
      const response = await request.post(`/api/tasks/${taskId}/complete`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('TEF 2.0.0 API', () => {
    let actorId: string;
    let relationshipId: string;

    test('should register actor', async ({ request }) => {
      const response = await request.post('/api/tef/v1/actors', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          actor_type: 'HUMAN',
          display_name: 'Test Actor',
          capabilities: ['task_creation', 'task_assignment'],
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBeDefined();
      actorId = data.id;
    });

    test('should get actor', async ({ request }) => {
      const response = await request.get(`/api/tef/v1/actors/${actorId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBe(actorId);
    });

    test('should create relationship', async ({ request }) => {
      // Create second actor
      const actor2Response = await request.post('/api/tef/v1/actors', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          actor_type: 'HUMAN',
          display_name: 'Actor 2',
        },
      });
      const actor2 = await actor2Response.json();

      const response = await request.post('/api/tef/v1/relationships', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          actor_b_id: actor2.id,
          relationship_type: 'PEER',
          permissions: ['read', 'write'],
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBeDefined();
      relationshipId = data.id;
    });

    test('should get trust score', async ({ request }) => {
      const response = await request.get(`/api/tef/v1/relationships/${relationshipId}/trust-score`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.trust_score).toBeDefined();
      expect(typeof data.trust_score).toBe('number');
    });
  });

  test.describe('IoT Device API', () => {
    let deviceId: string;

    test('should register IoT device', async ({ request }) => {
      const response = await request.post('/api/iot/devices/register', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          device_name: 'Test Sensor',
          device_type: 'sensor',
          capabilities: ['temperature', 'humidity'],
          mqtt_topic: 'device/test/001',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBeDefined();
      deviceId = data.id;
    });

    test('should list devices', async ({ request }) => {
      const response = await request.get('/api/iot/devices', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(Array.isArray(data.data)).toBeTruthy();
    });

    test('should generate claim code', async ({ request }) => {
      const response = await request.post(`/api/iot/devices/${deviceId}/claim-code`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.claim_code).toBeDefined();
    });
  });

  test.describe('AI Agent API', () => {
    let agentId: string;

    test('should register AI agent', async ({ request }) => {
      const response = await request.post('/api/ai/agents/register', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          agent_name: 'Test AI Agent',
          agent_type: 'assistant',
          capabilities: ['task_creation', 'task_completion'],
          mcp_endpoint: 'http://localhost:8000/mcp',
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.id).toBeDefined();
      agentId = data.id;
    });

    test('should list agents', async ({ request }) => {
      const response = await request.get('/api/ai/agents', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(Array.isArray(data.data)).toBeTruthy();
    });
  });

  test.describe('Performance API', () => {
    test('should get cache stats', async ({ request }) => {
      const response = await request.get('/api/performance/cache/stats', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.cache_stats).toBeDefined();
    });

    test('should warm up cache', async ({ request }) => {
      const response = await request.post('/api/performance/cache/warm-up', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.ok()).toBeTruthy();
    });
  });
});
