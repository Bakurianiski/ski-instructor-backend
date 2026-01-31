import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send booking confirmation email
export const sendBookingEmail = async ({ to, booking, type }) => {
  const transporter = createTransporter();

  let subject, html;

  if (type === 'confirmation') {
    // Detect language from booking data (default: 'ka')
    const lang = booking.language || 'ka';
    
    const translations = {
      ka: {
        subject: '✅ დაჯავშნის დადასტურება - Ski Instructor',
        title: 'დაჯავშნა წარმატებით დადასტურდა!',
        hello: 'გამარჯობა',
        thanks: 'მადლობა თქვენი დაჯავშნისთვის! ჩვენ მალე დაგიკავშირდებით დადასტურებისთვის.',
        details: 'დაჯავშნის დეტალები',
        lesson: 'გაკვეთილი',
        level: 'დონე',
        duration: 'ხანგრძლივობა',
        date: 'თარიღი',
        students: 'მოსწავლეთა რაოდენობა',
        totalPrice: 'ჯამური ფასი',
        status: 'სტატუსი',
        pending: 'მოლოდინში',
        contact: 'თქვენი საკონტაქტო ინფორმაცია',
        phone: 'ტელეფონი',
        email: 'ელ. ფოსტა',
        notes: 'შენიშვნები',
        questions: 'თუ რაიმე შეკითხვა გაქვთ, მოგვწერეთ ან დაგვირეკეთ.'
      },
      en: {
        subject: '✅ Booking Confirmation - Ski Instructor',
        title: 'Booking Successfully Confirmed!',
        hello: 'Hello',
        thanks: 'Thank you for your booking! We will contact you shortly for confirmation.',
        details: 'Booking Details',
        lesson: 'Lesson',
        level: 'Level',
        duration: 'Duration',
        date: 'Date',
        students: 'Number of Students',
        totalPrice: 'Total Price',
        status: 'Status',
        pending: 'Pending',
        contact: 'Your Contact Information',
        phone: 'Phone',
        email: 'Email',
        notes: 'Notes',
        questions: 'If you have any questions, please write or call us.'
      },
      ru: {
        subject: '✅ Подтверждение бронирования - Ski Instructor',
        title: 'Бронирование успешно подтверждено!',
        hello: 'Здравствуйте',
        thanks: 'Спасибо за ваше бронирование! Мы свяжемся с вами в ближайшее время для подтверждения.',
        details: 'Детали бронирования',
        lesson: 'Урок',
        level: 'Уровень',
        duration: 'Продолжительность',
        date: 'Дата',
        students: 'Количество учеников',
        totalPrice: 'Общая цена',
        status: 'Статус',
        pending: 'Ожидание',
        contact: 'Ваша контактная информация',
        phone: 'Телефон',
        email: 'Email',
        notes: 'Заметки',
        questions: 'Если у вас есть вопросы, пишите или звоните нам.'
      }
    };

    const t = translations[lang];
    
    subject = t.subject;
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .booking-details { background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .booking-details h2 { margin-top: 0; color: #0284c7; }
          .detail-row { margin: 10px 0; }
          .detail-label { font-weight: bold; color: #0369a1; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⛷️ Ski Instructor</h1>
            <p>${t.title}</p>
          </div>
          <div class="content">
            <p>${t.hello} ${booking.name},</p>
            <p>${t.thanks}</p>
            
            <div class="booking-details">
              <h2>${t.details}</h2>
              <div class="detail-row">
                <span class="detail-label">${t.lesson}:</span> ${booking.session.title?.[lang] || booking.session.title}
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.level}:</span> ${booking.session.level?.[lang] || booking.session.level}
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.duration}:</span> ${booking.session.duration?.[lang] || booking.session.duration}
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.date}:</span> ${new Date(booking.date).toLocaleDateString(lang === 'ka' ? 'ka-GE' : lang === 'ru' ? 'ru-RU' : 'en-US')}
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.students}:</span> ${booking.students}
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.totalPrice}:</span> <strong>${booking.totalPrice}₾</strong>
              </div>
              <div class="detail-row">
                <span class="detail-label">${t.status}:</span> <strong style="color: #f59e0b;">${t.pending}</strong>
              </div>
            </div>

            <p>${t.contact}:</p>
            <ul>
              <li><strong>${t.phone}:</strong> ${booking.phone}</li>
              <li><strong>${t.email}:</strong> ${booking.email}</li>
            </ul>

            ${booking.notes ? `<p><strong>${t.notes}:</strong> ${booking.notes}</p>` : ''}

            <p>${t.questions}</p>
          </div>
          <div class="footer">
            <p>© 2026 Ski Instructor</p>
            <p>📞 +995 599 06 46 12 | 📧 chanturiasaba15@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
 } else if (type === 'admin_notification') {
  subject = '🔔 ახალი დაჯავშნა - Ski Instructor Admin';
  const lang = booking.language || 'ka';
  html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 30px; }
        .booking-details { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .booking-details h2 { margin-top: 0; color: #ea580c; }
        .detail-row { margin: 10px 0; }
        .detail-label { font-weight: bold; color: #c2410c; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        .alert { background-color: #dcfce7; border: 2px solid #22c55e; border-radius: 8px; padding: 15px; margin: 20px 0; color: #166534; font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 ახალი დაჯავშნა!</h1>
          <p>Admin Notification</p>
        </div>
        <div class="content">
          <div class="alert">
            ⚠️ ახალი დაჯავშნა მოვიდა! გთხოვთ დაუკავშირდეთ მომხმარებელს.
          </div>
          
          <div class="booking-details">
            <h2>📋 დაჯავშნის დეტალები</h2>
            <div class="detail-row">
              <span class="detail-label">👤 სახელი:</span> ${booking.name}
            </div>
            <div class="detail-row">
              <span class="detail-label">📧 Email:</span> ${booking.email}
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 ტელეფონი:</span> ${booking.phone}
            </div>
            <div class="detail-row">
              <span class="detail-label">🎿 გაკვეთილი:</span> ${booking.session.title?.[lang] || booking.session.title}
            </div>
            <div class="detail-row">
              <span class="detail-label">📊 დონე:</span> ${booking.session.level?.[lang] || booking.session.level}
            </div>
            <div class="detail-row">
              <span class="detail-label">⏱️ ხანგრძლივობა:</span> ${booking.session.duration?.[lang] || booking.session.duration}
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 თარიღი:</span> ${new Date(booking.date).toLocaleDateString('ka-GE')}
            </div>
            <div class="detail-row">
              <span class="detail-label">👥 მოსწავლეები:</span> ${booking.students}
            </div>
            <div class="detail-row">
              <span class="detail-label">💰 ჯამური ფასი:</span> <strong style="color: #22c55e; font-size: 20px;">${booking.totalPrice}₾</strong>
            </div>
            ${booking.notes ? `<div class="detail-row"><span class="detail-label">📝 შენიშვნები:</span> ${booking.notes}</div>` : ''}
            <div class="detail-row">
              <span class="detail-label">🌍 ენა:</span> ${lang === 'ka' ? 'ქართული 🇬🇪' : lang === 'en' ? 'English 🇬🇧' : 'Русский 🇷🇺'}
            </div>
          </div>

          <p style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <strong>📞 შემდეგი ნაბიჯი:</strong> დაუკავშირდით მომხმარებელს ტელეფონზე ან email-ით და დაადასტურეთ დაჯავშნა.
          </p>
        </div>
        <div class="footer">
          <p>© 2026 Ski Instructor Admin Panel</p>
          <p>🔗 Booking ID: ${booking._id}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

  try {
    await transporter.sendMail({
      from: `"Ski Instructor" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: subject,
      html: html
    });
    console.log('✅ ელ. ფოსტა წარმატებით გაიგზავნა:', to);
  } catch (error) {
    console.error('❌ ელ. ფოსტის გაგზავნის შეცდომა:', error);
    throw error;
  }
};