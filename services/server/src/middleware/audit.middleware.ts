import { Request, Response, NextFunction } from "express";
// @ts-ignore: allow import even if type declarations are missing
import { AuditService } from "../services/audit.service";

export const auditLog = (action: string, entity: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const entityId = req.params.id || body?.data?.id || "unknown";

        AuditService.log({
          userId: req.user.id,
          action,
          entity,
          entityId,
          newValue: req.method !== "GET" ? req.body : null,
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers["user-agent"] || "",
        }).catch(() => {});
      }

      return originalJson(body);
    };

    next();
  };
};

export const auditMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    if (req.user && req.method !== "GET") {
      AuditService.log({
        userId: req.user.id,
        action: req.method,
        entity: req.path.split("/")[3] || "unknown",
        entityId: req.params.id || "unknown",
        newValue: req.body,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"] || "",
      }).catch(() => {});
    }
  });

  next();
};
