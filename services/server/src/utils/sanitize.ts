export class Sanitize {
  static string(input: string): string {
    if (!input) return '';
    return input
      .replace(/[<>]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  static email(email: string): string {
    return email.toLowerCase().trim();
  }

  static phone(phone: string): string {
    return phone.replace(/[^+\d]/g, '');
  }

  static number(value: any, fallback: number = 0): number {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
  }

  static boolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  }

  static object(obj: any): any {
    if (typeof obj === 'string') return Sanitize.string(obj);
    if (typeof obj === 'number') return obj;
    if (typeof obj === 'boolean') return obj;
    if (Array.isArray(obj)) return obj.map(item => Sanitize.object(item));
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = Sanitize.object(value);
      }
      return sanitized;
    }
    return obj;
  }

  static removeEmptyFields(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    );
  }

  static removeFields(obj: any, fieldsToRemove: string[]): any {
    const result = { ...obj };
    fieldsToRemove.forEach(field => delete result[field]);
    return result;
  }

  static onlyFields(obj: any, fieldsToKeep: string[]): any {
    const result: any = {};
    fieldsToKeep.forEach(field => {
      if (obj[field] !== undefined) {
        result[field] = obj[field];
      }
    });
    return result;
  }

  static html(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  static sqlIdentifier(input: string): string {
    return input.replace(/[^a-zA-Z0-9_]/g, '');
  }
}