const createEmailTemplate = ({ title, body, locale = "en" }) => {
    const isAr = locale === "ar";

    return `
    <!DOCTYPE html>
    <html dir="${isAr ? "rtl" : "ltr"}" lang="${locale}">
    <head><meta charset="utf-8"></head>
    <body style="font-family: ${isAr ? "Tahoma, Arial" : "Arial, sans-serif"}; background: #f7f8fc; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
            <div style="background: linear-gradient(135deg, #4a6fa5, #3b5998); padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${isAr ? "شفاء" : "Shifaa"}</h1>
            </div>
            <div style="padding: 32px; color: #2d3748;">
                <h2 style="margin: 0 0 16px; font-size: 22px;">${title}</h2>
                ${body}
            </div>
            <div style="background: #f7f8fc; padding: 16px; text-align: center; color: #718096; font-size: 12px;">
                © ${new Date().getFullYear()} Shifaa. All rights reserved.
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = { createEmailTemplate };