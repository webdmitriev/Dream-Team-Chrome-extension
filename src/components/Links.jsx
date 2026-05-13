import youtube from "../assets/img/icon-youtube.svg";
import github from "../assets/img/icon-github.svg";
import gmail from "../assets/img/icon-gmail.svg";
import deepseek from "../assets/img/icon-deepseek.svg";
import bitrix24 from "../assets/img/icon-bitrix24.svg";
import regru from "../assets/img/icon-regru.svg";
import figma from "../assets/img/icon-figma.svg";

import tiny from "../assets/img/icon-tiny.png";
import beget from "../assets/img/icon-beget.png";
import diskYandex from "../assets/img/icon-disk-yandex.png";
import telemostYandex from "../assets/img/icon-telemost-yandex.png";
import typograf from "../assets/img/icon-typograf.png";

export default function Links() {
  const defaultLinks = [
    { name: "YouTube", url: "https://youtube.com", icon: youtube },
    { name: "GitHub", url: "https://github.com/webdmitriev/", icon: github },
    { name: "Gmail", url: "https://mail.google.com", icon: gmail },
    { name: "Deepseek", url: "https://chat.deepseek.com/", icon: deepseek },
    { name: "Bitrix24", url: "https://bitrix.dreamteamcompany.ru/stream/", icon: bitrix24 },
    { name: "Regru", url: "https://www.reg.ru/user/account/", icon: regru },
    { name: "Figma", url: "https://www.figma.com/design/1IdnIbq1YMWl9ySe2hHMwe/Dream-Team?node-id=0-1&t=sXOAMLhX1X7qzI3V-1", icon: figma },
    { name: "Disk Yandex", url: "https://disk.yandex.ru/client/disk", icon: diskYandex },
    { name: "Beget", url: "https://beget.com/", icon: beget },
    { name: "Telemost Yandex", url: "https://telemost.yandex.ru/", icon: telemostYandex },
  ];

  return (
    <div className="links df-fs-fs w-100p">
      {defaultLinks.map((link) => (
        <a key={link.url} href={link.url} target="_blank" className="link df-ce-ce">
          {link.icon ? <img src={link.icon} alt={link.name} title={link.name} /> : null}
        </a>
      ))}
    </div>
  );
}