console.log('[Dream Team] Site Styles loaded');

console.log('🔥 DREAM TEAM SITE STYLES: LOADED');

document.documentElement.setAttribute(
  'data-dream-team-styles',
  'loaded'
);

async function applySiteStyles() {
  const hostname = window.location.hostname
    .replace(/^www\./, '');

  console.log('[Dream Team] Current site:', hostname);

  const result = await chrome.storage.local.get('siteStyles');

  const styles = result.siteStyles || [];

  const matchingStyles = styles.filter((item) => {
    if (!item.enabled) {
      return false;
    }

    return (
      hostname === item.domain ||
      hostname.endsWith(`.${item.domain}`)
    );
  });

  if (!matchingStyles.length) {
    return;
  }

  const styleElement = document.createElement('style');

  styleElement.id = 'dream-team-site-styles';

  styleElement.textContent = matchingStyles
    .map((item) => item.css)
    .join('\n');

  (document.head || document.documentElement).appendChild(
    styleElement
  );

  console.log(
    '[Dream Team] CSS applied:',
    matchingStyles.length
  );
}

applySiteStyles();