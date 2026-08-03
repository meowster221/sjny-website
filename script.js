/* ==========================================================================
   SJNY Construction Inc.  v3

   EDITING THE PROJECT GALLERY
   Each entry below is one photograph. To change a caption, edit the
   text. To add a project, drop the photo into the assets folder, copy
   a block and fill in the fields. "cat" controls which category filter
   shows it on the Work page; "home: true" features it on the homepage.
   Locations and summaries are placeholders. Correct them freely.
   ========================================================================== */

const WORKS = [
  { image: "assets/porch-stone.jpg", cat: "Exteriors", home: true, title: "Stone Porch and Railings", location: "Whitestone, Queens", summary: "Natural stone veneer, rebuilt steps and new iron railings for a full front-entry reconstruction." },
  { image: "assets/bath-marble.jpg", cat: "Kitchens and Baths", home: true, title: "Marble Primary Bath", location: "Manhattan", summary: "Full gut renovation in large-format marble with brass fittings and a frameless glass enclosure." },
  { image: "assets/terrace-steps.jpg", cat: "Concrete and Pavers", home: true, title: "Terraced Garden Entry", location: "Staten Island", summary: "Multi-level paver terrace with brick sitting walls, planted borders and stone treads." },
  { image: "assets/kitchen-white.jpg", cat: "Kitchens and Baths", title: "White Shaker Kitchen", location: "Queens", summary: "Complete kitchen renovation with stone counters, tile backsplash and stainless appliances." },
  { image: "assets/brownstone-restoration.webp", cat: "Facades and Roofing", home: true, title: "Brownstone Restoration", location: "Harlem, Manhattan", summary: "Landmark-quality facade restoration with rebuilt arches and recut sandstone detail." },
  { image: "assets/stone-steps-door.jpg", cat: "Exteriors", title: "Fieldstone Stoop", location: "Staten Island", summary: "Entry steps rebuilt in natural fieldstone with bluestone treads and painted rail posts." },
  { image: "assets/school-facade.jpg", cat: "Facades and Roofing", title: "Five-Story School Facade", location: "Borough Park, Brooklyn", summary: "New brick facade delivered on schedule along an occupied street front." },
  { image: "assets/living-room.jpg", cat: "Interiors", home: true, title: "Main Floor Renovation", location: "Queens", summary: "Rebuilt living floor with new oak flooring, fireplace surround and millwork throughout." },
  { image: "assets/paver-drive.jpg", cat: "Concrete and Pavers", title: "Paver Driveway", location: "Staten Island", summary: "Slate-tone paver driveway laid over a compacted, engineered base." },
  { image: "assets/local-law-11.jpg", cat: "Facades and Roofing", title: "Local Law 11 Facade Cycle", location: "Upper Manhattan", summary: "Facade repair program under FISP, completed with tenants in place." },
  { image: "assets/kitchen-custom.webp", cat: "Kitchens and Baths", home: true, title: "Custom Kitchen Build", location: "Long Island", summary: "Custom cabinetry, honed stone and a fluted island built to the owner's design." },
  { image: "assets/stone-wall-rail.jpg", cat: "Exteriors", title: "Stone Knee Wall and Stair", location: "Long Island", summary: "Stone veneer knee wall with new steps along a rebuilt side entry." },
  { image: "assets/parapet-wall.webp", cat: "Facades and Roofing", title: "Parapet Reconstruction", location: "The Bronx", summary: "Parapet rebuilding and coping replacement across an occupied six-story complex." },
  { image: "assets/walkway-entry.jpg", cat: "Concrete and Pavers", title: "Entry Walk and Steps", location: "Staten Island", summary: "Paver walkway and stone-faced steps running to the front door." },
  { image: "assets/interior-renovation.webp", cat: "Interiors", title: "Full Interior Renovation", location: "Queens", summary: "Gut renovation finished in hardwood with new millwork and restored ceiling medallions." },
  { image: "assets/concrete-drive.jpg", cat: "Concrete and Pavers", home: true, title: "Concrete Drive with Paver Border", location: "Whitestone, Queens", summary: "New concrete driveway framed in pavers and graded for proper drainage." },
  { image: "assets/roof-finish.webp", cat: "Facades and Roofing", title: "Flat Roof Replacement", location: "Queens", summary: "Complete tear-off and installation of a new flat roofing system with corrected drainage." },
  { image: "assets/balustrade-house.jpg", cat: "Exteriors", title: "Brick and Precast Residence", location: "Mill Basin, Brooklyn", summary: "Brick facade with precast surrounds and a restored porch balustrade." },
  { image: "assets/stucco-deck.jpg", cat: "Exteriors", title: "Stucco Facade and Deck", location: "Brooklyn", summary: "New stucco facade with restored window surrounds and a rear deck rebuilt in composite." },
  { image: "assets/hillside-entry.jpg", cat: "Exteriors", home: true, title: "Hillside Entry and Retaining Walls", location: "Westchester County", summary: "Stone veneer walls, new steps and iron railings taking a hillside entry up to the porch." },
  { image: "assets/sidewalk-replacement.webp", cat: "Concrete and Pavers", title: "Sidewalk Replacement", location: "Flushing, Queens", summary: "Full sidewalk replacement that removed the DOT violation and closed the record." },
  { image: "assets/commercial-corner.jpg", cat: "Exteriors", title: "Commercial Ground-Up Build", location: "Queens", summary: "Ground-up commercial construction carried from foundation to opening day." }
];

