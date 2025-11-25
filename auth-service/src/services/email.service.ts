import sgMail from '@sendgrid/mail';

export class EmailService {
  private static isConfigured = false;

  // Configurar SendGrid
  static configure(apiKey: string): void {
    if (apiKey && apiKey !== 'your_sendgrid_api_key_here') {
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
      console.log('✅ SendGrid configurado correctamente');
      console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
    } else {
      console.log('⚠️ SendGrid no configurado - Modo desarrollo');
    }
  }

  // Generar código de verificación
  static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Enviar código de verificación
  static async sendVerificationCode(email: string, verificationCode: string): Promise<boolean> {
    if (!this.isConfigured) {
      // Modo desarrollo: mostrar código en consola
      console.log(`📧 [MODO DESARROLLO] Código de verificación para ${email}: ${verificationCode}`);
      return true;
    }

    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@genosentinel.com';
      
      console.log(`📧 Intentando enviar email:`);
      console.log(`   To: ${email}`);
      console.log(`   From: ${fromEmail}`);
      console.log(`   API Key: ${process.env.SENDGRID_API_KEY?.substring(0, 10)}...`);

      const msg = {
        to: email,
        from: fromEmail,
        subject: 'Verifica tu cuenta - GenoSentinel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">GenoSentinel</h2>
            <p>Usa el siguiente código para verificar tu cuenta:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2563eb; margin: 0; font-size: 32px; letter-spacing: 5px;">
                ${verificationCode}
              </h1>
            </div>
            <p>Este código expirará en 15 minutos.</p>
          </div>
        `,
      };

      await sgMail.send(msg);
      console.log(`✅ Email enviado correctamente a: ${email}`);
      return true;
    } catch (error: any) {
      console.error('❌ ERROR DETALLADO SendGrid:');
      console.error('   - Message:', error.message);
      console.error('   - Code:', error.code);
      console.error('   - Status:', error.response?.statusCode);
      console.error('   - Body:', error.response?.body);
      console.error('   - Headers:', error.response?.headers);
      return false;
    }
  }

  // Enviar email de bienvenida
  static async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.log(`📧 [MODO DESARROLLO] Email de bienvenida para ${userName}`);
      return true;
    }

    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@genosentinel.com';
      
      console.log(`📧 Enviando email de bienvenida a: ${email}`);

      const msg = {
        to: email,
        from: fromEmail,
        subject: '¡Bienvenido a GenoSentinel!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">¡Bienvenido a GenoSentinel!</h2>
            <p>Hola ${userName},</p>
            <p>Tu cuenta ha sido verificada exitosamente.</p>
            <p>Ahora puedes acceder a todas las funcionalidades de nuestro sistema de gestión genómica.</p>
          </div>
        `,
      };

      await sgMail.send(msg);
      console.log(`✅ Email de bienvenida enviado a: ${email}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error enviando email de bienvenida:', error.message);
      return false;
    }
  }
}

export default EmailService;