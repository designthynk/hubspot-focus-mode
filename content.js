(function() {
    // your selectors / IDs
    const linkSelectors = ['a[href*="/pricing/"]','a[href*="/upgrade"]'];
    const toggleIds     = ['marketing-toggle'];
  
    let isEnabled = true;
  
    // Read initial on/off state
    chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
      isEnabled = enabled;
      applyCurrentState();
    });
  
    // Listen for toggle flips from popup
    chrome.runtime.onMessage.addListener(msg => {
      if (msg.action === 'setEnabled') {
        isEnabled = msg.enabled;
        applyCurrentState();
      }
    });
  
    // Core logic: either hide or unhide
    function applyCurrentState() {
      if (isEnabled) hideLockedItems();
      else unhideAll();
    }
  
    // Hide matching items and tag them for later
    function hideLockedItems() {
      // pricing/upgrade links
      linkSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          const target = el.closest('li') || el;
          target.style.display = 'none';
          target.classList.add('hidden-by-menu-hider');
        });
      });
  
      // toggle buttons by ID
      toggleIds.forEach(id => {
        const btn = document.querySelector(`[data-test-id="${id}"], #${id}`);
        if (!btn) return;
        const target = btn.closest('li') || btn;
        target.style.display = 'none';
        target.classList.add('hidden-by-menu-hider');
      });
    }
  
    // Undo all hiding
    function unhideAll() {
      document.querySelectorAll('.hidden-by-menu-hider').forEach(el => {
        el.style.display = '';
        el.classList.remove('hidden-by-menu-hider');
      });
    }
  
    // Observe dynamic DOM changes
    const observer = new MutationObserver(() => {
      if (isEnabled) hideLockedItems();
    });
    observer.observe(document.body, { childList:true, subtree:true });
  
    // SPA navigation hooks
    ['pushState','replaceState'].forEach(evt => {
      const orig = history[evt];
      history[evt] = function() {
        const ret = orig.apply(this, arguments);
        setTimeout(() => { if (isEnabled) hideLockedItems(); }, 300);
        return ret;
      };
    });
    window.addEventListener('popstate', () => {
      setTimeout(() => { if (isEnabled) hideLockedItems(); }, 300);
    });
  })();