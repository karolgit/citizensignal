import type {
  PermissionKey,
  PrivilegeGroupDocument,
  UserDocument,
} from "./types.js";

export const SCREEN_PERMISSIONS: Record<string, PermissionKey> = {
  districtManagement: "district.manage",
  sourceRegistry: "source_registry.manage",
  segmentAdministration: "segment_definition.manage",
  audienceRecords: "audience_records.manage",
  userAdministration: "user_administration.manage",
};

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function hasPermission(
  user: UserDocument,
  privilegeGroups: PrivilegeGroupDocument[],
  permission: PermissionKey,
): boolean {
  if (user.status !== "active") {
    return false;
  }

  return privilegeGroups.some((group) => group.permissions.includes(permission));
}
