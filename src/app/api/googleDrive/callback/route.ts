import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
          new URL(`/connections?error=${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
          new URL('/connections?error=no_code', request.url)
      );
    }

    if (!state) {
      return NextResponse.redirect(
          new URL('/login?error=invalid_state', request.url)
      );
    }

    let userId: string;
    try {
      const stateData = JSON.parse(decodeURIComponent(state));
      userId = stateData.userId;

      if (!userId) {
        throw new Error('userId not found in state');
      }

    } catch (parseError) {
      console.error('Failed to parse state parameter:', parseError);
      return NextResponse.redirect(
          new URL('/login?error=invalid_state_format', request.url)
      );
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return NextResponse.redirect(
          new URL('/login?error=user_not_found', request.url)
      );
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();

    const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
    );

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await userInfoResponse.json();

    const existingAccount = await db.googleDriveAccount.findUnique({
      where: { gmailAccount: userInfo.email },
    });

    const isFirstTimeConnection = !existingAccount;

    const account = await db.googleDriveAccount.upsert({
      where: { gmailAccount: userInfo.email },
      create: {
        gmailAccount: userInfo.email,
        userId: userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: BigInt(tokens.expires_in),
        scope: tokens.scope,
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: BigInt(tokens.expires_in),
        scope: tokens.scope,
        userId: userId,
      },
    });

    if (isFirstTimeConnection) {
      try {

        const metadataResponse = await fetch(
            `${process.env.PYTHON_API_URL}/authenticated/google/drive/metadata/${userId}/${account.id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
        );

        if (!metadataResponse.ok) {
          const errorText = await metadataResponse.text();
          console.error('Failed to trigger initial metadata sync:', {
            status: metadataResponse.status,
            error: errorText
          });
        } else {
          await metadataResponse.json();
        }
      } catch (syncError) {
        console.error('Error triggering initial metadata sync:', syncError);
      }
    }
    return NextResponse.redirect(
        new URL('/connections?success=connected', request.url)
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
        new URL('/connections?error=connection_failed', request.url)
    );
  }
}