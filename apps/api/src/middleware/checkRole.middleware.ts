import { Request, Response, NextFunction } from 'express';
import { UserRole, ROLE_HIERARCHY, hasMinimumRole } from '../entity/User';

/**
 * Require that the caller has AT LEAST the specified role level.
 * Role hierarchy (highest → lowest): admin > manager > lead > worker
 *
 * Example: requireMinRole('lead') allows admin, manager, and lead — but not worker.
 */
export const requireMinRole = (minimumRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    if (!hasMinimumRole(user.role as UserRole, minimumRole)) {
      return res.status(403).json({
        error: `Forbidden: Requires ${minimumRole} or higher. Your role: ${user.role}`,
      });
    }

    next();
  };
};

/**
 * Require an exact role match (or admin override).
 * Kept for backward compatibility.
 */
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    const isAdmin = user.role === UserRole.ADMIN;
    const hasRole = user.role === requiredRole;

    if (!isAdmin && !hasRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }

    next();
  };
};

// ─── Convenience shortcuts ────────────────────────────────────────────────────

/** Admin only */
export const requireAdmin = requireMinRole(UserRole.ADMIN);

/** Manager or above (admin + manager) */
export const requireManager = requireMinRole(UserRole.MANAGER);

/** Lead or above (admin + manager + lead) */
export const requireLead = requireMinRole(UserRole.LEAD);

/** Any authenticated user (admin + manager + lead + worker) */
export const requireWorker = requireMinRole(UserRole.WORKER);
