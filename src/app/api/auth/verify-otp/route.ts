import { NextRequest } from 'next/server';
import { verifyOTPCode, incrementOTPAttempts } from '@/lib/auth/otp';
import { createSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { verifyOTPSchema, validateData } from '@/lib/validations/schemas';
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
    const rateCheck = authRateLimit.check(identifier, 5);
    
    if (!rateCheck.success) {
      return apiRateLimitError(rateCheck.retryAfter);
    }
    const body = await req.json();
    const validation = validateData(verifyOTPSchema, body);
    
    if (!validation.success) {
      return apiValidationError(validation.errors);
    }

    const { code } = validation.data;
    const result = await verifyOTPCode(code);

    if (!result.success) {
      await incrementOTPAttempts(code);
      
      return apiError(
        result.error || 'Invalid verification code',
        401,
        'INVALID_OTP'
      );
    }

    const user = result.user!;
    await createSession(user.id);
    if (!user.emailVerified) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    }
    const response = apiSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified || new Date(),
        },
      },
      'Successfully authenticated'
    );
    response.headers.set('X-RateLimit-Limit', '5');
    response.headers.set('X-RateLimit-Remaining', rateCheck.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateCheck.reset).toISOString());

    return response;

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    
    return apiError(
      'Failed to verify code. Please try again.',
      500,
      'INTERNAL_ERROR'
    );
  }
}
