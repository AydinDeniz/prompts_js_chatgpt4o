// HTML for Automated Legal Document Analysis Tool (assumed to be in your HTML file)
/*
<div id="legal-document-analysis">
  <h2>Automated Legal Document Analysis</h2>
  <textarea id="document-input" placeholder="Paste your legal document here..." rows="10" cols="50"></textarea>
  <button id="analyze-document">Analyze Document</button>
  <div id="analysis-results"></div>
  <div id="summary"></div>
</div>
*/

class LegalDocumentAnalyzer {
  constructor() {
    this.importantTerms = ['confidential', 'liability', 'warranty', 'termination', 'indemnification'];
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('analyze-document').addEventListener('click', () => this.analyzeDocument());
  }

  analyzeDocument() {
    const documentText = document.getElementById('document-input').value;
    if (!documentText) {
      alert('Please paste the legal document text to analyze.');
      return;
    }

    const termOccurrences = this.extractKeyTerms(documentText);
    const summary = this.generateSummary(documentText);
    const importantSections = this.extractImportantSections(documentText);

    this.displayAnalysisResults(termOccurrences);
    this.displaySummary(summary);
    this.highlightImportantSections(importantSections);
  }

  extractKeyTerms(text) {
    const termCounts = {};
    this.importantTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      termCounts[term] = (text.match(regex) || []).length;
    });
    return termCounts;
  }

  generateSummary(text) {
    const sentences = text.split('.');
    const summary = sentences.slice(0, Math.min(3, sentences.length)).join('. ') + '.';
    return summary;
  }

  extractImportantSections(text) {
    return this.importantTerms.map(term => {
      const regex = new RegExp(`([^.]*?\\b${term}\\b[^.]*\\.)`, 'gi');
      const matches = [...text.matchAll(regex)];
      return { term, sections: matches.map(match => match[0]) };
    });
  }

  displayAnalysisResults(termOccurrences) {
    const analysisResults = document.getElementById('analysis-results');
    analysisResults.innerHTML = '<h3>Key Term Occurrences</h3>';

    for (const [term, count] of Object.entries(termOccurrences)) {
      const resultElement = document.createElement('p');
      resultElement.textContent = `${term}: ${count} occurrence(s)`;
      analysisResults.appendChild(resultElement);
    }
  }

  displaySummary(summary) {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `<h3>Document Summary</h3><p>${summary}</p>`;
  }

  highlightImportantSections(importantSections) {
    const highlightedDocument = document.getElementById('document-input').value;

    importantSections.forEach(({ term, sections }) => {
      sections.forEach(section => {
        const coloredSection = `<span style="background-color:yellow;">${section}</span>`;
        highlightedDocument = highlightedDocument.replace(section, coloredSection);
      });
    });

    document.getElementById('document-input').value = highlightedDocument;
  }
}

const legalDocumentAnalyzer = new LegalDocumentAnalyzer();