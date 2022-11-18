const mail = require('@sendgrid/mail');

mail.setApiKey(process.env.SG_API_KEY);

export default async (req:any, res:any) => {
  const body = JSON.parse(req.body);

  const mailContent = {
    to: body.to_email,
    from: {
      email: 'noreply@uniscroll.io',
      name: 'Uniscroll x Goat Tribe',
    },
    templateId: process.env.SG_TEMPLATE_ID,
    dynamic_template_data: {
      name: body.name,
      receipt_details: body,
      total: body.total,
      subtotal: body.subtotal,
      shipping: body.shipping,
      date: body.date_time,
    },
  };
  
  await mail.send(mailContent);

  res.status(200).json({ status: 'Ok' });
}
