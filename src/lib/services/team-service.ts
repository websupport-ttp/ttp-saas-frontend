// lib/services/team-service.ts
import { apiClient } from '../api-client';

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  order: number;
  isActive: boolean;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberData {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateTeamMemberData {
  name?: string;
  role?: string;
  bio?: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  order?: number;
  isActive?: boolean;
}

class TeamService {
  private baseUrl = '/team';

  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await apiClient.get<TeamMember[]>(this.baseUrl);
    return response;
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    const response = await apiClient.get<TeamMember[]>(`${this.baseUrl}/all`);
    return response;
  }

  async createTeamMember(data: CreateTeamMemberData): Promise<TeamMember> {
    const response = await apiClient.post<TeamMember>(this.baseUrl, data);
    return response;
  }

  async updateTeamMember(id: string, data: UpdateTeamMemberData): Promise<TeamMember> {
    const response = await apiClient.put<TeamMember>(`${this.baseUrl}/${id}`, data);
    return response;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const teamService = new TeamService();
