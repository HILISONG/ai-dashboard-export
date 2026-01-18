
import { jsPDF } from "jspdf";
import { SavedStory } from "../types";

export const generateStoryPDF = async (story: SavedStory): Promise<void> => {
  // Define dimensions for a 3:2 Aspect Ratio Landscape Page
  // Width: 300mm, Height: 200mm
  const PAGE_WIDTH = 300;
  const PAGE_HEIGHT = 200;
  const MARGIN = 15;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [PAGE_WIDTH, PAGE_HEIGHT] // Custom 3:2 format
  });

  // Theme Colors (Dreamland Palette)
  const COL_BG = [255, 251, 240]; // Cream (#FFFBF0)
  const COL_PRIMARY = [58, 84, 140]; // Deep Blue (#3a548c)
  const COL_ACCENT = [255, 159, 28]; // Orange (#FF9F1C)
  const COL_TEXT = [45, 52, 54]; // Dark Grey (#2d3436)

  // Helper: Fetch image and convert to Base64
  const getImageData = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) return url;
    try {
        const res = await fetch(url, { mode: 'cors' });
        const blob = await res.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn("Failed to load image for PDF", url);
        return "";
    }
  };

  // --- 1. COVER PAGE ---
  doc.setFillColor(COL_BG[0], COL_BG[1], COL_BG[2]);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');

  // Decorative Border
  doc.setDrawColor(COL_ACCENT[0], COL_ACCENT[1], COL_ACCENT[2]);
  doc.setLineWidth(3);
  doc.roundedRect(MARGIN, MARGIN, PAGE_WIDTH - (MARGIN * 2), PAGE_HEIGHT - (MARGIN * 2), 10, 10, 'S');

  // Title (Centered)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(42);
  doc.setTextColor(COL_PRIMARY[0], COL_PRIMARY[1], COL_PRIMARY[2]);
  const title = `The Adventures of\n${story.hero.name}`;
  doc.text(title, PAGE_WIDTH / 2, 60, { align: 'center', lineHeightFactor: 1.2 });

  // Hero Avatar (Circle Crop simulation via clip is hard in basic jsPDF, using Square with border)
  const heroImg = await getImageData(story.hero.avatarUrl);
  if (heroImg) {
      const imgSize = 70;
      const imgX = (PAGE_WIDTH - imgSize) / 2;
      const imgY = 90;
      try {
        doc.addImage(heroImg, 'JPEG', imgX, imgY, imgSize, imgSize);
        // Border around avatar
        doc.setDrawColor(COL_PRIMARY[0], COL_PRIMARY[1], COL_PRIMARY[2]);
        doc.setLineWidth(2);
        doc.rect(imgX, imgY, imgSize, imgSize);
      } catch (e) {}
  }

  // Author & Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  doc.setTextColor(COL_TEXT[0], COL_TEXT[1], COL_TEXT[2]);
  doc.text(`Written by ${story.authorName}`, PAGE_WIDTH / 2, 175, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(150, 150, 150);
  const dateStr = new Date(story.timestamp).toLocaleDateString();
  doc.text(`Created on ${dateStr}`, PAGE_WIDTH / 2, 185, { align: 'center' });

  // --- 2. STORY PAGES ---
  for (let i = 0; i < story.pages.length; i++) {
      doc.addPage();
      const page = story.pages[i];

      // Layout: Left Half = Image (Full Bleed), Right Half = Text (Cream BG)
      
      // Right Side Background
      doc.setFillColor(COL_BG[0], COL_BG[1], COL_BG[2]);
      doc.rect(PAGE_WIDTH / 2, 0, PAGE_WIDTH / 2, PAGE_HEIGHT, 'F');

      // Left Side Image
      // The image is 3:4. The left area is 150mm x 200mm (3:4). It fits PERFECTLY.
      const imgData = await getImageData(page.imageUrl);
      if (imgData) {
          try {
            doc.addImage(imgData, 'JPEG', 0, 0, PAGE_WIDTH / 2, PAGE_HEIGHT);
          } catch (e) {
            // Fallback if image fails
            doc.setFillColor(200, 200, 200);
            doc.rect(0, 0, PAGE_WIDTH / 2, PAGE_HEIGHT, 'F');
            doc.text("Image Error", 20, 20);
          }
      }

      // Divider Line
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(2);
      doc.line(PAGE_WIDTH / 2, 0, PAGE_WIDTH / 2, PAGE_HEIGHT);

      // --- Right Side Content ---
      const textX = (PAGE_WIDTH / 2) + MARGIN;
      const textWidth = (PAGE_WIDTH / 2) - (MARGIN * 2);
      
      // Vertical Center Calculation
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(COL_PRIMARY[0], COL_PRIMARY[1], COL_PRIMARY[2]);
      
      // Calculate text height to center it
      const fontSize = 24;
      const lines = doc.splitTextToSize(page.text, textWidth);
      const textBlockHeight = lines.length * (fontSize * 0.45); // Approx height in mm
      const textY = (PAGE_HEIGHT / 2) - (textBlockHeight / 2);

      doc.text(lines, textX, textY, { lineHeightFactor: 1.4 });

      // User Choice (if applicable) - added as a small footnote
      if (page.userChoice) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.setTextColor(COL_ACCENT[0], COL_ACCENT[1], COL_ACCENT[2]);
          doc.text(`Decision: ${page.userChoice}`, textX, textY + textBlockHeight + 15);
      }

      // Page Number
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150);
      doc.text(`${i + 1}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - MARGIN, { align: 'right' });
  }

  // --- 3. ENDING PAGE ---
  doc.addPage();
  doc.setFillColor(COL_BG[0], COL_BG[1], COL_BG[2]);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, 'F');
  
  // Border
  doc.setDrawColor(COL_ACCENT[0], COL_ACCENT[1], COL_ACCENT[2]);
  doc.setLineWidth(3);
  doc.roundedRect(MARGIN, MARGIN, PAGE_WIDTH - (MARGIN * 2), PAGE_HEIGHT - (MARGIN * 2), 10, 10, 'S');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(60);
  doc.setTextColor(COL_PRIMARY[0], COL_PRIMARY[1], COL_PRIMARY[2]);
  doc.text("The End", PAGE_WIDTH / 2, PAGE_HEIGHT / 2 - 20, { align: 'center' });

  doc.setFontSize(20);
  doc.setTextColor(COL_TEXT[0], COL_TEXT[1], COL_TEXT[2]);
  doc.text(`You collected ${story.starsCollected} Stars!`, PAGE_WIDTH / 2, PAGE_HEIGHT / 2 + 10, { align: 'center' });

  // Branding
  doc.setFontSize(12);
  doc.setTextColor(150, 150, 150);
  doc.text("Generated by Dreamland Ai", PAGE_WIDTH / 2, PAGE_HEIGHT - 30, { align: 'center' });

  // Save
  const filename = `${story.hero.name.replace(/[^a-z0-9]/gi, '_')}_Adventure.pdf`;
  doc.save(filename);
};
