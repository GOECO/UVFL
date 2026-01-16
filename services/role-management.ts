
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'validate' | 'sign' | 'proxy' | 'trigger' | 'configure' | 'publish' | 'simulate' | 'flag' | 'manage' | 'export';
export type Resource = 'value_record' | 'evidence' | 'wallet' | 'nav' | 'dispute' | 'ledger' | 'ruleset' | 'country_profile' | 'fund' | 'audit_log' | 'ai_gateway' | 'infrastructure' | 'environment';

export interface UVFLPermission {
  id: string;
  action: PermissionAction;
  resource: Resource;
  scope: 'OWN' | 'COUNTRY' | 'GLOBAL' | 'PUBLIC';
  constraints?: string[];
}

export interface UVFLRole {
  id: string;
  name: string;
  permissions: string[]; // IDs of permissions
  description: string;
  target: 'USER' | 'APP' | 'SYSTEM' | 'ORG';
  isCore: boolean; 
  constraints?: string[];
}

export const roleManagementService = {
  // 1. DATABASE SCHEMA DEFINITION (JSON Format)
  getSchema() {
    return {
      version: "1.0.0",
      tables: {
        roles: { columns: ['id', 'name', 'description', 'target', 'is_locked', 'created_at'] },
        permissions: { columns: ['id', 'action', 'resource', 'scope', 'constraints'] },
        role_permissions: { columns: ['role_id', 'permission_id'] },
        user_roles: { columns: ['user_id', 'role_id', 'scope_id', 'assigned_at', 'assigned_by'] },
        app_roles: { columns: ['app_id', 'role_id', 'rate_limit', 'env'] },
        api_keys: { columns: ['id', 'app_id', 'hashed_key', 'scopes', 'expiry'] },
        role_audit_logs: { columns: ['id', 'actor_id', 'target_id', 'action', 'prev_state', 'new_state', 'merkle_root'] }
      }
    };
  },

  // 2. CORE ROLE DEFINITIONS
  getCoreRoles(): UVFLRole[] {
    return [
      { id: 'R-01', name: 'END_USER', target: 'USER', isCore: true, description: 'Người dùng cuối tham gia tạo giá trị.', permissions: ['P-01', 'P-02', 'P-03', 'P-04', 'P-15'] },
      { id: 'R-02', name: 'VALIDATOR', target: 'USER', isCore: true, description: 'Xác thực bản ghi giá trị.', permissions: ['P-05', 'P-06', 'P-07'], constraints: ['cannot_validate_own'] },
      { id: 'R-03', name: 'COMMUNITY_MODERATOR', target: 'USER', isCore: true, description: 'Điều phối tranh chấp cộng đồng.', permissions: ['P-08', 'P-09', 'P-10'], constraints: ['read_only_financial'] },
      { id: 'R-04', name: 'SYSTEM_ADMIN', target: 'SYSTEM', isCore: true, description: 'Quản trị hạ tầng và môi trường.', permissions: ['P-11', 'P-12', 'P-13'], constraints: ['no_ruleset_edit', 'no_distribution_access'] },
      { id: 'R-05', name: 'RULE_ADMIN', target: 'SYSTEM', isCore: true, description: 'Quản lý logic Ruleset.', permissions: ['P-14', 'P-15', 'P-16'], constraints: ['cannot_edit_published'] },
      { id: 'R-06', name: 'COUNTRY_ADMIN', target: 'USER', isCore: true, description: 'Quản lý hồ sơ quốc gia.', permissions: ['P-17', 'P-18', 'P-19'], constraints: ['cannot_edit_history'] },
      { id: 'R-07', name: 'FUND_ADMIN', target: 'USER', isCore: true, description: 'Quản trị ngân sách quỹ.', permissions: ['P-20', 'P-21', 'P-22'], constraints: ['cannot_modify_ledger'] },
      { id: 'R-08', name: 'AUDIT_ADMIN', target: 'USER', isCore: true, description: 'Kiểm toán hệ thống toàn diện.', permissions: ['P-23', 'P-24', 'P-25'], constraints: ['read_only_all'] },
      { id: 'R-09', name: 'AI_SYSTEM', target: 'SYSTEM', isCore: true, description: 'Agent AI tự động giám sát.', permissions: ['P-26', 'P-27', 'P-28'], constraints: ['no_write_core_data'] },
      { id: 'R-10', name: 'AI_GATEWAY_SERVICE', target: 'APP', isCore: true, description: 'Dịch vụ cổng AI Gateway.', permissions: ['P-29', 'P-30', 'P-31'], constraints: ['no_data_storage'] },
      { id: 'R-11', name: 'DEVELOPER_APP', target: 'APP', isCore: true, description: 'Ứng dụng đối tác tích hợp.', permissions: ['P-32', 'P-33'], constraints: ['rate_limited'] },
      { id: 'R-12', name: 'PARTNER_ORGANIZATION', target: 'ORG', isCore: true, description: 'Tổ chức đối tác chiến lược.', permissions: ['P-34', 'P-35'], constraints: ['no_pii_access'] },
      { id: 'R-13', name: 'GOVERNMENT_READONLY', target: 'ORG', isCore: true, description: 'Cơ quan chính phủ giám sát.', permissions: ['P-36', 'P-37', 'P-38'], constraints: ['read_only_absolute'] },
    ];
  },

  getPermissions(): UVFLPermission[] {
    return [
      { id: 'P-01', action: 'create', resource: 'value_record', scope: 'OWN' },
      { id: 'P-03', action: 'read', resource: 'wallet', scope: 'OWN' },
      { id: 'P-05', action: 'validate', resource: 'value_record', scope: 'COUNTRY' },
      { id: 'P-11', action: 'manage', resource: 'infrastructure', scope: 'GLOBAL' },
      { id: 'P-13', action: 'trigger', resource: 'environment', scope: 'GLOBAL' }, // Emergency freeze
      { id: 'P-14', action: 'create', resource: 'ruleset', scope: 'GLOBAL' },
      { id: 'P-23', action: 'read', resource: 'audit_log', scope: 'GLOBAL' },
      { id: 'P-32', action: 'read', resource: 'ledger', scope: 'PUBLIC' },
    ];
  },

  // 3. MIDDLEWARE PSEUDO-CODE (Logic Server-side)
  /*
  async function srbacMiddleware(req, res, next) {
    const { identity, action, resource, targetData } = req;
    
    // Step 1: Resolve Active Roles (User or App)
    const roles = await db.getEffectiveRoles(identity.id);
    
    // Step 2: Accumulate Permissions
    const permissions = await db.getPermissionsByRoles(roles.ids);
    
    // Step 3: RBAC Check (Action:Resource)
    const matchedPerm = permissions.find(p => p.action === action && p.resource === resource);
    if (!matchedPerm) return res.status(403).json({ error: "ERR_PERMISSION_DENIED" });

    // Step 4: ABAC Scope Check
    if (matchedPerm.scope === 'OWN' && targetData.ownerId !== identity.id) {
       return res.status(403).json({ error: "ERR_OUT_OF_SCOPE" });
    }
    
    // Step 5: Constraint Enforcement
    if (roles.constraints.includes('cannot_validate_own') && targetData.creatorId === identity.id) {
       return res.status(403).json({ error: "ERR_CONFLICT_OF_INTEREST" });
    }

    // Step 6: Audit Logging
    await auditLogger.log({ actor: identity.id, action, resource, status: 'ALLOWED' });
    
    next();
  }
  */

  // 4. API ENDPOINTS PSEUDO
  /*
    POST /v1/admin/roles/assign
    { "targetId": "uuid", "roleId": "R-02", "scope": "VN" }

    GET /v1/admin/roles/audit
    { "filter": { "actor": "ADMIN-01" } }
  */

  getAuditLogs(): any[] {
    return [
      { timestamp: '2024-03-25 15:00', actor: 'SYSTEM_ADMIN', target: 'USER-102', action: 'ASSIGN_ROLE', role: 'VALIDATOR', hash: 'sha256:8f2a...102b' },
      { timestamp: '2024-03-25 14:45', actor: 'RULE_ADMIN', target: 'RULESET_v4.4', action: 'PUBLISH', role: 'N/A', hash: 'sha256:d4e1...f009' },
      { timestamp: '2024-03-25 13:20', actor: 'COUNTRY_ADMIN', target: 'PRO_VN_24', action: 'CONFIGURE_TAX', role: 'N/A', hash: 'sha256:c7b1...aa02' },
    ];
  }
};
