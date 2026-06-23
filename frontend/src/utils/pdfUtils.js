import * as pdfjsLib from 'pdfjs-dist';

// Use standard CDN for the worker to avoid Webpack configuration headaches.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts all text from a given PDF ArrayBuffer.
 * @param {ArrayBuffer} arrayBuffer The raw PDF data.
 * @returns {Promise<string>} The extracted text.
 */
export const extractTextFromPDF = async (arrayBuffer) => {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (err) {
    console.error('Failed to extract text from PDF:', err);
    throw new Error('Failed to extract text from PDF file.');
  }
};
