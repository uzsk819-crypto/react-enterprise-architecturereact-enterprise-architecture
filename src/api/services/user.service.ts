import { http } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { User } from '../../types/auth.types';
import type { PaginationParams } from '../../types/common.types';
import type { PaginatedResponse } from '../../types/api.types';

interface RemoteApiUser {
  id: number | string;
  name?: string;
  email?: string;
  company?: { name?: string };
}

// Fallback seed data in case API endpoint is demo/offline
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.io',
    role: 'admin',
    permissions: ['users:read', 'users:write', 'users:delete', 'settings:read', 'settings:write', 'reports:read'],
    status: 'active',
    department: 'Cybersecurity',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@enterprise.com',
    role: 'manager',
    permissions: ['users:read', 'users:write', 'settings:read'],
    status: 'active',
    department: 'Engineering',
    createdAt: '2024-02-14T11:20:00Z',
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily.watson@enterprise.com',
    role: 'user',
    permissions: ['users:read', 'reports:read'],
    status: 'inactive',
    department: 'Marketing',
    createdAt: '2024-03-01T09:15:00Z',
  },
  {
    id: '4',
    name: 'Michael Scott',
    email: 'm.scott@dunder.com',
    role: 'manager',
    permissions: ['users:read', 'settings:read'],
    status: 'active',
    department: 'Regional Management',
    createdAt: '2024-03-12T14:45:00Z',
  },
  {
    id: '5',
    name: 'Dwight Schrute',
    email: 'd.schrute@dunder.com',
    role: 'admin',
    permissions: ['users:read', 'users:write', 'users:delete', 'settings:read', 'settings:write'],
    status: 'active',
    department: 'Security & Operations',
    createdAt: '2024-03-15T08:30:00Z',
  },
  {
    id: '6',
    name: 'Pam Beesly',
    email: 'p.beesly@dunder.com',
    role: 'user',
    permissions: ['users:read'],
    status: 'active',
    department: 'Administration',
    createdAt: '2024-04-02T13:10:00Z',
  },
  {
    id: '7',
    name: 'Jim Halpert',
    email: 'j.halpert@dunder.com',
    role: 'manager',
    permissions: ['users:read', 'users:write'],
    status: 'active',
    department: 'Sales',
    createdAt: '2024-04-18T16:00:00Z',
  },
  {
    id: '8',
    name: 'Ryan Howard',
    email: 'r.howard@wupfh.com',
    role: 'guest',
    permissions: [],
    status: 'pending',
    department: 'Product',
    createdAt: '2024-05-01T12:00:00Z',
  },
  {
    id: '9',
    name: 'Angela Martin',
    email: 'a.martin@dunder.com',
    role: 'admin',
    permissions: ['users:read', 'users:write', 'reports:read', 'settings:read'],
    status: 'active',
    department: 'Accounting',
    createdAt: '2024-05-10T09:00:00Z',
  },
  {
    id: '10',
    name: 'Kevin Malone',
    email: 'k.malone@dunder.com',
    role: 'user',
    permissions: ['reports:read'],
    status: 'inactive',
    department: 'Accounting',
    createdAt: '2024-06-01T15:20:00Z',
  },
];

export const userService = {
  getUsers: async (
    params: PaginationParams,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<User>> => {
    try {
      // In production, queries the real backend with query params
      const query = new URLSearchParams({
        _page: String(params.page),
        _limit: String(params.limit),
        ...(params.search ? { q: params.search } : {}),
      });

      const response = await http.get<RemoteApiUser[]>(
        `${API_ENDPOINTS.USERS.LIST}?${query.toString()}`,
        { signal }
      );

      // Map response to standardized PaginatedResponse
      const items: User[] = response.map((item, idx) => ({
        id: String(item.id),
        name: item.name || `User ${item.id}`,
        email: item.email || `user${item.id}@example.com`,
        role: idx % 3 === 0 ? 'admin' : idx % 2 === 0 ? 'manager' : 'user',
        permissions: ['users:read', 'settings:read'],
        status: idx % 4 === 0 ? 'inactive' : 'active',
        department: item.company?.name || 'Engineering',
        createdAt: new Date(2024, 0, idx + 1).toISOString(),
      }));

      // If search filter provided locally
      let filtered = items;
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = items.filter(
          (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
        );
      }

      return {
        data: filtered,
        meta: {
          currentPage: params.page,
          pageSize: params.limit,
          totalItems: 30,
          totalPages: Math.ceil(30 / params.limit),
          hasNextPage: params.page < Math.ceil(30 / params.limit),
          hasPrevPage: params.page > 1,
        },
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch {
      // Fallback mock service logic
      let filtered = [...MOCK_USERS];
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(
          (u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
        );
      }

      const startIndex = (params.page - 1) * params.limit;
      const paginatedData = filtered.slice(startIndex, startIndex + params.limit);
      const totalPages = Math.max(1, Math.ceil(filtered.length / params.limit));

      return {
        data: paginatedData,
        meta: {
          currentPage: params.page,
          pageSize: params.limit,
          totalItems: filtered.length,
          totalPages,
          hasNextPage: params.page < totalPages,
          hasPrevPage: params.page > 1,
        },
        success: true,
        timestamp: new Date().toISOString(),
      };
    }
  },

  getUserById: async (id: string | number, signal?: AbortSignal): Promise<User> => {
    try {
      const item = await http.get<RemoteApiUser>(API_ENDPOINTS.USERS.DETAIL(id), { signal });
      return {
        id: String(item.id),
        name: item.name || 'User',
        email: item.email || '',
        role: 'user',
        permissions: ['users:read'],
        status: 'active',
        department: item.company?.name || 'General',
        createdAt: new Date().toISOString(),
      };
    } catch {
      const found = MOCK_USERS.find((u) => u.id === String(id));
      if (found) return found;
      throw new Error(`User with ID ${id} not found.`);
    }
  },

  createUser: async (payload: Partial<User>): Promise<User> => {
    const newUser: User = {
      id: String(Date.now()),
      name: payload.name || 'New Member',
      email: payload.email || 'new.member@enterprise.io',
      role: payload.role || 'user',
      permissions: payload.permissions || ['users:read'],
      status: payload.status || 'active',
      department: payload.department || 'Operations',
      createdAt: new Date().toISOString(),
    };
    return newUser;
  },

  updateUser: async (id: string | number, payload: Partial<User>): Promise<User> => {
    return {
      id: String(id),
      name: payload.name || 'Updated User',
      email: payload.email || 'updated@enterprise.io',
      role: payload.role || 'user',
      permissions: payload.permissions || ['users:read'],
      status: payload.status || 'active',
      department: payload.department || 'Operations',
      createdAt: new Date().toISOString(),
    };
  },

  deleteUser: async (id: string | number): Promise<void> => {
    await http.delete(API_ENDPOINTS.USERS.DELETE(id)).catch(() => {});
  },
};
