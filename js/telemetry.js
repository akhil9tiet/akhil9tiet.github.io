(function () {
  'use strict';

  var measurementId = 'G-DPP72KHXQ8';
  var pagePath = window.location.pathname || '/';
  var scrollMilestones = {};
  var lastScrollEvent = 0;

  function loadGoogleAnalytics() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    if (!window.dataLayer.some(function (entry) {
      return entry && entry[0] === 'js';
    })) {
      window.gtag('js', new Date());
    }

    if (!document.querySelector('script[data-site-analytics="ga4"]')) {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      script.dataset.siteAnalytics = 'ga4';
      document.head.appendChild(script);
    }

    if (!window.__siteAnalyticsConfigured) {
      window.gtag('config', measurementId, {
        page_path: pagePath,
        send_page_view: true
      });
      window.__siteAnalyticsConfigured = true;
    }
  }

  function sendEvent(name, parameters) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, parameters || {});
    }
  }

  function getElementName(element) {
    if (!element) {
      return 'unknown';
    }
    return element.id || element.getAttribute('aria-label') || element.tagName.toLowerCase();
  }

  function getLinkTarget(link) {
    try {
      var url = new URL(link.href, window.location.href);
      return url.origin === window.location.origin ? url.pathname + url.hash : url.origin;
    } catch (error) {
      return 'invalid';
    }
  }

  function trackClick(event) {
    var target = event.target.closest('a, button, input, select, textarea, [role="button"], [role="slider"], .slider, .resize-handle');
    if (!target) {
      return;
    }

    var parameters = {
      page_path: pagePath,
      element_name: getElementName(target),
      element_type: target.tagName.toLowerCase()
    };

    if (target.matches('a[href]')) {
      parameters.link_target = getLinkTarget(target);
      parameters.link_text = (target.textContent || '').trim().slice(0, 80);
      sendEvent('link_click', parameters);
      return;
    }

    if (target.matches('.slider, input[type="range"], [role="slider"]')) {
      parameters.control = getElementName(target);
      sendEvent('slide_interaction', parameters);
      return;
    }

    sendEvent('ui_click', parameters);
  }

  function trackInput(event) {
    var target = event.target;
    if (target.matches('input[type="range"], [role="slider"]')) {
      sendEvent('slide_change', {
        page_path: pagePath,
        element_name: getElementName(target)
      });
    }
  }

  function trackScroll() {
    var now = Date.now();
    if (now - lastScrollEvent < 250) {
      return;
    }
    lastScrollEvent = now;

    var documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (documentHeight <= 0) {
      return;
    }

    var progress = Math.round((window.scrollY / documentHeight) * 100);
    [25, 50, 75, 90, 100].forEach(function (milestone) {
      if (progress >= milestone && !scrollMilestones[milestone]) {
        scrollMilestones[milestone] = true;
        sendEvent('scroll_depth', {
          page_path: pagePath,
          percent_scrolled: milestone
        });
      }
    });
  }

  function trackVisibleSections() {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.analyticsSeen) {
          entry.target.dataset.analyticsSeen = 'true';
          sendEvent('section_view', {
            page_path: pagePath,
            section_name: entry.target.id || entry.target.className || entry.target.tagName.toLowerCase()
          });
        }
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('main section, section[id], [data-analytics-section]').forEach(function (section) {
      observer.observe(section);
    });
  }

  loadGoogleAnalytics();
  document.addEventListener('click', trackClick, true);
  document.addEventListener('input', trackInput, true);
  window.addEventListener('scroll', trackScroll, { passive: true });
  trackVisibleSections();
}());
