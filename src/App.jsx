import React, { useState } from 'react';

import Clock from "./components/Clock";
import Cities from "./components/Cities";
import Sites from "./components/Sites";
import Translate from "./components/Translate";
import Search from "./components/Search";
import Links from "./components/Links";

import Modal from './components/Modal';
import ImageOptimizer from './components/ImageOptimizer';

// pictures
import bg1 from "./assets/img/dream-team-bg-01.jpg";
import bg2 from "./assets/img/dream-team-bg-02.jpg";
const backgrounds = [bg1, bg2];

// get random num image from array
import { getRandomItem } from "./utils/getRandomItem";
const randomBg = getRandomItem(backgrounds);

export default function App() {
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  return (
    <div className="container">
      <div className="background" style={{backgroundImage: `url(${randomBg})`}}></div>

      <div className="dream-team df-sp-fs w-100p">
        <div className="dream-team__left">
          <Cities />
          <Clock />
          <Sites />
        </div>
        <div className="dream-team__right">
          <Translate />
          <Links />
          <div className="tools-grid">
            <button onClick={() => setIsOptimizerOpen(true)} className="tool-card">🖼️ Optimize Images</button>
          </div>
        </div>
        <Search />

        {/* Модалка с оптимизатором */}
        <Modal isOpen={isOptimizerOpen} onClose={() => setIsOptimizerOpen(false)}>
          <ImageOptimizer />
        </Modal>
      </div>
    </div>
  );
}