import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';

export const resend = new Resend(resendApiKey);

export class EmailService {
  private static readonly FROM_EMAIL = 'TransitOps <noreply@transitops.com>';
  private static readonly FROM_EMAIL_TEST = 'onboarding@resend.dev';

  // Send welcome email
  static async sendWelcomeEmail(email: string, name: string, role: string) {
    try {
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: 'Welcome to TransitOps!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Welcome to TransitOps, ${name}!</h1>
            <p>Your account has been created successfully.</p>
            <p><strong>Role:</strong> ${role.replace('_', ' ')}</p>
            <p>You can now log in and start managing your fleet operations.</p>
            <a href="${process.env.FRONTEND_URL}/login" 
               style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
              Login to TransitOps
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }

  // Send license expiry reminder
  static async sendLicenseExpiryReminder(
    email: string,
    driverName: string,
    expiryDate: string,
    daysLeft: number
  ) {
    try {
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: `⚠️ License Expiring in ${daysLeft} Days - ${driverName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: ${daysLeft <= 7 ? '#dc2626' : '#f59e0b'}; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="color: white; margin: 0;">⚠️ License Expiry Alert</h2>
            </div>
            <div style="padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p><strong>Driver:</strong> ${driverName}</p>
              <p><strong>Expiry Date:</strong> ${expiryDate}</p>
              <p><strong>Days Remaining:</strong> ${daysLeft}</p>
              <p style="color: ${daysLeft <= 7 ? '#dc2626' : '#f59e0b'};">
                ${daysLeft <= 7 ? 'Urgent action required!' : 'Please renew soon.'}
              </p>
              <a href="${process.env.FRONTEND_URL}/drivers" 
                 style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
                View Driver Details
              </a>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send license reminder:', error);
    }
  }

  // Send trip dispatch notification
  static async sendTripDispatchNotification(
    email: string,
    driverName: string,
    tripDetails: { source: string; destination: string; cargo: string; vehicle: string }
  ) {
    try {
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: '🚛 New Trip Assigned',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Trip Dispatched!</h1>
            <p>Dear ${driverName},</p>
            <p>A new trip has been assigned to you:</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Source:</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${tripDetails.source}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Destination:</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${tripDetails.destination}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Cargo:</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${tripDetails.cargo}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Vehicle:</strong></td><td style="padding: 8px; border: 1px solid #e5e7eb;">${tripDetails.vehicle}</td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL}/dispatch" 
               style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
              View Trip Details
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send trip notification:', error);
    }
  }

  // Send maintenance alert
  static async sendMaintenanceAlert(
    email: string,
    vehicleReg: string,
    maintenanceType: string
  ) {
    try {
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: `🔧 Maintenance Alert - ${vehicleReg}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>🔧 Vehicle Maintenance</h2>
            <p>Vehicle <strong>${vehicleReg}</strong> has been sent for:</p>
            <p style="font-size: 18px; color: #2563eb;"><strong>${maintenanceType}</strong></p>
            <p>The vehicle status has been updated to "In Shop".</p>
            <a href="${process.env.FRONTEND_URL}/maintenance" 
               style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
              View Maintenance
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send maintenance alert:', error);
    }
  }

  // Send report
  static async sendReport(
    email: string,
    reportName: string,
    data: any,
    format: 'csv' | 'pdf'
  ) {
    try {
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: `📊 ${reportName} - TransitOps Report`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>📊 ${reportName}</h2>
            <p>Your requested report is ready.</p>
            <p><strong>Format:</strong> ${format.toUpperCase()}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <a href="${process.env.FRONTEND_URL}/reports" 
               style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
              Download Report
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send report:', error);
    }
  }
}