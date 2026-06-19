import type { RoleResponse } from "@shared/index";
import { apiFetch } from "@/lib/apiClient";

export interface RoleInput {
  name: string;
  description?: string;
  permissions: string[];
}

export function listRolesRequest(
  token: string,
  societyToken: string,
  societyId: string,
): Promise<RoleResponse[]> {
  return apiFetch<RoleResponse[]>(`/societies/${societyId}/roles`, {
    method: "GET",
    token,
    societyToken,
  });
}

export function getRoleRequest(
  token: string,
  societyToken: string,
  societyId: string,
  roleId: string,
): Promise<RoleResponse> {
  return apiFetch<RoleResponse>(`/societies/${societyId}/roles/${roleId}`, {
    method: "GET",
    token,
    societyToken,
  });
}

export function createRoleRequest(
  token: string,
  societyToken: string,
  societyId: string,
  data: RoleInput,
): Promise<RoleResponse> {
  return apiFetch<RoleResponse>(`/societies/${societyId}/roles`, {
    method: "POST",
    token,
    societyToken,
    body: data,
  });
}

export function updateRoleRequest(
  token: string,
  societyToken: string,
  societyId: string,
  roleId: string,
  data: RoleInput,
): Promise<RoleResponse> {
  return apiFetch<RoleResponse>(`/societies/${societyId}/roles/${roleId}`, {
    method: "PUT",
    token,
    societyToken,
    body: data,
  });
}

export function deleteRoleRequest(
  token: string,
  societyToken: string,
  societyId: string,
  roleId: string,
): Promise<null> {
  return apiFetch<null>(`/societies/${societyId}/roles/${roleId}`, {
    method: "DELETE",
    token,
    societyToken,
  });
}
