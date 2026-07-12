import { Request, Response, NextFunction } from 'express';

// ============================================
// SECURITY HEADERS
// ============================================
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'TransitOps');

  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
  );

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
};

// ============================================
// SQL INJECTION PREVENTION
// ============================================
export const preventSqlInjection = (req: Request, res: Response, next: NextFunction) => {
  const dangerousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|TRUNCATE|EXEC|EXECUTE)\b)/i,
    /(--)/,
    /(;)/,
    /(\/\*.*\*\/)/,
    /(xp_)/i,
    /(sp_)/i,
    /(exec\s*\()/i,
    /(union\s+select)/i,
    /(waitfor\s+delay)/i,
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return dangerousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => checkValue(v));
    }
    return false;
  };

  const hasInjection = checkValue(req.body) || 
                       checkValue(req.query) || 
                       checkValue(req.params);

  if (hasInjection) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected',
      requestId: (req as any).requestId,
    });
  }

  next();
};

// ============================================
// INPUT SANITIZATION
// ============================================
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/&#/g, '')
        .replace(/&lt;/g, '')
        .replace(/&gt;/g, '')
        .replace(/&amp;/g, '&')
        .trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(item => sanitize(item));
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query) as any;
  if (req.params) req.params = sanitize(req.params);

  next();
};

// ============================================
// REQUEST ID
// ============================================
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  res.setHeader('X-Request-Id', id);
  (req as any).requestId = id;
  next();
};

// ============================================
// RESPONSE TIME
// ============================================
export const responseTime = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  const originalEnd = res.end.bind(res);

  const setResponseTime = () => {
    const duration = Date.now() - start;
    if (!res.headersSent) {
      try {
        res.setHeader('X-Response-Time', `${duration}ms`);
      } catch (error) {
        // Header already sent, ignore
      }
    }
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
  };

  res.json = function (body: any) {
    setResponseTime();
    return originalJson(body);
  };

  res.send = function (body: any) {
    setResponseTime();
    return originalSend(body);
  };

  res.end = function (...args: any[]) {
    setResponseTime();
    return originalEnd(...args);
  };

  next();
};

// ============================================
// BODY SIZE LIMITER
// ============================================
export const bodySizeLimiter = (maxSize: number = 10 * 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');

    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        message: `Request body too large. Maximum ${maxSize / 1024 / 1024}MB allowed`,
      });
    }

    next();
  };
};

// ============================================
// ALLOWED METHODS CHECK
// ============================================
export const allowedMethods = (methods: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!methods.includes(req.method)) {
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
    }
    next();
  };
};

// ============================================
// CORS CONFIG
// ============================================
export const corsConfig = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Request-Id',
  ],
  exposedHeaders: [
    'X-Request-Id',
    'X-Response-Time',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  maxAge: 86400,
};