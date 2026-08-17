import React, { useEffect, useState } from 'react';
import {
  getSiteStyles,
  saveSiteStyles,
} from '../utils/siteStylesStorage';

export default function SiteStylesManager() {
  const [styles, setStyles] = useState([]);

  const [domain, setDomain] = useState('');
  const [css, setCss] = useState('');

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadStyles();
  }, []);

  async function loadStyles() {
    const savedStyles = await getSiteStyles();
    setStyles(savedStyles);
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!domain.trim() || !css.trim()) {
      return;
    }

    const normalizedDomain = normalizeDomain(domain);

    let updatedStyles;

    if (editingId) {
      updatedStyles = styles.map((item) => {
        if (item.id !== editingId) {
          return item;
        }

        return {
          ...item,
          domain: normalizedDomain,
          css,
        };
      });
    } else {
      const newStyle = {
        id: crypto.randomUUID(),
        domain: normalizedDomain,
        css,
        enabled: true,
      };

      updatedStyles = [
        ...styles,
        newStyle,
      ];
    }

    setStyles(updatedStyles);
    await saveSiteStyles(updatedStyles);

    resetForm();
  }

  async function handleDelete(id) {
    const updatedStyles = styles.filter(
      (item) => item.id !== id
    );

    setStyles(updatedStyles);

    await saveSiteStyles(updatedStyles);
  }

  async function toggleStyle(id) {
    const updatedStyles = styles.map((item) => {
      if (item.id !== id) {
        return item;
      }

      return {
        ...item,
        enabled: !item.enabled,
      };
    });

    setStyles(updatedStyles);

    await saveSiteStyles(updatedStyles);
  }

  function editStyle(item) {
    setEditingId(item.id);
    setDomain(item.domain);
    setCss(item.css);
  }

  function resetForm() {
    setEditingId(null);
    setDomain('');
    setCss('');
  }

  function normalizeDomain(value) {
    return value
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');
  }

  return (
    <div className="site-styles-manager">

      <div className="site-styles-manager__header">
        <h2>
          🎨 Site Styles
        </h2>

        <p>
          Add custom CSS rules for specific websites.
        </p>
      </div>

      <form
        className="site-styles-manager__form"
        onSubmit={handleSave}
      >

        <div className="form-group">
          <label>
            Website
          </label>

          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
          />
        </div>

        <div className="form-group">
          <label>
            CSS
          </label>

          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder={`.some-element {
  display: none !important;
}`}
            rows={12}
          />
        </div>

        <div className="site-styles-manager__actions">

          <button type="submit">
            {editingId ? 'Save changes' : 'Add style'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      <div className="site-styles-manager__list">

        {styles.length === 0 && (
          <div className="site-styles-manager__empty">
            No site styles yet.
          </div>
        )}

        {styles.map((item) => (
          <div
            key={item.id}
            className="site-styles-manager__item"
          >

            <div className="site-styles-manager__item-info">

              <div className="site-styles-manager__domain">
                {item.domain}
              </div>

              <div className="site-styles-manager__preview">
                {item.css}
              </div>

            </div>

            <div className="site-styles-manager__item-actions">

              <button
                type="button"
                onClick={() => toggleStyle(item.id)}
              >
                {item.enabled ? 'Disable' : 'Enable'}
              </button>

              <button
                type="button"
                onClick={() => editStyle(item)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}