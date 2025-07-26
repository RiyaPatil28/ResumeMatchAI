import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

export interface ParsedDocument {
  text: string;
  metadata?: any;
}

export class FileParser {
  static async parseFile(buffer: Buffer, mimetype: string): Promise<ParsedDocument> {
    try {
      if (mimetype === 'application/pdf') {
        return await this.parsePDF(buffer);
      } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return await this.parseDOCX(buffer);
      } else if (mimetype === 'application/msword') {
        throw new Error('Legacy DOC format not supported. Please use DOCX format.');
      } else {
        throw new Error(`Unsupported file type: ${mimetype}`);
      }
    } catch (error) {
      console.error('File parsing error:', error);
      throw new Error(`Failed to parse document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async parsePDF(buffer: Buffer): Promise<ParsedDocument> {
    try {
      const uint8Array = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      return {
        text: fullText.trim(),
        metadata: { pages: pdf.numPages }
      };
    } catch (error) {
      console.error('PDF parsing error:', error);
      // Fallback: return empty text if PDF parsing fails
      return {
        text: '',
        metadata: { error: 'Failed to parse PDF' }
      };
    }
  }

  private static async parseDOCX(buffer: Buffer): Promise<ParsedDocument> {
    const result = await mammoth.extractRawText({ buffer });
    return {
      text: result.value,
      metadata: result.messages
    };
  }
}
