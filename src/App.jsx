import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CodeDemo from './components/CodeDemo';
import Features from './components/Features';
import Widgets from './components/Widgets';
import MultiLanguage from './components/MultiLanguage';
import VoxPub from './components/VoxPub';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import DownloadPortal from './components/DownloadPortal';
import PurchaseSuccess from './components/PurchaseSuccess';
import PurchasePending from './components/PurchasePending';
import './App.css';
import './components/Chatbot.css';

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CodeDemo />
        <Features />
        <Widgets />
        <MultiLanguage />
        <VoxPub />
        <Pricing />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/descargar/:token" element={<DownloadPortal />} />
        <Route path="/compra-exitosa" element={<PurchaseSuccess />} />
        <Route path="/compra-pendiente" element={<PurchasePending />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
