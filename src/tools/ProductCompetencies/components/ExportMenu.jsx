import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Tile, Modal, Button, ModalActions } from '@toolkit-pm/design-system/components';
import { generateTextSummary } from '../utils/storage';
import './ExportMenu.css';

const ExportMenu = ({ competencies, onReset }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const handleExportPNG = async () => {
    try {
      setExportStatus('Generating PNG...');
      
      const element = document.querySelector('.app-container');
      if (!element) {
        throw new Error('Container not found');
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#f5f5f5',
        scale: 2,
        logging: false,
      });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `pm-competencies-${new Date().toISOString().split('T')[0]}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setExportStatus('PNG downloaded!');
        setTimeout(() => setExportStatus(''), 3000);
      });
    } catch (error) {
      console.error('Export PNG failed:', error);
      setExportStatus('Export failed. Please try again.');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportStatus('Generating PDF...');

      const element = document.querySelector('.app-container');
      if (!element) {
        throw new Error('Container not found');
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#f5f5f5',
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`pm-competencies-${new Date().toISOString().split('T')[0]}.pdf`);

      setExportStatus('PDF downloaded!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('Export PDF failed:', error);
      setExportStatus('Export failed. Please try again.');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const summary = generateTextSummary(competencies);
      await navigator.clipboard.writeText(summary);
      setExportStatus('Copied to clipboard!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      setExportStatus('Copy failed. Please try again.');
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
    setExportStatus('Reset to defaults!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  const scoredCount = competencies.filter(c => c.score !== null).length;
  const canExport = scoredCount > 0;

  return (
    <Tile className="export-menu">
      <h2>Actions</h2>
      
      <div className="export-buttons">
        <Button
          variant="secondary"
          className="export-btn"
          onClick={handleExportPNG}
          disabled={!canExport}
          title={!canExport ? 'Score at least one competency to export' : 'Download as PNG image'}
        >
          <span className="export-btn-icon">🖼️</span>
          Download PNG
        </Button>

        <Button
          variant="secondary"
          className="export-btn"
          onClick={handleExportPDF}
          disabled={!canExport}
          title={!canExport ? 'Score at least one competency to export' : 'Download as PDF document'}
        >
          <span className="export-btn-icon">📄</span>
          Download PDF
        </Button>

        <Button
          variant="secondary"
          className="export-btn"
          onClick={handleCopyToClipboard}
          disabled={!canExport}
          title={!canExport ? 'Score at least one competency to export' : 'Copy summary to clipboard'}
        >
          <span className="export-btn-icon">📋</span>
          Copy Summary
        </Button>

        <Button
          variant="secondary"
          className="export-btn reset-btn"
          onClick={() => setShowResetConfirm(true)}
          title="Reset to default competencies"
        >
          <span className="export-btn-icon">🔄</span>
          Reset to Defaults
        </Button>
      </div>

      {exportStatus && (
        <div className="export-status">
          {exportStatus}
        </div>
      )}

      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset to Defaults?"
      >
        <p>This will restore the original 10 competencies and clear all your scores. This action cannot be undone.</p>
        <ModalActions
          onCancel={() => setShowResetConfirm(false)}
          onDelete={handleReset}
          showDelete
          deleteLabel="Yes, Reset"
          cancelLabel="Cancel"
        />
      </Modal>

      <div className="info-box">
        <h3>How to use this tool</h3>
        <ol>
          <li>Review the default competencies or customize them for your context</li>
          <li>Rate yourself honestly on each competency using the 1-5 scale</li>
          <li>Review your radar chart to identify strengths and development opportunities</li>
          <li>Export your results to discuss with your manager or use for personal development planning</li>
        </ol>
      </div>
    </Tile>
  );
};

export default ExportMenu;
