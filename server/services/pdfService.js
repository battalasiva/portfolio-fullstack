const PDFDocument = require('pdfkit');

// ---------------------------------------------------------------------------
// Color palette & layout constants
// ---------------------------------------------------------------------------
const COLORS = {
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#0f3460',
  text: '#2d2d2d',
  lightText: '#555555',
  link: '#0f3460',
  divider: '#cccccc',
  sectionBg: '#f5f5f5',
};

const LAYOUT = {
  marginLeft: 50,
  marginRight: 50,
  pageWidth: 595.28, // A4
  pageHeight: 841.89,
  contentWidth: 595.28 - 100, // pageWidth - marginLeft - marginRight
};

// ---------------------------------------------------------------------------
// Helper — format date as "MMM YYYY"
// ---------------------------------------------------------------------------
const formatDate = (date) => {
  if (!date) return 'Present';
  const d = new Date(date);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ---------------------------------------------------------------------------
// Helper — add a section heading with a line underneath
// ---------------------------------------------------------------------------
const addSectionHeading = (doc, title) => {
  checkPageBreak(doc, 40);

  doc
    .moveDown(0.8)
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(COLORS.primary)
    .text(title.toUpperCase(), LAYOUT.marginLeft)
    .moveDown(0.15);

  // Divider line
  const y = doc.y;
  doc
    .strokeColor(COLORS.accent)
    .lineWidth(1.5)
    .moveTo(LAYOUT.marginLeft, y)
    .lineTo(LAYOUT.marginLeft + LAYOUT.contentWidth, y)
    .stroke();

  doc.moveDown(0.4);
};

// ---------------------------------------------------------------------------
// Helper — check if we need a page break before adding content
// ---------------------------------------------------------------------------
const checkPageBreak = (doc, requiredSpace = 60) => {
  if (doc.y + requiredSpace > LAYOUT.pageHeight - 60) {
    doc.addPage();
  }
};

// ---------------------------------------------------------------------------
// Section renderers
// ---------------------------------------------------------------------------

const renderHeader = (doc, profile, contact) => {
  // Name
  doc
    .font('Helvetica-Bold')
    .fontSize(24)
    .fillColor(COLORS.primary)
    .text(profile.name, LAYOUT.marginLeft, 45, {
      width: LAYOUT.contentWidth,
      align: 'center',
    });

  // Title
  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor(COLORS.accent)
    .text(profile.title, {
      width: LAYOUT.contentWidth,
      align: 'center',
    });

  doc.moveDown(0.3);

  // Contact line: location | email | phone
  const contactParts = [];
  if (profile.location) contactParts.push(profile.location);
  if (profile.email) contactParts.push(profile.email);
  if (profile.phone) contactParts.push(profile.phone);

  if (contactParts.length > 0) {
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(COLORS.lightText)
      .text(contactParts.join('  |  '), {
        width: LAYOUT.contentWidth,
        align: 'center',
      });
  }

  // Social links line
  if (profile.socialLinks?.length > 0) {
    doc.moveDown(0.15);
    const socialLine = profile.socialLinks
      .map((link) => `${link.platform}: ${link.url}`)
      .join('  |  ');

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(COLORS.link)
      .text(socialLine, {
        width: LAYOUT.contentWidth,
        align: 'center',
      });
  }

  // Header divider
  doc.moveDown(0.5);
  const y = doc.y;
  doc
    .strokeColor(COLORS.primary)
    .lineWidth(2)
    .moveTo(LAYOUT.marginLeft, y)
    .lineTo(LAYOUT.marginLeft + LAYOUT.contentWidth, y)
    .stroke();

  doc.moveDown(0.3);
};

const renderSummary = (doc, profile) => {
  addSectionHeading(doc, 'Professional Summary');

  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(COLORS.text)
    .text(profile.summary, LAYOUT.marginLeft, doc.y, {
      width: LAYOUT.contentWidth,
      lineGap: 2,
    });
};

const renderExperience = (doc, experiences) => {
  if (!experiences.length) return;

  addSectionHeading(doc, 'Work Experience');

  experiences.forEach((exp, index) => {
    checkPageBreak(doc, 70);

    // Role — Company
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor(COLORS.secondary)
      .text(exp.role, LAYOUT.marginLeft, doc.y, { continued: true })
      .font('Helvetica')
      .fillColor(COLORS.lightText)
      .text(`  —  ${exp.company}`);

    // Date range and location
    const dateRange = `${formatDate(exp.startDate)} – ${exp.isCurrent ? 'Present' : formatDate(exp.endDate)}`;
    const metaLine = exp.location ? `${dateRange}  |  ${exp.location}` : dateRange;

    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor(COLORS.lightText)
      .text(metaLine, LAYOUT.marginLeft);

    // Description
    if (exp.description) {
      doc.moveDown(0.2);
      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor(COLORS.text)
        .text(exp.description, LAYOUT.marginLeft + 10, doc.y, {
          width: LAYOUT.contentWidth - 10,
          lineGap: 1.5,
        });
    }

    if (index < experiences.length - 1) {
      doc.moveDown(0.5);
    }
  });
};

const renderEducation = (doc, education) => {
  if (!education.length) return;

  addSectionHeading(doc, 'Education');

  education.forEach((edu, index) => {
    checkPageBreak(doc, 50);

    // Degree — Field of Study
    const degreeLine = edu.fieldOfStudy
      ? `${edu.degree} — ${edu.fieldOfStudy}`
      : edu.degree;

    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor(COLORS.secondary)
      .text(degreeLine, LAYOUT.marginLeft);

    // Institution and date
    const dateRange = `${formatDate(edu.startDate)} – ${edu.isCurrent ? 'Present' : formatDate(edu.endDate)}`;
    const metaLine = edu.grade
      ? `${edu.institution}  |  ${dateRange}  |  Grade: ${edu.grade}`
      : `${edu.institution}  |  ${dateRange}`;

    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor(COLORS.lightText)
      .text(metaLine, LAYOUT.marginLeft);

    if (index < education.length - 1) {
      doc.moveDown(0.4);
    }
  });
};

const renderSkills = (doc, skills) => {
  if (!skills.length) return;

  addSectionHeading(doc, 'Skills');

  // Group skills by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([category, skillNames]) => {
    checkPageBreak(doc, 25);

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(COLORS.secondary)
      .text(`${category}: `, LAYOUT.marginLeft, doc.y, { continued: true })
      .font('Helvetica')
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(skillNames.join(', '));
  });
};

