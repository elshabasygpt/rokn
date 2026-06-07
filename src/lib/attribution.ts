export function initAttribution() {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const currentUrl = window.location.pathname;
  const referrer = document.referrer;
  
  const getUtm = (param: string) => urlParams.get(param) || null;
  
  const source = getUtm('utm_source');
  const medium = getUtm('utm_medium');
  const campaign = getUtm('utm_campaign');
  
  // Only update last touch if there are explicit marketing signals or it's a cross-origin referrer
  const hasMarketingParams = source || medium || campaign;
  const isExternalReferrer = referrer && !referrer.includes(window.location.hostname);
  
  if (hasMarketingParams || isExternalReferrer) {
    let sourceValue = source || 'direct';
    if (!source && isExternalReferrer) {
      try {
        sourceValue = new URL(referrer).hostname;
      } catch {
        sourceValue = referrer;
      }
    }

    const sessionData = {
      source: sourceValue,
      medium: medium || 'referral',
      campaign: campaign || 'none',
      landing_page: currentUrl,
      referrer: referrer || 'direct',
      timestamp: new Date().toISOString()
    };

    // First touch (only set if not exists)
    if (!localStorage.getItem('first_touch_attribution')) {
      localStorage.setItem('first_touch_attribution', JSON.stringify(sessionData));
    }

    // Last touch (always update on new campaign/referrer session)
    localStorage.setItem('last_touch_attribution', JSON.stringify(sessionData));
  } else if (!localStorage.getItem('first_touch_attribution')) {
    // Direct visit without params/external referrer
    const directData = {
      source: 'direct',
      medium: 'none',
      campaign: 'none',
      landing_page: currentUrl,
      referrer: 'none',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('first_touch_attribution', JSON.stringify(directData));
    localStorage.setItem('last_touch_attribution', JSON.stringify(directData));
  }
}

export function getAttributionData() {
  try {
    const firstTouch = localStorage.getItem('first_touch_attribution');
    const lastTouch = localStorage.getItem('last_touch_attribution');
    return {
      first_touch: firstTouch ? JSON.parse(firstTouch) : null,
      last_touch: lastTouch ? JSON.parse(lastTouch) : null
    };
  } catch (e) {
    return null;
  }
}
