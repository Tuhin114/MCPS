"use client";

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="h-full overflow-auto">
      <Document
        file={src}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i + 1}
            pageNumber={i + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
