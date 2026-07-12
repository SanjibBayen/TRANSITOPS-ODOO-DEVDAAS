import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

export class Pagination {
  // Extract pagination params from request query
  static getParams(req: Request, defaultSort: string = 'created_at'): PaginationParams {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || defaultSort;
    const sortOrder = (req.query.sortOrder as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';

    return { page, limit, skip, sortBy, sortOrder };
  }

  // Create pagination result
  static createResult<T>(data: T[], totalItems: number, params: PaginationParams): PaginationResult<T> {
    const totalPages = Math.ceil(totalItems / params.limit);
    const hasNextPage = params.page < totalPages;
    const hasPreviousPage = params.page > 1;

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage: hasNextPage ? params.page + 1 : null,
        previousPage: hasPreviousPage ? params.page - 1 : null,
      },
    };
  }

  // Get pagination for Supabase query
  static getSupabaseRange(params: PaginationParams): { from: number; to: number } {
    return {
      from: params.skip,
      to: params.skip + params.limit - 1,
    };
  }

  // Format pagination response
  static formatResponse<T>(data: T[], total: number, params: PaginationParams) {
    const result = this.createResult(data, total, params);
    return {
      success: true,
      ...result,
    };
  }

  // Default pagination values
  static readonly DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
    SORT_ORDER: 'desc' as const,
    SORT_BY: 'created_at',
  };
}