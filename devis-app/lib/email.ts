import { Resend } from 'resend';
import { Devis } from '../types/devis';

// Initialiser Resend de façon sécurisée (fallback si la clé est absente)
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// Définir l'expéditeur par défaut (Resend Sandbox impose onboarding@resend.dev par défaut)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'BioControl <onboarding@resend.dev>';

/**
 * Envoie un email de confirmation premium et personnalisé au client.
 * En cas d'erreur ou d'absence de clé, résout gracieusement pour ne pas bloquer l'utilisateur.
 */
export async function sendDevisConfirmationEmail(devis: Devis): Promise<boolean> {
  try {
    if (!resend) {
      console.warn(
        '⚠️ Resend : L\'envoi d\'e-mail a été ignoré car la variable d\'environnement RESEND_API_KEY n\'est pas configurée.'
      );
      return false;
    }

    if (!devis.email) {
      console.warn('⚠️ Resend : Adresse e-mail du client absente, envoi impossible.');
      return false;
    }

    // Traduction de l'urgence pour l'affichage email
    const urgenceLabel =
      devis.urgence === '24h'
        ? 'Intervention Urgente (< 24h)'
        : devis.urgence === 'annuel'
        ? 'Contrat Préventif Annuel'
        : 'Simple Devis Estimatif';

    // Rendu du template HTML premium en accord avec le logo et la palette or/charcoal
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de votre demande de devis</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FBFBFB; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #443C34;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FBFBFB; padding: 40px 20px;">
          <tr>
            <td align="center">
              <!-- Main Card Container -->
              <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.025);">
                
                <!-- Brand Header Banner -->
                <tr>
                  <td style="background-color: #443C34; padding: 35px 40px; text-align: center;">
                    <h1 style="color: #FFDE77; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 0.5px;">BioControl</h1>
                    <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.85;">Portail de Désinfection Professionnelle</p>
                  </td>
                </tr>

                <!-- Email Content Area -->
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <h2 style="margin-top: 0; font-size: 20px; font-weight: bold; color: #443C34;">Bonjour ${devis.nom},</h2>
                    <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 25px;">
                      Nous vous confirmons la bonne réception de votre demande de devis sur notre portail. Nos techniciens régionaux étudient votre dossier immédiatement. Un conseiller vous contactera par téléphone sous 2 heures ouvrables pour valider votre devis personnalisé.
                    </p>

                    <!-- Unique UUID Callout -->
                    <div style="background-color: #FBFBFB; border: 1px dashed #FFDE77; border-radius: 16px; padding: 18px 20px; margin-bottom: 30px; text-align: center;">
                      <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #94a3b8; display: block; letter-spacing: 0.5px; margin-bottom: 4px;">Référence unique de votre dossier (UUID)</span>
                      <code style="font-family: Menlo, Monaco, Consolas, monospace; font-size: 13px; color: #443C34; font-weight: bold; word-break: break-all;">${devis.id}</code>
                    </div>

                    <!-- Details Table -->
                    <h3 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #443C34; margin-bottom: 12px; border-bottom: 2px solid #FBFBFB; padding-bottom: 6px; letter-spacing: 0.5px;">Détails du projet transmis</h3>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13.5px; color: #64748b; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 10px 0; font-weight: 600; color: #443C34; border-bottom: 1px solid #f1f5f9;" width="40%">Type d'établissement</td>
                        <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">${devis.etablissement}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-weight: 600; color: #443C34; border-bottom: 1px solid #f1f5f9;">Surface à traiter</td>
                        <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">${devis.surface} m²</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-weight: 600; color: #443C34; border-bottom: 1px solid #f1f5f9;">Nuisibles ciblés</td>
                        <td style="padding: 10px 0; text-align: right; color: #443C34; font-weight: bold; border-bottom: 1px solid #f1f5f9;">${devis.nuisibles.join(', ')}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; font-weight: 600; color: #443C34; border-bottom: 1px solid #f1f5f9;">Degré d'urgence</td>
                        <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #f1f5f9;">
                          <span style="background-color: ${devis.urgence === '24h' ? '#fee2e2' : '#fef9c3'}; color: ${devis.urgence === '24h' ? '#ef4444' : '#713f12'}; padding: 3px 10px; border-radius: 8px; font-weight: bold; font-size: 11px;">
                            ${urgenceLabel}
                          </span>
                        </td>
                      </tr>
                      ${devis.message ? `
                      <tr>
                        <td style="padding: 10px 0; font-weight: 600; color: #443C34; border-bottom: 1px solid #f1f5f9;" valign="top">Précisions de votre part</td>
                        <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #f1f5f9; font-style: italic; line-height: 1.4;">"${devis.message}"</td>
                      </tr>
                      ` : ''}
                    </table>

                    <!-- Closing notes -->
                    <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
                      Nos interventions respectent scrupuleusement la réglementation en vigueur (normes Certibiocide, produits homologués respectueux de la santé publique). Pour toute question, veuillez vous munir de votre code de référence dossier unique.
                    </p>
                  </td>
                </tr>

                <!-- Branding Footer -->
                <tr>
                  <td style="background-color: #FBFBFB; padding: 25px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.5;">
                      Cet e-mail est généré automatiquement par l'application BioControl.<br>
                      Service Clientèle Téléphonique &bull; <strong>01 02 03 04 05</strong> (Appel Gratuit).
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: devis.email,
      subject: `Confirmation de votre demande de devis BioControl (Dossier ${devis.id.slice(0, 8)})`,
      html: emailHtml,
    });

    if (response.error) {
      console.error('❌ Resend API Error Response:', response.error);
      return false;
    }

    console.log(`🚀 Resend : Email de confirmation envoyé avec succès à ${devis.email} (ID: ${response.data?.id})`);
    return true;

  } catch (error) {
    console.error('❌ Resend Exception Catch:', error);
    return false; // Bloquer l'erreur pour préserver le parcours d'achat du client
  }
}
