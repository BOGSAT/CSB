import { Injectable } from '@nestjs/common';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

@Injectable()
export class EmailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );
  }

  async sendVerificationEmail(email: string, verificationToken: string) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = 'Verify your Cool Story Bro account';
    sendSmtpEmail.htmlContent = `
      <h1>You're gonna write some cool stories Bro!</h1>
      <p>Click the link below to verify your account:</p>
      <a href="http://localhost:3000/verify/${verificationToken}">Verify Account</a>
    `;

    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }
}
