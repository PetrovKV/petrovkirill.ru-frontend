import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import AppList from './AppList.tsx';
import MergePage from './MergePage.tsx';
import SplitPage from './SplitPage.tsx';
import PdfToImagePage from './PdfToImagePage.tsx';
import ImageToPdfPage from './ImageToPdfPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/ListPDF" element={<AppList />} />
                <Route path="/ListPDF/merge" element={<MergePage />} />
                <Route path="/ListPDF/split" element={<SplitPage />} />
                <Route path="/ListPDF/pdf_to_img" element={<PdfToImagePage />} />
                <Route path="/ListPDF/img_to_pdf" element={<ImageToPdfPage />} />
            </Routes>
        </Router>
    </StrictMode>
);