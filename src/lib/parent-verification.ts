import { sendEmail } from "@/lib/email";

/**
 * Send an 8-digit verification code to the parent/guardian of a minor student.
 * Uses service_role to bypass RLS.
 */
export async function sendParentVerificationEmail({
  userId,
  parentEmail,
  studentName,
  origin,
}: {
  userId: string;
  parentEmail: string;
  studentName: string;
  origin: string;
}) {
  const { createClient } = await import("@supabase/supabase-js");
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Invalidate any previous unused tokens for this user
  await adminSupabase
    .from("parent_verification_requests")
    .update({ used: true })
    .eq("user_id", userId)
    .eq("used", false);

  // Generate 8-digit code
  const code = String(Math.floor(10000000 + Math.random() * 90000000));

  await adminSupabase.from("parent_verification_requests").insert({
    user_id: userId,
    parent_email: parentEmail,
    token: code,
  });

  const verifyUrl = `${origin}/parent-verify`;

  await sendEmail({
    to: parentEmail,
    subject: "Parent/Guardian Consent Required — China Quest Pioneer Programme",
    html: `
      <div style="max-width: 560px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f1923;">
        <h2 style="color: #1b3a5c; margin-bottom: 16px;">Parent/Guardian Consent Required</h2>
        <p>Dear Parent/Guardian,</p>
        <p><strong>${studentName}</strong> has registered for the <strong>China Quest Pioneer Programme</strong>. Under GDPR (Article 8), because they are under 16, we need your consent before their account can be fully activated.</p>
        <p>Your verification code is:</p>
        <p style="margin: 32px 0; text-align: center;">
          <span style="background-color: #f8f7f5; border: 2px solid #c4683c; padding: 16px 32px; border-radius: 8px; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #0f1923; display: inline-block;">${code}</span>
        </p>
        <p>To give your consent, visit <a href="${verifyUrl}" style="color: #c4683c; font-weight: 600;">${verifyUrl}</a> and enter this code.</p>
        <p>This code expires in <strong>7 days</strong>. If you did not expect this email, you can safely ignore it — no account will be activated without your consent.</p>
        <p style="margin-top: 32px; color: #9e9a93; font-size: 14px;">
          China Quest — Miles Minds Limited, Ireland<br>
          info@milesminds.com
        </p>
      </div>
    `,
  });
}
