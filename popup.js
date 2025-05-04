const toggle = document.getElementById("enableToggle")
const reloadBtn = document.getElementById("reload")

// 1️⃣ Initialize toggle from synced setting (default ON)
chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
  toggle.checked = enabled
})

// 2️⃣ When toggle changes, save and notify all HubSpot tabs
toggle.addEventListener("change", () => {
  const enabled = toggle.checked

  // Add subtle animation when toggling
  if (enabled) {
    toggle.parentElement.classList.add("toggled-on")
    setTimeout(() => {
      toggle.parentElement.classList.remove("toggled-on")
    }, 1000)
  }

  chrome.storage.sync.set({ enabled })
  chrome.tabs.query({ url: "*://*.hubspot.com/*" }, (tabs) => {
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { action: "setEnabled", enabled })
    }
  })
})

// 3️⃣ Reload button behaviour (with loading state)
reloadBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id
    if (!tabId) return

    // Show loading state
    const origText = reloadBtn.textContent
    reloadBtn.textContent = ""
    reloadBtn.classList.add("loading")
    reloadBtn.disabled = true

    chrome.tabs.reload(tabId, {}, () => {
      setTimeout(() => {
        reloadBtn.textContent = origText
        reloadBtn.classList.remove("loading")
        reloadBtn.disabled = false
      }, 1000)
    })
  })
})


document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    .toggled-on .slider:before {
      box-shadow: 0 0 0 2px rgba(52, 199, 89, 0.4);
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --background: #1c1c1e;
        --card-background: #2c2c2e;
        --text-primary: #ffffff;
        --text-secondary: #aeaeb2;
        --border: #3a3a3c;
        --toggle-bg: #636366;
      }
      
      body {
        background-color: #1c1c1e;
      }
      
      button {
        background-color: #3a3a3c;
      }
      
      button:hover {
        background-color: #48484a;
      }
    }
  </style>
`,
)
