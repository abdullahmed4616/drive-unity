import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { checkEmailSchema, validateData } from '@/lib/validations/schemas';
import { 
  apiSuccess, 
  apiError, 
  apiValidationError,
  apiRateLimitError 
} from '@/lib/api/response';
import { 
  authRateLimit, 
  getRequestIdentifier 
} from '@/lib/middleware/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const identifier = getRequestIdentifier(req);
    const rateCheck = authRateLimit.check(identifier, 10);
    
    if (!rateCheck.success) {
      return apiRateLimitError(rateCheck.retryAfter);
    }
    const body = await req.json();
    const validation = validateData(checkEmailSchema, body);
    
    if (!validation.success) {
      return apiValidationError(validation.errors);
    }
    const { email } = validation.data;
    const user = await db.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        name: true 
      },
    });
    const response = apiSuccess({
      exists: !!user,
      name: user?.name || null,
    });
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set('X-RateLimit-Remaining', rateCheck.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateCheck.reset).toISOString());
    return response;

  } catch (error: any) {
    console.error('Check email error:', error);
    
    return apiError(
      'Failed to check email',
      500,
      'INTERNAL_ERROR'
    );
  }
}
