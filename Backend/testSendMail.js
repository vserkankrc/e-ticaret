import sendEmail from './src/services/Email/sendEmail.js';

async function testMail() {
  try {
    await sendEmail({
      to: 'serkan_krc@outlook.com', // Buraya kendi test e-posta adresini yaz
      subject: 'Test Email - TercihSepetim',
      text: 'Bu bir test e-postasıdır.',
      html: '<h1>Merhaba!</h1><p>Bu bir test e-postasıdır.</p>',
    });
    console.log('Test maili başarıyla gönderildi.');
  } catch (error) {
    console.error('Mail gönderilirken hata oluştu:', error);
  }
}

testMail();
