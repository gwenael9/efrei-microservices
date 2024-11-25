import axios from "axios";

export class MailService {
  private mailServiceUrl = "http://localhost:8080/send-email";

  async sendEmail(payload: { to: string; subject: string; body: string }) {
    try {
      await axios.post(this.mailServiceUrl, payload);
    } catch (error) {
      throw new Error("Erreur lors de l'envoi du mail : " + (error as Error).message);
    }
  }
}
