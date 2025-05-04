# HubSpot Focus Mode

> “Because nobody likes a sidebar screaming at them to pay more.”

Ever clicked around in HubSpot Starter only to be ambushed by tiny “upgrade” arrows? Us too. It’s even more annoying to explain to a client, “Why do I see it then?” …because HubSpot. They’re still great, but they do love an upsell. So we built a little Chrome extension that quietly hides all that noise.

---

## Why This Exists

- **Stop the Upsell Hype**  
  HubSpot’s menu is like that overly eager friend always trying to buy rounds—helpful sometimes, but distracting when you just want to work. We yank out every “upgrade” link and arrow from the navbar so you can focus.

- **Focus Mode**  
  One click in the toolbar and all upgrade‑only features vanish. No more clutter. No more confusion.

---

## 📦 What’s Inside

- **`manifest.json`**  
  Configures the content script (`content.js`) 

- **`content.js`**  
  - Scans for any links or buttons that lead to `/pricing/` or `/upgrade`  
  - Tags them with `.hidden-by-menu-hider` and sets `display: none`  
  - Watches HubSpot’s React injections & SPA navigation and re‑hides on the fly

- **Popup UI**  
  - `popup.html` + `popup.js` + `styles.css`  
  - A slick on/off **Focus Mode** switch  
  - A **Reload** button with spinner  
  - Credit to **Design Thynk** (because coffee breaks matter)
