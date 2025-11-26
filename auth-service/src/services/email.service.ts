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
        subject: '🔬 Verificación de Cuenta - GenoSentinel',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: 'Arial', 'Helvetica', sans-serif; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc;
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header { 
                background: linear-gradient(135deg, #1e40af, #2563eb);
                color: white; 
                padding: 30px 40px;
                text-align: center;
              }
              .logo { 
                font-size: 28px; 
                font-weight: bold; 
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
              }
              .tagline {
                font-size: 16px;
                opacity: 0.9;
                margin-top: 5px;
              }
              .content { 
                padding: 40px; 
                color: #374151;
              }
              .verification-box { 
                background: #f0f9ff; 
                border: 2px solid #93c5fd;
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                margin: 30px 0;
              }
              .verification-code { 
                font-size: 42px; 
                font-weight: bold; 
                color: #1e40af;
                letter-spacing: 8px;
                margin: 15px 0;
                font-family: 'Courier New', monospace;
              }
              .instructions {
                background: #f1f5f9;
                border-left: 4px solid #64748b;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
              }
              .footer { 
                background: #f1f5f9; 
                padding: 25px 40px; 
                text-align: center; 
                color: #64748b;
                font-size: 14px;
              }
              .security-note {
                background: #f8fafc;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 18px;
                margin-top: 25px;
                font-size: 13px;
                color: #475569;
              }
              .step-list {
                margin: 12px 0 0 0;
                padding-left: 20px;
                text-align: left;
              }
              .step-list li {
                margin-bottom: 8px;
                line-height: 1.5;
                color: #475569;
              }
              .icon-blue {
                color: #2563eb;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <div class="logo">
                  🧬 GenoSentinel
                </div>
                <div class="tagline">Sistema de Gestión Genómica y Clínica</div>
              </div>
              
              <!-- Content -->
              <div class="content">
                <h2 style="color: #1e293b; margin-bottom: 10px;">Verificación de Seguridad</h2>
                <p style="line-height: 1.6; margin-bottom: 25px; color: #475569;">
                  Gracias por registrarse en <strong style="color: #1e40af;">GenoSentinel</strong>. Para garantizar la seguridad 
                  de la información médica y genómica, necesitamos verificar su identidad.
                </p>
                
                <div class="verification-box">
                  <p style="margin: 0 0 15px 0; color: #475569; font-size: 16px;">
                    <strong>Utilice el siguiente código de verificación:</strong>
                  </p>
                  <div class="verification-code">${verificationCode}</div>
                  <p style="margin: 15px 0 0 0; color: #64748b; font-size: 14px;">
                    Este código expirará en <strong>15 minutos</strong>
                  </p>
                </div>
                
                <div class="instructions">
                  <strong style="color: #1e40af; font-size: 16px;" class="icon-blue">📋 Instrucciones de Verificación</strong>
                  <ul class="step-list">
                    <li><strong>Copie</strong> el código de 6 dígitos mostrado arriba</li>
                    <li><strong>Regrese</strong> a la aplicación GenoSentinel</li>
                    <li><strong>Ingrese</strong> el código en el campo de verificación correspondiente</li>
                    <li><strong>Complete</strong> el proceso para acceder al sistema</li>
                  </ul>
                </div>
                
                <div class="security-note">
                  <strong style="color: #1e40af;" class="icon-blue">🔒 Nota de Seguridad Importante</strong>
                  <p style="margin: 8px 0 0 0; line-height: 1.5; color: #475569;">
                    Por motivos de confidencialidad médica y protección de datos sensibles, 
                    <strong>nunca comparta este código con terceros</strong>. El personal autorizado 
                    de GenoSentinel nunca le solicitará este código por teléfono, mensaje de texto o email.
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <p style="margin: 0 0 10px 0; color: #475569;">
                  <strong style="color: #1e40af;">GenoSentinel</strong><br>
                  Sistema de Gestión de Información Genómica y Clínica
                </p>
                <p style="margin: 0; font-size: 12px; color: #64748b;">
                  Este es un mensaje automático. Por favor no responda a este email.<br>
                  © 2024 GenoSentinel. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      console.log(`✅ Email de verificación profesional enviado a: ${email}`);
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
        subject: '🎉 ¡Bienvenido a GenoSentinel!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { 
                font-family: 'Arial', 'Helvetica', sans-serif; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc;
              }
              .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header { 
                background: linear-gradient(135deg, #1e40af, #2563eb);
                color: white; 
                padding: 30px 40px;
                text-align: center;
              }
              .logo { 
                font-size: 28px; 
                font-weight: bold; 
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
              }
              .tagline {
                font-size: 16px;
                opacity: 0.9;
                margin-top: 5px;
              }
              .content { 
                padding: 40px; 
                color: #374151;
              }
              .welcome-box { 
                background: #f0f9ff; 
                border: 2px solid #93c5fd;
                border-radius: 12px;
                padding: 30px;
                text-align: center;
                margin: 25px 0;
              }
              .features {
                background: #f1f5f9;
                border-left: 4px solid #64748b;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
              }
              .footer { 
                background: #f1f5f9; 
                padding: 25px 40px; 
                text-align: center; 
                color: #64748b;
                font-size: 14px;
              }
              .feature-list {
                margin: 12px 0 0 0;
                padding-left: 20px;
                text-align: left;
              }
              .feature-list li {
                margin-bottom: 8px;
                line-height: 1.5;
                color: #475569;
              }
              .icon-blue {
                color: #2563eb;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <div class="logo">
                  🧬 GenoSentinel
                </div>
                <div class="tagline">Sistema de Gestión Genómica y Clínica</div>
              </div>
              
              <!-- Content -->
              <div class="content">
                <div class="welcome-box">
                  <h2 style="color: #1e40af; margin: 0 0 15px 0;">🎉 ¡Bienvenido a GenoSentinel!</h2>
                  <p style="font-size: 18px; color: #475569; margin: 0 0 20px 0;">
                    Hola <strong>${userName}</strong>,
                  </p>
                  <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
                    Tu cuenta ha sido verificada exitosamente y ahora está activa en nuestro sistema.
                  </p>
                </div>
                
                <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                  Ahora puedes acceder a todas las funcionalidades de nuestro sistema de gestión genómica 
                  y comenzar a utilizar las herramientas diseñadas para el manejo de información médica especializada.
                </p>
                
                <div class="features">
                  <strong style="color: #1e40af; font-size: 16px;" class="icon-blue">🚀 Funcionalidades Disponibles</strong>
                  <ul class="feature-list">
                    <li><strong>Gestión de Pacientes</strong> - Registro y seguimiento completo</li>
                    <li><strong>Análisis Genómicos</strong> - Procesamiento de datos genéticos</li>
                    <li><strong>Historias Clínicas</strong> - Documentación médica segura</li>
                    <li><strong>Reportes Especializados</strong> - Generación de informes detallados</li>
                    <li><strong>Colaboración Médica</strong> - Trabajo en equipo seguro</li>
                  </ul>
                </div>
                
                <p style="color: #475569; line-height: 1.6; margin-bottom: 0; text-align: center;">
                  <strong>¡Estamos emocionados de tenerte en nuestra comunidad médica!</strong>
                </p>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <p style="margin: 0 0 10px 0; color: #475569;">
                  <strong style="color: #1e40af;">GenoSentinel</strong><br>
                  Sistema de Gestión de Información Genómica y Clínica
                </p>
                <p style="margin: 0; font-size: 12px; color: #64748b;">
                  Este es un mensaje automático. Por favor no responda a este email.<br>
                  © 2024 GenoSentinel. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await sgMail.send(msg);
      console.log(`✅ Email de bienvenida profesional enviado a: ${email}`);
      return true;
    } catch (error: any) {
      console.error('❌ Error enviando email de bienvenida:', error.message);
      return false;
    }
  }
}

export default EmailService;