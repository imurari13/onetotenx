/* ==========================================================
   1to10X — MOCKUP IMAGES (presentation placeholders)
   Real free-to-use photos from Pexels (hot-linked, no key needed).
   Every image on the site comes from this ONE map — to use your own
   photos later just replace the URLs; nothing else changes.
   If a photo ever fails to load we fall back to a Picsum image, so
   no frame is ever empty.
   Usage:  <img data-mock="podcast-studio" alt="…">
           <div class="episode-art" data-mock="webinar-1">…</div>
   ========================================================== */
(function () {
  const PX = (id, w = 1200) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
  const FALL = (seed, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
  const MOCK = {
    /* podcasts – studio microphones */
    "podcast-studio": PX(3710191), "podcast-guest": PX(270288),
    "podcast-1": PX(2918997, 800), "podcast-2": PX(2097428, 800), "podcast-3": PX(164755, 800),
    /* webinars – online learning / laptop collaboration */
    "webinar-room": PX(8062306), "webinar-1": PX(5862280, 800), "webinar-2": PX(3184635, 800), "webinar-3": PX(1367269, 800),
    /* events – conference halls & audiences */
    "event-hall": PX(1708988), "event-1": PX(1709003, 800), "event-2": PX(1708936, 800), "event-3": PX(1708912, 800),
    /* about / collab / contact – teamwork & partnerships */
    "about-story": PX(3184663), "about-team": PX(1181396), "collab-brand": PX(2182981), "collab-stage": PX(1709001), "contact": PX(8062306)
  };
  window.ONE10X_MOCKS = MOCK;
  const src = k => MOCK[k] || FALL(k);
  const wire = (img, key) => {
    img.src = src(key); img.loading = "lazy"; img.decoding = "async";
    img.onerror = () => { img.onerror = () => { img.style.display = "none"; }; img.src = FALL("1to10x-" + key); };   // never a broken-image icon
  };
  const fill = () => {
    document.querySelectorAll("img[data-mock]").forEach(img => { if (!img.getAttribute("src")) wire(img, img.dataset.mock); });
    document.querySelectorAll(".episode-art[data-mock]").forEach(el => {
      if (el.querySelector("img")) return;
      const img = new Image(); img.alt = ""; wire(img, el.dataset.mock);
      el.classList.add("has-img"); el.prepend(img);
    });
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fill) : fill();
  document.addEventListener("mocks:refresh", fill);
})();
