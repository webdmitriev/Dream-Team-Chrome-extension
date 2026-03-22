import { useEffect, useState } from "react";

export default function Links() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customLinks"));

    if (saved) {
      setLinks(saved);
    } else {
      const defaultLinks = [
        { name: "YouTube", url: "https://youtube.com" },
        { name: "GitHub", url: "https://github.com/webdmitriev/" },
        { name: "Gmail", url: "https://mail.google.com" }
      ];
      setLinks(defaultLinks);
    }
  }, []);

  return (
    <div className="links-grid">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank">
          {link.name}
        </a>
      ))}
    </div>
  );
}