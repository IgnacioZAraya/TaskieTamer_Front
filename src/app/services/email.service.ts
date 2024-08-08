import { Injectable } from "@angular/core";
import sgMail from "@sendgrid/mail";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  constructor() {
    sgMail.setApiKey(
      "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"
    );
  }

  sendEmail(
    to: string | undefined,
    subject: string,
    content: string
  ): Promise<any> {
    const msg = {
      to,
      from: "noreply-taskietamer@gmail.com",
      subject,
      html: content,
    };

    return sgMail.send(msg);
  }
}
