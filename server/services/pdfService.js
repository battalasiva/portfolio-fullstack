const PDFDocument = require('pdfkit');

// ---------------------------------------------------------------------------
// Strip HTML tags for PDF (rich text → plain text with line breaks)
// ---------------------------------------------------------------------------
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// ---------------------------------------------------------------------------
// Font size presets
// ---------------------------------------------------------------------------
const FONT_SIZES = {
  small: { name: 22, title: 11, heading: 12, body: 9, meta: 8, small: 7.5 },
  medium: { name: 24, title: 12, heading: 13, body: 10, meta: 9, small: 8 },
  large: { name: 26, title: 13, heading: 14, body: 11, meta: 10, small: 9 },
};

const SPACING = {
  compact: { section: 0.4, item: 0.2, line: 1 },
  normal: { section: 0.6, item: 0.4, line: 1.5 },
  relaxed: { section: 0.9, item: 0.6, line: 2.5 },
};

// ---------------------------------------------------------------------------
// Date formatter
// ---------------------------------------------------------------------------
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formatDate = (date, format = 'MMM YYYY') => {
  if (!date) return 'Present';
  const d = new Date(date);
  switch (format) {
    case 'MM/YYYY': return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    case 'YYYY': return `${d.getFullYear()}`;
    case 'MMMM YYYY': return `${FULL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    default: return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }
};

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const LAYOUT = { marginLeft: 50, marginRight: 50, pageWidth: 595.28, pageHeight: 841.89 };
LAYOUT.contentWidth = LAYOUT.pageWidth - LAYOUT.marginLeft - LAYOUT.marginRight;

const checkPageBreak = (doc, space = 60) => {
  if (doc.y + space > LAYOUT.pageHeight - 60) doc.addPage();
};

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------
const addHeading = (doc, title, colors, sizes, spacing) => {
  checkPageBreak(doc, 40);
  doc.moveDown(spacing.section * 0.6).font('Helvetica-Bold').fontSize(sizes.heading).fillColor(colors.primary).text(title.toUpperCase(), LAYOUT.marginLeft).moveDown(0.1);
  const y = doc.y;
  doc.strokeColor(colors.accent).lineWidth(1).moveTo(LAYOUT.marginLeft, y).lineTo(LAYOUT.marginLeft + LAYOUT.contentWidth, y).stroke();
  doc.moveDown(0.3);
};

// ---------------------------------------------------------------------------
// Section renderers — each takes (doc, data, config)
// ---------------------------------------------------------------------------
const renderers = {
  profile: (doc, data, cfg) => {
    const { profile } = data;
    if (!profile) return;
    doc.font('Helvetica-Bold').fontSize(cfg.sizes.name).fillColor(cfg.colors.primary)
      .text(profile.name, LAYOUT.marginLeft, 45, { width: LAYOUT.contentWidth, align: 'center' });
    doc.font('Helvetica').fontSize(cfg.sizes.title).fillColor(cfg.colors.accent)
      .text(profile.title, { width: LAYOUT.contentWidth, align: 'center' });
    doc.moveDown(0.3);

    const parts = [profile.location, profile.email, profile.phone].filter(Boolean);
    if (parts.length) doc.font('Helvetica').fontSize(cfg.sizes.small).fillColor(cfg.colors.light).text(parts.join('  |  '), { width: LAYOUT.contentWidth, align: 'center' });

    if (profile.socialLinks?.length) {
      doc.moveDown(0.15);
      doc.font('Helvetica').fontSize(cfg.sizes.small - 0.5).fillColor(cfg.colors.accent)
        .text(profile.socialLinks.map((l) => `${l.platform}: ${l.url}`).join('  |  '), { width: LAYOUT.contentWidth, align: 'center' });
    }

    doc.moveDown(0.3);
    const y = doc.y;
    doc.strokeColor(cfg.colors.primary).lineWidth(1.5).moveTo(LAYOUT.marginLeft, y).lineTo(LAYOUT.marginLeft + LAYOUT.contentWidth, y).stroke();
    doc.moveDown(0.2);
  },

  summary: (doc, data, cfg) => {
    if (!data.profile?.summary) return;
    addHeading(doc, 'Professional Summary', cfg.colors, cfg.sizes, cfg.spacing);
    doc.font('Helvetica').fontSize(cfg.sizes.body).fillColor(cfg.colors.text)
      .text(data.profile.summary, LAYOUT.marginLeft, doc.y, { width: LAYOUT.contentWidth, lineGap: cfg.spacing.line });
  },

  experience: (doc, data, cfg) => {
    if (!data.experiences?.length) return;
    addHeading(doc, 'Work Experience', cfg.colors, cfg.sizes, cfg.spacing);
    data.experiences.forEach((exp, i) => {
      checkPageBreak(doc, 70);
      doc.font('Helvetica-Bold').fontSize(cfg.sizes.body + 1).fillColor(cfg.colors.secondary).text(exp.role, LAYOUT.marginLeft, doc.y, { continued: true })
        .font('Helvetica').fillColor(cfg.colors.light).text(`  —  ${exp.company}`);
      const dr = `${formatDate(exp.startDate, cfg.dateFormat)} – ${exp.isCurrent ? 'Present' : formatDate(exp.endDate, cfg.dateFormat)}`;
      doc.font('Helvetica-Oblique').fontSize(cfg.sizes.meta).fillColor(cfg.colors.light).text(exp.location ? `${dr}  |  ${exp.location}` : dr, LAYOUT.marginLeft);
      if (exp.description) { doc.moveDown(0.2); doc.font('Helvetica').fontSize(cfg.sizes.body - 0.5).fillColor(cfg.colors.text).text(stripHtml(exp.description), LAYOUT.marginLeft + 10, doc.y, { width: LAYOUT.contentWidth - 10, lineGap: cfg.spacing.line }); }
      if (i < data.experiences.length - 1) doc.moveDown(cfg.spacing.item);
    });
  },

  education: (doc, data, cfg) => {
    if (!data.education?.length) return;
    addHeading(doc, 'Education', cfg.colors, cfg.sizes, cfg.spacing);
    data.education.forEach((edu, i) => {
      checkPageBreak(doc, 50);
      const deg = edu.fieldOfStudy ? `${edu.degree} — ${edu.fieldOfStudy}` : edu.degree;
      doc.font('Helvetica-Bold').fontSize(cfg.sizes.body + 1).fillColor(cfg.colors.secondary).text(deg, LAYOUT.marginLeft);
      const dr = `${formatDate(edu.startDate, cfg.dateFormat)} – ${edu.isCurrent ? 'Present' : formatDate(edu.endDate, cfg.dateFormat)}`;
      const meta = edu.grade ? `${edu.institution}  |  ${dr}  |  Grade: ${edu.grade}` : `${edu.institution}  |  ${dr}`;
      doc.font('Helvetica-Oblique').fontSize(cfg.sizes.meta).fillColor(cfg.colors.light).text(meta, LAYOUT.marginLeft);
      if (edu.description) { doc.moveDown(0.2); doc.font('Helvetica').fontSize(cfg.sizes.body - 0.5).fillColor(cfg.colors.text).text(stripHtml(edu.description), LAYOUT.marginLeft + 10, doc.y, { width: LAYOUT.contentWidth - 10, lineGap: cfg.spacing.line }); }
      if (i < data.education.length - 1) doc.moveDown(cfg.spacing.item);
    });
  },

  skills: (doc, data, cfg) => {
    if (!data.skills?.length) return;
    addHeading(doc, 'Skills', cfg.colors, cfg.sizes, cfg.spacing);
    const grouped = data.skills.reduce((a, s) => { (a[s.category] = a[s.category] || []).push(s.name); return a; }, {});
    Object.entries(grouped).forEach(([cat, names]) => {
      checkPageBreak(doc, 25);
      doc.font('Helvetica-Bold').fontSize(cfg.sizes.body).fillColor(cfg.colors.secondary).text(`${cat}: `, LAYOUT.marginLeft, doc.y, { continued: true })
        .font('Helvetica').fillColor(cfg.colors.text).text(names.join(', '));
    });
  },

  projects: (doc, data, cfg) => {
    if (!data.projects?.length) return;
    addHeading(doc, 'Projects', cfg.colors, cfg.sizes, cfg.spacing);
    data.projects.forEach((p, i) => {
      checkPageBreak(doc, 60);
      doc.font('Helvetica-Bold').fontSize(cfg.sizes.body + 1).fillColor(cfg.colors.secondary).text(p.title, LAYOUT.marginLeft);
      doc.font('Helvetica-Oblique').fontSize(cfg.sizes.meta).fillColor(cfg.colors.light).text(`Tech: ${p.technologies}`, LAYOUT.marginLeft);
      if (p.description) {
        doc.moveDown(0.15);
        const desc = stripHtml(p.description);
        doc.font('Helvetica').fontSize(cfg.sizes.body - 0.5).fillColor(cfg.colors.text).text(desc.length > 300 ? desc.substring(0, 300) + '...' : desc, LAYOUT.marginLeft + 10, doc.y, { width: LAYOUT.contentWidth - 10, lineGap: cfg.spacing.line });
      }
      const links = p.links ? Object.entries(p.links).filter(([, v]) => v) : [];
      if (links.length) { doc.moveDown(0.1); doc.font('Helvetica').fontSize(cfg.sizes.small).fillColor(cfg.colors.accent).text(links.map(([k, u]) => `${k}: ${u}`).join('  |  '), LAYOUT.marginLeft + 10); }
      if (i < data.projects.length - 1) doc.moveDown(cfg.spacing.item);
    });
  },

  certifications: (doc, data, cfg) => {
    if (!data.certifications?.length) return;
    addHeading(doc, 'Certifications', cfg.colors, cfg.sizes, cfg.spacing);
    data.certifications.forEach((c, i) => {
      checkPageBreak(doc, 35);
      doc.font('Helvetica-Bold').fontSize(cfg.sizes.body).fillColor(cfg.colors.secondary).text(c.title, LAYOUT.marginLeft, doc.y, { continued: true })
        .font('Helvetica').fillColor(cfg.colors.light).text(`  —  ${c.issuer}`);
      const parts = [c.expiryDate ? `Issued: ${formatDate(c.issueDate, cfg.dateFormat)}  |  Expires: ${formatDate(c.expiryDate, cfg.dateFormat)}` : `Issued: ${formatDate(c.issueDate, cfg.dateFormat)}`];
      if (c.credentialId) parts.push(`ID: ${c.credentialId}`);
      doc.font('Helvetica-Oblique').fontSize(cfg.sizes.small).fillColor(cfg.colors.light).text(parts.join('  |  '), LAYOUT.marginLeft);
      if (c.credentialUrl) doc.font('Helvetica').fontSize(cfg.sizes.small).fillColor(cfg.colors.accent).text(c.credentialUrl, LAYOUT.marginLeft);
      if (i < data.certifications.length - 1) doc.moveDown(cfg.spacing.item);
    });
  },

  languages: (doc, data, cfg) => {
    if (!data.languages?.length) return;
    addHeading(doc, 'Languages', cfg.colors, cfg.sizes, cfg.spacing);
    doc.font('Helvetica').fontSize(cfg.sizes.body).fillColor(cfg.colors.text)
      .text(data.languages.map((l) => `${l.name} (${l.proficiency})`).join('  •  '), LAYOUT.marginLeft);
  },

  interests: (doc, data, cfg) => {
    if (!data.interests?.length) return;
    addHeading(doc, 'Interests', cfg.colors, cfg.sizes, cfg.spacing);
    doc.font('Helvetica').fontSize(cfg.sizes.body).fillColor(cfg.colors.text)
      .text(data.interests.map((i) => i.name).join('  •  '), LAYOUT.marginLeft);
  },

  contact: (doc, data, cfg) => {
    if (!data.contact) return;
    addHeading(doc, 'Contact', cfg.colors, cfg.sizes, cfg.spacing);
    const c = data.contact;
    const lines = [c.email, c.phone, c.address].filter(Boolean);
    doc.font('Helvetica').fontSize(cfg.sizes.body).fillColor(cfg.colors.text).text(lines.join('  |  '), LAYOUT.marginLeft);
  },
};

// Custom section renderer (dynamic — called for each custom_<id> key)
const renderCustomSection = (doc, section, cfg) => {
  if (!section?.items?.length) return;
  addHeading(doc, section.title, cfg.colors, cfg.sizes, cfg.spacing);
  section.items.sort((a, b) => (a.order || 0) - (b.order || 0)).forEach((item, i) => {
    checkPageBreak(doc, 50);
    if (item.title) doc.font('Helvetica-Bold').fontSize(cfg.sizes.body + 1).fillColor(cfg.colors.secondary).text(item.title, LAYOUT.marginLeft);
    if (item.subtitle) doc.font('Helvetica').fontSize(cfg.sizes.meta).fillColor(cfg.colors.light).text(item.subtitle, LAYOUT.marginLeft);
    if (item.startDate) {
      const dr = `${formatDate(item.startDate, cfg.dateFormat)} – ${item.isCurrent ? 'Present' : formatDate(item.endDate, cfg.dateFormat)}`;
      doc.font('Helvetica-Oblique').fontSize(cfg.sizes.small).fillColor(cfg.colors.light).text(dr, LAYOUT.marginLeft);
    }
    if (item.description) { doc.moveDown(0.15); doc.font('Helvetica').fontSize(cfg.sizes.body - 0.5).fillColor(cfg.colors.text).text(stripHtml(item.description), LAYOUT.marginLeft + 10, doc.y, { width: LAYOUT.contentWidth - 10, lineGap: cfg.spacing.line }); }
    if (item.url) doc.font('Helvetica').fontSize(cfg.sizes.small).fillColor(cfg.colors.accent).text(item.url, LAYOUT.marginLeft);
    if (i < section.items.length - 1) doc.moveDown(cfg.spacing.item);
  });
};

// ---------------------------------------------------------------------------
// Main — Generate PDF
// ---------------------------------------------------------------------------
const generateResumePDF = (data) => {
  const settings = data.resumeSettings || {};
  const theme = settings.theme || {};
  const prefs = settings.preferences || {};
  const sectionOrder = settings.sectionOrder || ['profile', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'interests', 'contact'];
  const hidden = settings.hiddenSections || {};

  // Build config from settings
  const cfg = {
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: theme.accentColor || '#0f3460',
      text: '#2d2d2d',
      light: '#555555',
    },
    sizes: FONT_SIZES[theme.fontSize || 'medium'],
    spacing: SPACING[theme.lineSpacing || 'normal'],
    dateFormat: prefs.dateFormat || 'MMM YYYY',
  };

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 50, left: LAYOUT.marginLeft, right: LAYOUT.marginRight },
    info: { Title: `${data.profile?.name || 'Resume'} — Resume`, Author: data.profile?.name || '', Creator: 'Portfolio Builder' },
    bufferPages: true,
  });

  // Build custom sections map for quick lookup
  const customMap = {};
  (data.customSections || []).forEach((s) => { customMap[`custom_${s._id}`] = s; });

  // Render sections in user-defined order
  sectionOrder.forEach((key) => {
    if (hidden[key]) return; // Skip hidden sections

    if (renderers[key]) {
      renderers[key](doc, data, cfg);
    } else if (key.startsWith('custom_') && customMap[key]) {
      renderCustomSection(doc, customMap[key], cfg);
    }
  });

  // Page numbers — only show if more than 1 page
  const total = doc.bufferedPageRange().count;
  if (total > 1) {
    for (let i = 0; i < total; i++) {
      doc.switchToPage(i);
      doc.font('Helvetica').fontSize(cfg.sizes.small).fillColor(cfg.colors.light)
        .text(`Page ${i + 1} of ${total}`, LAYOUT.marginLeft, LAYOUT.pageHeight - 35, { width: LAYOUT.contentWidth, align: 'center' });
    }
  }

  doc.end();
  return doc;
};

module.exports = { generateResumePDF };
