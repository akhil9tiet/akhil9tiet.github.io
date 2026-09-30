(function () {
  'use strict';

  var measurementId = 'G-DPP72KHXQ8';
  var pagePath = window.location.pathname || '/';
  var scrollMilestones = {};
  var scrollEventTimer = null;

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
    return element.getAttribute('data-analytics-name') || element.id || element.getAttribute('aria-label') || element.tagName.toLowerCase();
  }

  function getLinkTarget(link) {
    try {
      var url = new URL(link.href, window.location.href);
      if (url.protocol === 'mailto:' || url.protocol === 'tel:') {
        return url.protocol.slice(0, -1);
      }
      return url.origin === window.location.origin ? url.pathname + url.hash : url.origin;
    } catch (error) {
      return 'invalid';
    }
  }

  function trackClick(event) {
    var clicked = event.target && event.target.nodeType === 3 ? event.target.parentElement : event.target;
    if (!clicked || typeof clicked.closest !== 'function') {
      return;
    }

    if (clicked.closest('[data-analytics-ignore]')) {
      return;
    }

    var control = clicked.closest('a, button, input, select, textarea, [role="button"], [role="slider"], .slider, .resize-handle');
    var target = control || clicked;
    var link = target.matches('a[href]') ? target : target.closest('a[href]');
    var clickKind = link ? 'link' : (control ? 'control' : 'content');
    var parameters = {
      page_path: pagePath,
      click_kind: clickKind,
      element_name: getElementName(target),
      element_type: target.tagName.toLowerCase()
    };
    var role = target.getAttribute('role');
    var className = typeof target.className === 'string' ? target.className : '';
    if (target.id) parameters.element_id = target.id;
    if (role) parameters.element_role = role;
    if (className) parameters.element_class = className.slice(0, 100);

    if (link) {
      parameters.link_target = getLinkTarget(link);
      parameters.click_text = (link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      try {
        var linkUrl = new URL(link.href, window.location.href);
        parameters.outbound = (linkUrl.protocol === 'http:' || linkUrl.protocol === 'https:') && linkUrl.origin !== window.location.origin;
      } catch (error) {
        parameters.outbound = false;
      }
    } else if (control && target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'textarea') {
      parameters.click_text = (target.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    }

    // One site_click event is sent for every document click, including non-link content.
    sendEvent('site_click', parameters);
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

  function recordScrollDepth() {
    var documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0
    );
    var maxScroll = documentHeight - window.innerHeight;
    if (maxScroll <= 0) {
      return;
    }

    var progress = Math.min(100, Math.floor((window.scrollY / maxScroll) * 100));
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

  function trackScroll() {
    if (scrollEventTimer) {
      window.clearTimeout(scrollEventTimer);
    }
    // A trailing check records the final depth even when the last scroll event
    // occurs during throttling or a fast swipe/trackpad gesture.
    scrollEventTimer = window.setTimeout(function () {
      scrollEventTimer = null;
      recordScrollDepth();
    }, 120);
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
  window.addEventListener('resize', trackScroll, { passive: true });
  trackScroll();
  trackVisibleSections();
}());