const renderProjects = (doc, projects) => {
  if (!projects.length) return;

  addSectionHeading(doc, 'Projects');

  projects.forEach((project, index) => {
    checkPageBreak(doc, 60);

    // Title
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor(COLORS.secondary)
      .text(project.title, LAYOUT.marginLeft);

    // Technologies
    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor(COLORS.lightText)
      .text(`Tech: ${project.technologies}`, LAYOUT.marginLeft);

    // Description (truncated for resume)
    if (project.description) {
      doc.moveDown(0.15);
      const desc =
        project.description.length > 200
          ? project.description.substring(0, 200) + '...'
          : project.description;

      doc
        .font('Helvetica')
        .fontSize(9.5)
        .fillColor(COLORS.text)
        .text(desc, LAYOUT.marginLeft + 10, doc.y, {
          width: LAYOUT.contentWidth - 10,
          lineGap: 1.5,
        });
    }

    // Links
    const linkEntries = project.links
      ? Object.entries(project.links).filter(([_, v]) => v)
      : [];

    if (linkEntries.length > 0) {
      doc.moveDown(0.1);
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLORS.link)
        .text(
          linkEntries.map(([key, url]) => `${key}: ${url}`).join('  |  '),
          LAYOUT.marginLeft + 10
        );
    }

    if (index < projects.length - 1) {
      doc.moveDown(0.5);
    }
  });
};

const renderCertifications = (doc, certifications) => {
  if (!certifications.length) return;

  addSectionHeading(doc, 'Certifications');

  certifications.forEach((cert, index) => {
    checkPageBreak(doc, 35);

    doc
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(COLORS.secondary)
      .text(cert.title, LAYOUT.marginLeft, doc.y, { continued: true })
      .font('Helvetica')
      .fillColor(COLORS.lightText)
      .text(`  —  ${cert.issuer}`);

    const dateLine = cert.expiryDate
      ? `Issued: ${formatDate(cert.issueDate)}  |  Expires: ${formatDate(cert.expiryDate)}`
      : `Issued: ${formatDate(cert.issueDate)}`;

    const metaParts = [dateLine];
    if (cert.credentialId) metaParts.push(`ID: ${cert.credentialId}`);

    doc
      .font('Helvetica-Oblique')
      .fontSize(8.5)
      .fillColor(COLORS.lightText)
      .text(metaParts.join('  |  '), LAYOUT.marginLeft);

    if (cert.credentialUrl) {
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(COLORS.link)
        .text(cert.credentialUrl, LAYOUT.marginLeft);
    }

    if (index < certifications.length - 1) {
      doc.moveDown(0.3);
    }
  });
};

// ---------------------------------------------------------------------------
// Main — Generate PDF document from user data
// ---------------------------------------------------------------------------
// Returns a PDFKit document (readable stream). The caller pipes it to response.
//
// @param {Object} data
//   data.profile        — Profile document
//   data.skills         — Array of Skill documents
//   data.experiences    — Array of Experience documents
//   data.education      — Array of Education documents
//   data.certifications — Array of Certification documents
//   data.projects       — Array of Project documents
//   data.contact        — Contact document
// ---------------------------------------------------------------------------
const generateResumePDF = (data) => {
  const { profile, skills, experiences, education, certifications, projects, contact } = data;

  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 50,
      left: LAYOUT.marginLeft,
      right: LAYOUT.marginRight,
    },
    info: {
      Title: `${profile.name} — Resume`,
      Author: profile.name,
      Subject: 'Professional Resume',
      Creator: 'Portfolio Builder Platform',
    },
    bufferPages: true,
  });

  // Render sections in resume order
  renderHeader(doc, profile, contact);
  renderSummary(doc, profile);
  renderExperience(doc, experiences);
  renderEducation(doc, education);
  renderSkills(doc, skills);
  renderProjects(doc, projects);
  renderCertifications(doc, certifications);

  // Footer — page numbers
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(COLORS.lightText)
      .text(
        `Page ${i + 1} of ${totalPages}`,
        LAYOUT.marginLeft,
        LAYOUT.pageHeight - 35,
        { width: LAYOUT.contentWidth, align: 'center' }
      );
  }

  doc.end();
  return doc;
};

module.exports = { generateResumePDF };
