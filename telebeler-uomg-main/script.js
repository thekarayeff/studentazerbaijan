// Theme mode
const themeButtons = document.querySelectorAll(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

const getSavedTheme = () => {
  try {
    return localStorage.getItem("theme-mode");
  } catch (error) {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem("theme-mode", theme);
  } catch (error) {
    // localStorage bloklanarsa səssiz davam et
  }
};

const applyTheme = (theme) => {
  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(`theme-${theme}`);

  if (themeMeta) {
    themeMeta.setAttribute("content", theme === "light" ? "#eef3ff" : "#0f172a");
  }

  themeButtons.forEach((button) => {
    const icon = button.querySelector("i");
    const text = button.querySelector("span");
    if (icon) icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    if (text) text.textContent = theme === "light" ? "Light" : "Dark";
  });
};

const initialTheme = (() => {
  const saved = getSavedTheme();
  if (saved === "light" || saved === "dark") return saved;
  return document.body.classList.contains("uomg-page") ? "light" : "dark";
})();

applyTheme(initialTheme);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
});

// Scroll reklamlar (index)
const adTrack = document.getElementById("ad-track");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const initAds = async () => {
  if (!adTrack) return;

  try {
    const rawIds = adTrack.dataset.adIds || "";
    const selectedIds = rawIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const response = await fetch("./ads.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Ads JSON oxunmadı");

    const data = await response.json();
    const ads = Array.isArray(data?.ads) ? data.ads : [];
    const list =
      selectedIds.length > 0
        ? selectedIds.map((id) => ads.find((ad) => ad.id === id)).filter(Boolean)
        : ads;

    if (list.length === 0) {
      adTrack.parentElement?.parentElement?.classList.add("hidden");
      return;
    }

    const cards = list
      .map(
        (ad) => `
        <a class="ad_item" href="${escapeHtml(ad.link || "#")}">
          <img src="${escapeHtml(ad.image || "./img/university.jpg")}" alt="${escapeHtml(ad.title || "Reklam")}">
          <div class="ad_item_text">
            <p class="ad_tag">${escapeHtml(ad.tag || "Elan")}</p>
            <h3>${escapeHtml(ad.title || "Başlıq")}</h3>
            <p>${escapeHtml(ad.text || "")}</p>
          </div>
        </a>
      `
      )
      .join("");

    adTrack.innerHTML = cards + cards;
    setupAdInteraction();
  } catch (error) {
    adTrack.parentElement?.parentElement?.classList.add("hidden");
  }
};

const setupAdInteraction = () => {
  if (!adTrack) return;
  const marquee = adTrack.parentElement;
  if (!marquee) return;
  const prevBtn = document.getElementById("ad-prev");
  const nextBtn = document.getElementById("ad-next");

  let autoPaused = false;
  let dragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = 0;
  let suppressClick = false;
  let rafId = null;

  const halfTrack = () => adTrack.scrollWidth / 2;

  const normalizeLoop = () => {
    const limit = halfTrack();
    if (!limit) return;

    if (marquee.scrollLeft >= limit) marquee.scrollLeft -= limit;
    if (marquee.scrollLeft < 0) marquee.scrollLeft += limit;
  };

  const tick = () => {
    if (!autoPaused && !dragging) {
      marquee.scrollLeft += 0.45;
      normalizeLoop();
    }
    rafId = requestAnimationFrame(tick);
  };

  const onPointerDown = (event) => {
    dragging = true;
    autoPaused = true;
    moved = 0;
    startX = event.clientX;
    startScrollLeft = marquee.scrollLeft;
    marquee.classList.add("dragging");
    if (marquee.setPointerCapture) marquee.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    moved = Math.max(moved, Math.abs(delta));
    marquee.scrollLeft = startScrollLeft - delta;
    normalizeLoop();
  };

  const onPointerUp = (event) => {
    if (!dragging) return;
    dragging = false;
    marquee.classList.remove("dragging");
    if (marquee.releasePointerCapture) marquee.releasePointerCapture(event.pointerId);
    if (moved > 8) {
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false;
      }, 220);
    }
    setTimeout(() => {
      autoPaused = false;
    }, 1200);
  };

  marquee.addEventListener("mouseenter", () => {
    autoPaused = true;
  });

  marquee.addEventListener("mouseleave", () => {
    if (!dragging) autoPaused = false;
  });

  marquee.addEventListener("pointerdown", onPointerDown);
  marquee.addEventListener("pointermove", onPointerMove);
  marquee.addEventListener("pointerup", onPointerUp);
  marquee.addEventListener("pointercancel", onPointerUp);
  marquee.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) < 1 && Math.abs(event.deltaX) < 1) return;
    autoPaused = true;
    marquee.scrollLeft += event.deltaY + event.deltaX;
    normalizeLoop();
    clearTimeout(marquee.__wheelTimer);
    marquee.__wheelTimer = setTimeout(() => {
      autoPaused = false;
    }, 800);
    event.preventDefault();
  }, { passive: false });

  adTrack.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  const step = 280;
  prevBtn?.addEventListener("click", () => {
    autoPaused = true;
    marquee.scrollLeft -= step;
    normalizeLoop();
    setTimeout(() => {
      autoPaused = false;
    }, 900);
  });
  nextBtn?.addEventListener("click", () => {
    autoPaused = true;
    marquee.scrollLeft += step;
    normalizeLoop();
    setTimeout(() => {
      autoPaused = false;
    }, 900);
  });

  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(tick);
};

initAds();

// Mobil menu
const bars = document.querySelector(".h_bar");
const hamburgerMenu = document.querySelector(".mobile");
const close = document.querySelector(".close");

const toggleMenu = (isOpen) => {
  if (!hamburgerMenu) return;
  hamburgerMenu.classList.toggle("opens", isOpen);
  document.body.classList.toggle("mobile-open", isOpen);
};

if (bars && hamburgerMenu && close) {
  bars.addEventListener("click", () => {
    toggleMenu(true);
  });

  close.addEventListener("click", () => {
    toggleMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") toggleMenu(false);
  });
}

/// Loading ekranı
const loadingTime = 2; // saniyə

let progress = 0;
const bar = document.getElementById("progress-bar");
const percentText = document.getElementById("percent");

const intervalTime = (loadingTime * 1000) / 100; // hər 1% üçün vaxt

let timer = setInterval(() => {
  progress++;
  if (bar) bar.style.width = progress + "%";
  if (percentText) percentText.innerText = progress + "%";

  if (progress >= 100) {
    clearInterval(timer);
    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "none";
  }
}, intervalTime);
