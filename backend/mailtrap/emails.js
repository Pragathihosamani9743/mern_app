import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
	const recipient = [{ email }];

	try {
		console.log("Attempting to send email to:", email);
		console.log("Using token:", process.env.MAILTRAP_TOKEN ? "Token present" : "Token missing");
		console.log("Verification code:", verificationToken);

		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			text: `Your verification code is: ${verificationToken}`,
			category: "Email Verification",
		});

		console.log("Email sent successfully", response);
	} catch (error) {
		console.error(`Error sending verification email:`, error.response?.data || error.message || error);
		console.error("Full error:", error);

		// Don't throw error, just log it so signup can continue
		console.log("Continuing signup despite email error...");
	}
};

export const sendWelcomeEmail = async (email, name) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Welcome to Auth App!",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="UTF-8">
					<title>Welcome!</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
						<h1 style="color: white; margin: 0;">Welcome to Auth App!</h1>
					</div>
					<div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
						<p>Hello ${name},</p>
						<p>🎉 Welcome to our authentication system! Your email has been successfully verified.</p>
						<p>You can now access all features of your account.</p>
						<p>Thank you for joining us!</p>
						<p>Best regards,<br>The Auth App Team</p>
					</div>
				</body>
				</html>
			`,
			text: `Welcome ${name}! Your email has been successfully verified. Thank you for joining Auth App!`,
			category: "Welcome Email",
		});

		console.log("Welcome email sent successfully", response);
	} catch (error) {
		console.error(`Error sending welcome email`, error.response?.data || error.message || error);

		// Don't throw error, just log it
		console.log("Continuing verification despite welcome email error...");
	}
};

export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
