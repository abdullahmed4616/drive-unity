import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createOTPCode } from "@/lib/auth/otp";
import { sendOTPEmail } from "@/lib/auth/email";
import { sendOTPSchema, validateData } from "@/lib/validations/schemas";
import {
  apiSuccess,
  apiError,
  apiValidationError,
  apiRateLimitError,
} from "@/lib/api/response";
import {
  authRateLimit,
  getRequestIdentifier,
} from "@/lib/middleware/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const identifier = getRequestIdentifier(req);
    const rateCheck = authRateLimit.check(identifier, 5);

    if (!rateCheck.success) {
      return apiRateLimitError(rateCheck.retryAfter);
    }

    const body = await req.json();
    const validation = validateData(sendOTPSchema, body);

    if (!validation.success) {
      return apiValidationError(validation.errors);
    }

    const { email, name } = validation.data;

    let user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      if (!name) {
        return apiValidationError({
          name: ["Name is required for new users"],
        });
      }

      user = await db.user.create({
        data: {
          email,
          name: name.trim(),
          password: null,
          role: "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }
    const code = await createOTPCode(user.id);
    await sendOTPEmail(user.email, user.name, code);

    const response = apiSuccess(
      {
        email: user.email,
      },
      "Verification code sent to your email"
    );
    response.headers.set("X-RateLimit-Limit", "5");
    response.headers.set(
      "X-RateLimit-Remaining",
      rateCheck.remaining.toString()
    );
    response.headers.set(
      "X-RateLimit-Reset",
      new Date(rateCheck.reset).toISOString()
    );

    return response;
  } catch (error: any) {
    console.error("Send OTP error:", error);

    if (error.code === "AUTH") {
      return apiError(
        "Email configuration error. Please contact support.",
        500,
        "EMAIL_CONFIG_ERROR"
      );
    }

    if (error.code === "CONNECTION" || error.code === "ETIMEDOUT") {
      return apiError(
        "Unable to send email. Please try again.",
        500,
        "EMAIL_SEND_ERROR"
      );
    }

    return apiError(
      "Failed to send verification code. Please try again.",
      500,
      "INTERNAL_ERROR"
    );
  }
}
