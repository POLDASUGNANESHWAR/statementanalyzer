import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './index.css';

const StatementAnalyzer = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);


  const handleImageUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setExtractedText('');
  };

  
  const handleTextExtraction = () => {
    if (image) {
      setLoading(true);
      Tesseract.recognize(
        image,
        'eng',
        { logger: (m) => console.log(m) } 
      )
      .then(({ data: { text } }) => {
        setExtractedText(text);
        setLoading(false);
        analyzeText(text); 
      })
      .catch((err) => {
        console.error('OCR Error:', err);
        setLoading(false);
      });
    }
  };

  const analyzeText = (text) => {
    const abnormalPattern = /(charge|fee|fine|penalty|overdraft|late fee|interest)/i;
    const abnormalMatches = text.match(abnormalPattern);

    if (abnormalMatches) {
      alert('Potential abnormal charges found: ' + abnormalMatches);
    } else {
      alert('No abnormal charges detected.');
    }
  };

  return (
    <div className="analyzer-container">
      <h1>Bank Statement Analyzer</h1>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      
      {image && <img src={image} alt="Bank Statement Preview" className="statement-preview" />}

      <button onClick={handleTextExtraction} disabled={!image}>
        {loading ? 'Analyzing...' : 'Analyze Statement'}
      </button>

      <div className="extracted-text">
        {extractedText && (
          <pre>
            <h3>Extracted Text:</h3> {extractedText}
          </pre>
        )}
      </div>
    </div>
  );
};

export default StatementAnalyzer;