/* ==========================================================================
   QUOTE FORM
   GitHub Pages serves static files only and cannot run a mailer, so
   requests post to Web3Forms, which emails them on to whichever address
   is tied to WEB3FORMS_KEY. Any time that request fails, the form falls
   back to opening the visitor's email application with the request
   pre-written.

   Do not point this at send-quote.php. Pages will not execute it: POST
   returns 405 and GET serves the PHP source to the public.
   ========================================================================== */

/* quotes@ is a distribution group, so adding people to it in Zoho is how
   more of the team gets copied. Do not add admin@sjnyconstruction.com here:
   that group only accepts mail from its own members, so anything a visitor
   sends to it is rejected. */
const QUOTE_EMAIL = "quotes@sjnyconstruction.com";
const QUOTE_ENDPOINT = "https://api.web3forms.com/submit";

/* Free key from https://web3forms.com, tied to quotes@sjnyconstruction.com.
   Public by design, so it is safe to keep here in the repository. */
const WEB3FORMS_KEY = "95a9ee05-2213-4c91-82fe-c652dc0d4045";

/* ========================================================================== */

(function () {
  "use strict";

  /* ----- Nav ----- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  }, { passive: true });

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ----- Reveal on scroll ----- */
  const revealed = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealed.forEach(function (el) { observer.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- Quote form ----- */
  const form = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");

  if (form) form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (typeof form.reportValidity === "function" && !form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const sentMessage = "Received. Your request went straight to our team and your quote is on its way.";

    /* Honeypot: humans never see this field. If it is filled, act as though
       the request went through so the bot moves on, and send nothing. */
    if (String(data.get("company") || "").trim()) {
      form.reset();
      status.textContent = sentMessage;
      return;
    }
    data.delete("company");

    if (!name || !phone || !email) {
      status.textContent = "Please provide your name, phone and email so we can reach you.";
      return;
    }

    function mailFallback() {
      const lines = [
        "Name: " + name,
        "Phone: " + phone,
        "Email: " + email,
        "Property address: " + (data.get("address") || "Not provided"),
        "Type of work: " + data.get("service"),
        "",
        "About the project:",
        data.get("details") || "Not provided"
      ];
      const subject = "Estimate request from " + name;
      window.location.href = "mailto:" + QUOTE_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      status.textContent = "Your email application should open with the request prepared. Press send there.";
    }

    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "Estimate request from " + name);
    data.append("from_name", "SJNY Construction website");
    data.append("replyto", email);

    status.textContent = "Sending your request.";
    fetch(QUOTE_ENDPOINT, { method: "POST", body: data })
      .then(function (response) {
        return response.json()
          .catch(function () { return {}; })
          .then(function (result) { return { ok: response.ok, result: result || {} }; });
      })
      .then(function (payload) {
        const sent = payload.result.success === true ||
          (payload.ok && payload.result.success === undefined);
        if (!sent) throw new Error("send failed");
        form.reset();
        status.textContent = sentMessage;
      })
      .catch(mailFallback);
  });

  /* ----- Project gallery ----- */
  const gridHome = document.getElementById("workGrid");
  const gridAll = document.getElementById("workGridAll");
  const lightbox = document.getElementById("lightbox");
  if ((!gridHome && !gridAll) || !lightbox) return;

  const lbImage = document.getElementById("lbImage");
  const lbTitle = document.getElementById("lbTitle");
  const lbLocation = document.getElementById("lbLocation");
  const lbSummary = document.getElementById("lbSummary");
  const lbCount = document.getElementById("lbCount");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbClose = document.getElementById("lbClose");

  let activeList = WORKS;
  let current = 0;
  let lastFocus = null;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function render(index) {
    current = (index + activeList.length) % activeList.length;
    const work = activeList[current];
    lbImage.src = work.image;
    lbImage.alt = work.title + ", " + work.location;
    lbTitle.textContent = work.title;
    lbLocation.textContent = work.location;
    lbSummary.textContent = work.summary;
    lbCount.textContent = pad(current + 1) + " / " + pad(activeList.length);
  }

  function openLightbox(list, index) {
    activeList = list;
    lastFocus = document.activeElement;
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    render(index);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  function buildTiles(host, items) {
    host.innerHTML = "";
    items.forEach(function (work, i) {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.setAttribute("aria-label", work.title + ", " + work.location);
      const img = document.createElement("img");
      img.src = work.image;
      img.alt = "";
      img.loading = i < 4 ? "eager" : "lazy";
      img.decoding = "async";
      const cap = document.createElement("span");
      cap.className = "tile-cap";
      cap.textContent = work.location;
      tile.appendChild(img);
      tile.appendChild(cap);
      tile.addEventListener("click", function () { openLightbox(items, items.indexOf(work)); });
      host.appendChild(tile);
    });
  }

  if (gridHome) {
    buildTiles(gridHome, WORKS.filter(function (w) { return w.home; }));
  }

  if (gridAll) {
    const filters = document.getElementById("filters");
    function applyFilter(cat) {
      const items = cat === "All" ? WORKS : WORKS.filter(function (w) { return w.cat === cat; });
      buildTiles(gridAll, items);
    }
    if (filters) {
      filters.addEventListener("click", function (event) {
        const btn = event.target.closest(".filter-btn");
        if (!btn) return;
        filters.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        applyFilter(btn.dataset.cat);
      });
    }
    applyFilter("All");
  }

  lbPrev.addEventListener("click", function () { render(current - 1); });
  lbNext.addEventListener("click", function () { render(current + 1); });
  lbClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox || event.target.classList.contains("lightbox-stage")) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.classList.contains("is-open")) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") render(current - 1);
      if (event.key === "ArrowRight") render(current + 1);
      if (event.key === "Tab") {
        const focusables = [lbPrev, lbNext, lbClose];
        const active = document.activeElement;
        const position = focusables.indexOf(active);
        if (position === -1) {
          event.preventDefault();
          lbClose.focus();
        } else if (event.shiftKey && position === 0) {
          event.preventDefault();
          focusables[focusables.length - 1].focus();
        } else if (!event.shiftKey && position === focusables.length - 1) {
          event.preventDefault();
          focusables[0].focus();
        }
      }
      return;
    }
    if (event.key === "Escape" && links.classList.contains("is-open")) {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
})();
