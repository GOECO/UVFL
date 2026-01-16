export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'validate' | 'sign' | 'proxy' | 'trigger' | 'configure' | 'publish' | 'simulate' | 'flag' | 'manage' | 'export' | 'mask' | 'route';
export type Resource = 
  | 'value_record' 
  | 'evidence' 
  | 'wallet' 
  | 'nav' 
  | 'dispute' 
  | 'ledger' 
  | 'ruleset' 
  | 'country_profile' 
  | 'fund' 
  | 'audit_log' 
  | 'ai_gateway' 
  | 'infrastructure' 
  | 'environment'
  | 'pii'
  | 'aggregate_report'
  | 'compliance_report';

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
  permissions: string[]; // Reference to Permission IDs
  description: string;
  target: 'USER' | 'APP' | 'SYSTEM' | 'ORG';
  isCore: boolean; 
  constraints?: string[];
}

export interface UVFLAssignment {
  id: string;
  targetId: string; // User ID or App ID
  roleId: string;
  scope: 'GLOBAL' | string; // Country ISO or Global
  assignedAt: string;
  assignedBy: string;
}

export const roleManagementService = {
  // 1. DATABASE SCHEMA DEFINITION
  getSchema() {
    return {
      version: "1.0.2",
      tables: {
        roles: { 
          columns: ['id', 'name', 'description', 'target', 'is_locked', 'created_at'],
          constraints: "name must be unique, id is UUID"
        },
        permissions: { 
          columns: ['id', 'action', 'resource', 'scope', 'constraints'],
          constraints: "action:resource:scope must be unique"
        },
        role_permissions: { 
          columns: ['role_id', 'permission_id'],
          constraints: "Foreign keys to roles and permissions"
        },
        user_assignments: { 
          columns: ['id', 'target_id', 'role_id', 'scope', 'assigned_at', 'assigned_by'],
          constraints: "target_id references identity service"
        },
        role_audit_logs: { 
          columns: ['id', 'actor_id', 'target_id', 'action', 'prev_state', 'new_state', 'merkle_root'],
          constraints: "hash-chained for immutability"
        }
      }
    };
  },

  // 2. CORE DEFINITIONS
  getCoreRoles(): UVFLRole[] {
    return [
      { id: 'R-01', name: 'END_USER', target: 'USER', isCore: true, description: 'Standard user creating value contributions.', permissions: ['P-01', 'P-03', 'P-04'] },
      { id: 'R-02', name: 'VALIDATOR', target: 'USER', isCore: true, description: 'Peer verification node.', permissions: ['P-08'], constraints: ['cannot_validate_own_record'] },
      { id: 'R-03', name: 'COMMUNITY_MODERATOR', target: 'USER', isCore: true, description: 'Dispute and community manager.', permissions: ['P-08', 'P-26'], constraints: ['read_only_financial'] },
      { id: 'R-04', name: 'SYSTEM_ADMIN', target: 'SYSTEM', isCore: true, description: 'Infrastructure and environment admin.', permissions: ['P-14', 'P-16'], constraints: ['no_ruleset_edit'] },
      { id: 'R-05', name: 'RULE_ADMIN', target: 'USER', isCore: true, description: 'Logic and ruleset architect. Manages protocol math and distribution logic. Explicitly forbidden from editing published blocks.', permissions: ['P-17', 'P-18', 'P-19', 'P-35'], constraints: ['cannot_edit_published_ruleset', 'audit_required_on_publish'] },
      { id: 'R-06', name: 'COUNTRY_ADMIN', target: 'USER', isCore: true, description: 'Jurisdiction governor.', permissions: ['P-14'], constraints: ['cannot_edit_history'] },
      { id: 'R-07', name: 'FUND_ADMIN', target: 'USER', isCore: true, description: 'System budget and fund manager.', permissions: ['P-23'] },
      { id: 'R-08', name: 'AUDIT_ADMIN', target: 'USER', isCore: true, description: 'Internal compliance auditor.', permissions: ['P-26'] },
      { id: 'R-09', name: 'AI_SYSTEM', target: 'SYSTEM', isCore: true, description: 'Automated monitoring agents.', permissions: ['P-26'] },
      { id: 'R-10', name: 'AI_GATEWAY_SERVICE', target: 'APP', isCore: true, description: 'Proxy and masking service.', permissions: ['P-26'] },
      { id: 'R-11', name: 'DEVELOPER_APP', target: 'APP', isCore: true, description: 'Third-party integration.', permissions: ['P-35'] },
      { id: 'R-12', name: 'PARTNER_ORGANIZATION', target: 'ORG', isCore: true, description: 'Strategic ecosystem partners.', permissions: ['P-35'] },
      { id: 'R-13', name: 'GOVERNMENT_READONLY', target: 'ORG', isCore: true, description: 'Regulatory oversight entity.', permissions: ['P-39'] },
    ];
  },

  getPermissions(): UVFLPermission[] {
    return [
      { id: 'P-01', action: 'create', resource: 'value_record', scope: 'OWN' },
      { id: 'P-03', action: 'read', resource: 'wallet', scope: 'OWN' },
      { id: 'P-04', action: 'read', resource: 'nav', scope: 'OWN' },
      { id: 'P-08', action: 'validate', resource: 'value_record', scope: 'COUNTRY' },
      { id: 'P-14', action: 'manage', resource: 'infrastructure', scope: 'GLOBAL' },
      { id: 'P-16', action: 'trigger', resource: 'environment', scope: 'GLOBAL' },
      { id: 'P-17', action: 'create', resource: 'ruleset', scope: 'GLOBAL' },
      { id: 'P-18', action: 'publish', resource: 'ruleset', scope: 'GLOBAL' },
      { id: 'P-19', action: 'simulate', resource: 'ruleset', scope: 'GLOBAL' },
      { id: 'P-23', action: 'configure', resource: 'fund', scope: 'GLOBAL' },
      { id: 'P-26', action: 'read', resource: 'audit_log', scope: 'GLOBAL' },
      { id: 'P-35', action: 'read', resource: 'ledger', scope: 'PUBLIC' },
      { id: 'P-39', action: 'read', resource: 'compliance_report', scope: 'GLOBAL' }
    ];
  },

  getInitialAssignments(): UVFLAssignment[] {
    return [
      { id: 'AS-001', targetId: 'USER-7782', roleId: 'R-02', scope: 'VN', assignedAt: '2024-03-24 10:00', assignedBy: 'SYS_ADMIN' },
      { id: 'AS-002', targetId: 'APP-102', roleId: 'R-11', scope: 'GLOBAL', assignedAt: '2024-03-25 09:00', assignedBy: 'SYS_ADMIN' },
      { id: 'AS-003', targetId: 'USER-GOV-01', roleId: 'R-05', scope: 'GLOBAL', assignedAt: '2024-03-25 15:30', assignedBy: 'SYS_ADMIN' },
    ];
  },

  getAuditLogs(): any[] {
    return [
      { timestamp: '2024-03-25 15:30', actor: 'SYSTEM_ADMIN', target: 'USER-GOV-01', action: 'ASSIGN_ROLE', type: 'ASSIGNMENT', role: 'RULE_ADMIN', hash: 'sha256:72ab...e991' },
      { timestamp: '2024-03-25 15:12', actor: 'RULE_ADMIN', target: 'R-01 (END_USER)', action: 'GRANT_PERMISSION', type: 'PERMISSION', detail: 'Added P-35 (Public Ledger Read)', hash: 'sha256:881c...f012' },
      { timestamp: '2024-03-25 15:00', actor: 'SYSTEM_ADMIN', target: 'USER-102', action: 'ASSIGN_ROLE', type: 'ASSIGNMENT', role: 'VALIDATOR', hash: 'sha256:8f2a...102b' },
      { timestamp: '2024-03-25 14:55', actor: 'RULE_ADMIN', target: 'R-02 (VALIDATOR)', action: 'ADD_CONSTRAINT', type: 'PERMISSION', detail: 'mfa_required_for_all', hash: 'sha256:bb01...9921' },
      { timestamp: '2024-03-25 14:45', actor: 'RULE_ADMIN', target: 'RULESET_v4.4', action: 'PUBLISH_VERSION', type: 'SYSTEM', role: 'N/A', hash: 'sha256:d4e1...f009' },
      { timestamp: '2024-03-25 14:10', actor: 'SYSTEM_ADMIN', target: 'R-04 (SYSTEM_ADMIN)', action: 'REVOKE_PERMISSION', type: 'PERMISSION', detail: 'Removed P-17 (Ruleset Create)', hash: 'sha256:cc92...a1b2' },
    ];
  }
};