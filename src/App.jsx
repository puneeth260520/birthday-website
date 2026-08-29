/**
 * App.jsx — Switchboard for birthday website pages.
 * ─────────────────────────────────────────────────────────────
 * Controls page-based flow via state (currentPage) with smooth
 * 0.5s CSS cross-fade transitions between pages.
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import BirthdayCandlePage from './components/BirthdayCandlePage';
import HappyBirthdayPage from './components/HappyBirthdayPage';
import ImportantNotePage from './components/ImportantNotePage';
import myImage from './assets/my_image.png';
import birthdaySong from './assets/birthday_song.mp3';
import './App.css';

function getInitialPage() {
  const hash = window.location.hash;
  if (hash === '#page2') return 2;
  if (hash === '#page3') return 3;
  const saved = sessionStorage.getItem('birthday_current_page');
  return saved ? parseInt(saved, 10) : 1;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(getInitialPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.location.hash = `page${page}`;
    sessionStorage.setItem('birthday_current_page', page.toString());
  };

  useEffect(() => {
    // Ensure initial URL hash matches state
    if (!window.location.hash) {
      window.location.hash = `page${currentPage}`;
    }

    const handleHashChange = () => {
      const page = getInitialPage();
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="page-container">
      {/* Page 1: Birthday Candle & Celebrations */}
      <div className={`page-wrapper ${currentPage === 1 ? 'active' : 'inactive'}`}>
        <BirthdayCandlePage 
          onComplete={() => goToPage(2)} 
          isActive={currentPage === 1}
        />
      </div>

      {/* Page 2: Elegant Happy Birthday Photo Greeting */}
      <div className={`page-wrapper ${currentPage === 2 ? 'active' : 'inactive'}`}>
        <HappyBirthdayPage 
          onNext={() => goToPage(3)} 
          onOpenNote={() => goToPage(3)} 
          onBack={() => goToPage(1)}
          isActive={currentPage === 2}
        />
      </div>

      {/* Page 3: Pristine White Important Note Page (Final Page) */}
      <div className={`page-wrapper white-page ${currentPage === 3 ? 'active' : 'inactive'}`}>
        <ImportantNotePage 
          imageSrc={myImage}
          audioSrc={birthdaySong}
          onBack={() => goToPage(2)}
          isActive={currentPage === 3}
        />
      </div>
    </div>
  );
}
