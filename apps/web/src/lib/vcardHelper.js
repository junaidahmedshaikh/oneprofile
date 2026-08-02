export function downloadVCardFile(profile) {
  if (!profile) return;
  const isProd = profile.profileType === 'professional';
  const name = isProd ? (profile.title || 'Professional') : (profile.companyName || 'Business');
  const org = profile.companyName || '';
  const title = isProd ? (profile.designation || '') : (profile.tagline || '');
  const email = profile.contactDetails?.email || '';
  const rawPhone = profile.contactDetails?.phone || '';
  const rawWhatsapp = profile.contactDetails?.whatsAppNumber || '';
  const website = profile.socialLinks?.website || '';
  const address = profile.location?.address || '';
  const city = profile.location?.city || '';
  const country = profile.location?.country || '';

  const cleanPhone = rawPhone.replace(/[\s\(\)]/g, '');
  const cleanWhatsapp = rawWhatsapp.replace(/[\s\(\)]/g, '');

  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    org ? `ORG:${org}` : null,
    title ? `TITLE:${title}` : null,
    cleanPhone ? `TEL;TYPE=CELL,VOICE:${cleanPhone}` : null,
    cleanWhatsapp ? `TEL;TYPE=WORK,MSG:${cleanWhatsapp}` : null,
    email ? `EMAIL;TYPE=PREF,INTERNET:${email}` : null,
    website ? `URL:${website}` : null,
    address ? `ADR;TYPE=WORK:;;${address.replace(/;/g, ' ')};${city};;${country}` : null,
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([vcardLines], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeFilename = name.replace(/[^a-zA-Z0-9]+/g, '_');
  link.setAttribute('download', `${safeFilename}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
