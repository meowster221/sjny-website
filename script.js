/* ==========================================================================
   SJNY Construction Inc.  v2

   EDITING THE PROJECT REEL
   Each entry below is one photograph in the flowing reel. To change a
   caption, edit the text. To add a project, drop the photo into the
   assets folder, copy a block and fill in the four fields.
   Locations and summaries are placeholders. Correct them freely.
   ========================================================================== */

const WORKS = [
  { image: "assets/porch-stone.jpg", ratio: 1.5, title: "Stone Porch and Railings", location: "Whitestone, Queens", summary: "Natural stone veneer, rebuilt steps and new iron railings for a full front-entry reconstruction." },
  { image: "assets/bath-marble.jpg", ratio: 1.3278, title: "Marble Primary Bath", location: "Manhattan", summary: "Full gut renovation in large-format marble with brass fittings and a frameless glass enclosure." },
  { image: "assets/terrace-steps.jpg", ratio: 0.6667, title: "Terraced Garden Entry", location: "Staten Island", summary: "Multi-level paver terrace with brick sitting walls, planted borders and stone treads." },
  { image: "assets/kitchen-white.jpg", ratio: 1.3422, title: "White Shaker Kitchen", location: "Queens", summary: "Complete kitchen renovation with stone counters, tile backsplash and stainless appliances." },
  { image: "assets/brownstone-restoration.webp", ratio: 1.7778, title: "Brownstone Restoration", location: "Harlem, Manhattan", summary: "Landmark-quality facade restoration with rebuilt arches and recut sandstone detail." },
  { image: "assets/stone-steps-door.jpg", ratio: 0.6667, title: "Fieldstone Stoop", location: "Staten Island", summary: "Entry steps rebuilt in natural fieldstone with bluestone treads and painted rail posts." },
  { image: "assets/school-facade.jpg", ratio: 0.6667, title: "Five-Story School Facade", location: "Borough Park, Brooklyn", summary: "New brick facade delivered on schedule along an occupied street front." },
  { image: "assets/living-room.jpg", ratio: 1.3389, title: "Main Floor Renovation", location: "Queens", summary: "Rebuilt living floor with new oak flooring, fireplace surround and millwork throughout." },
  { image: "assets/paver-drive.jpg", ratio: 0.6667, title: "Paver Driveway", location: "Staten Island", summary: "Slate-tone paver driveway laid over a compacted, engineered base." },
  { image: "assets/local-law-11.jpg", ratio: 0.5109, title: "Local Law 11 Facade Cycle", location: "Upper Manhattan", summary: "Facade repair program under FISP, completed with tenants in place." },
  { image: "assets/kitchen-custom.webp", ratio: 1.3466, title: "Custom Kitchen Build", location: "Long Island", summary: "Custom cabinetry, honed stone and a fluted island built to the owner's design." },
  { image: "assets/stone-wall-rail.jpg", ratio: 0.6667, title: "Stone Knee Wall and Stair", location: "Long Island", summary: "Stone veneer knee wall with new steps along a rebuilt side entry." },
  { image: "assets/parapet-wall.webp", ratio: 0.75, title: "Parapet Reconstruction", location: "The Bronx", summary: "Parapet rebuilding and coping replacement across an occupied six-story complex." },
  { image: "assets/walkway-entry.jpg", ratio: 0.6667, title: "Entry Walk and Steps", location: "Staten Island", summary: "Paver walkway and stone-faced steps running to the front door." },
  { image: "assets/interior-renovation.webp", ratio: 1.3299, title: "Full Interior Renovation", location: "Queens", summary: "Gut renovation finished in hardwood with new millwork and restored ceiling medallions." },
  { image: "assets/concrete-drive.jpg", ratio: 1.5, title: "Concrete Drive with Paver Border", location: "Whitestone, Queens", summary: "New concrete driveway framed in pavers and graded for proper drainage." },
  { image: "assets/roof-finish.webp", ratio: 0.5627, title: "Flat Roof Replacement", location: "Queens", summary: "Complete tear-off and installation of a new flat roofing system with corrected drainage." },
  { image: "assets/balustrade-house.jpg", ratio: 1.5, title: "Brick and Precast Residence", location: "Mill Basin, Brooklyn", summary: "Brick facade with precast surrounds and a restored porch balustrade." },
  { image: "assets/stucco-deck.jpg", ratio: 0.7177, title: "Stucco Facade and Deck", location: "Brooklyn", summary: "New stucco facade with restored window surrounds and a rear deck rebuilt in composite." },
  { image: "assets/hillside-entry.jpg", ratio: 1.5015, title: "Hillside Entry and Retaining Walls", location: "Westchester County", summary: "Stone veneer walls, new steps and iron railings taking a hillside entry up to the porch." },
  { image: "assets/sidewalk-replacement.webp", ratio: 0.75, title: "Sidewalk Replacement", location: "Flushing, Queens", summary: "Full sidewalk replacement that removed the DOT violation and closed the record." },
  { image: "assets/commercial-corner.jpg", ratio: 1.5, title: "Commercial Ground-Up Build", location: "Queens", summary: "Ground-up commercial construction carried from foundation to opening day." }
];

/* ==========================================================================
   QUOTE FORM
   GitHub Pages serves static files only and cannot run a mailer, so
   requests post to Web3Forms, which emails them on to whichever address
   is tied to WEB3FORMS_KEY. Until that key is filled in, and any time the
   request fails, the form falls back to opening the visitor's email
   application with the request pre-written.
   ========================================================================== */

const QUOTE_EMAIL = "danny@sjnyconstruction.com";
const QUOTE_EMAIL_CC = "admin@sjnyconstruction.com";
const QUOTE_ENDPOINT = "https://api.web3forms.com/submit";

/* Get a free key at https://web3forms.com by entering the address that
   should receive estimate requests. The key is public by design, so it is
   safe to keep here in the repository. */
const WEB3FORMS_KEY = "PASTE-YOUR-WEB3FORMS-ACCESS-KEY-HERE";

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
        "?cc=" + encodeURIComponent(QUOTE_EMAIL_CC) +
        "&subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      status.textContent = "Your email application should open with the request prepared. Press send there.";
    }

    /* No key filled in yet, so there is nothing to post to. */
    if (!WEB3FORMS_KEY || WEB3FORMS_KEY.indexOf("PASTE") === 0) {
      mailFallback();
      return;
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

  /* ----- Flowing project reel ----- */
  const stripsHost = document.getElementById("strips");
  if (!stripsHost || !WORKS.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buildStrip(items, reverse) {
    const strip = document.createElement("div");
    strip.className = "strip";
    const track = document.createElement("div");
    track.className = "strip-track";
    let suppressClick = false;

    function addCards(ariaHidden) {
      items.forEach(function (work) {
        const index = WORKS.indexOf(work);
        const card = document.createElement("button");
        card.type = "button";
        card.className = "shot";
        card.dataset.index = String(index);
        card.setAttribute("aria-label", work.title + ", " + work.location);
        if (ariaHidden) {
          card.setAttribute("aria-hidden", "true");
          card.tabIndex = -1;
        }
        const img = document.createElement("img");
        img.src = work.image;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.style.aspectRatio = String(work.ratio);
        img.addEventListener("error", function () {
          // Remove BOTH copies of this card so the two loop halves stay identical
          track.querySelectorAll('[data-index="' + index + '"]').forEach(function (c) { c.remove(); });
        });
        const cap = document.createElement("span");
        cap.className = "shot-cap";
        cap.textContent = work.location;
        card.appendChild(img);
        card.appendChild(cap);
        card.addEventListener("click", function () {
          if (suppressClick) return;
          openLightbox(index);
        });
        track.appendChild(card);
      });
    }

    addCards(false);
    addCards(true); // duplicate pass for the seamless loop

    strip.appendChild(track);

    /* Auto drift plus full manual control. The track moves on a GPU
       transform, never native scroll, so motion stays smooth on phones.
       Drag with mouse or finger; momentum carries after release; the
       reel pauses while you interact and resumes a few seconds later. */
    let paused = false;
    let dragging = false;
    let manualUntil = 0;
    let startX = 0;
    let startOffset = 0;
    let moved = 0;
    let offset = 0;
    let lastX = 0;
    let velocity = 0;
    let inertia = 0;
    let positioned = false;
    const speed = reverse ? -0.8 : 0.8;

    strip.addEventListener("pointerenter", function (event) { if (event.pointerType === "mouse") paused = true; });
    strip.addEventListener("pointerleave", function () { paused = false; });
    strip.addEventListener("focusin", function (event) {
      paused = true;
      strip.scrollLeft = 0; // undo any browser focus scrolling
      const card = event.target.closest(".shot");
      if (card) offset = Math.max(0, card.offsetLeft - 24);
    });
    strip.addEventListener("focusout", function () { paused = false; });

    /* Mouse dragging via pointer events */
    strip.addEventListener("pointerdown", function (event) {
      if (event.pointerType !== "mouse") return;
      dragging = true;
      moved = 0;
      velocity = 0;
      inertia = 0;
      startX = lastX = event.clientX;
      startOffset = offset;
      strip.classList.add("is-dragging");
      if (strip.setPointerCapture) {
        try { strip.setPointerCapture(event.pointerId); } catch (err) {}
      }
    });
    strip.addEventListener("pointermove", function (event) {
      if (!dragging || event.pointerType !== "mouse") return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > moved) moved = Math.abs(dx);
      velocity = event.clientX - lastX;
      lastX = event.clientX;
      offset = startOffset - dx;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      strip.classList.remove("is-dragging");
      inertia = Math.max(-40, Math.min(40, velocity));
      if (moved > 6) {
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 300);
      }
      manualUntil = performance.now() + 2500;
    }
    strip.addEventListener("pointerup", endDrag);
    strip.addEventListener("pointercancel", endDrag);
    window.addEventListener("pointerup", endDrag);

    /* Finger dragging via touch events. Direction-locks on the first
       few pixels: horizontal swipes grab the reel (and preventDefault
       so iOS cannot cancel the gesture), vertical swipes fall through
       to normal page scrolling. */
    let touchActive = false;
    let touchHoriz = null;
    let tStartY = 0;

    strip.addEventListener("touchstart", function (event) {
      const touch = event.touches[0];
      touchActive = true;
      touchHoriz = null;
      moved = 0;
      velocity = 0;
      inertia = 0;
      startX = lastX = touch.clientX;
      tStartY = touch.clientY;
      startOffset = offset;
      manualUntil = performance.now() + 2500;
    }, { passive: true });

    strip.addEventListener("touchmove", function (event) {
      if (!touchActive) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - tStartY;
      if (touchHoriz === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        touchHoriz = Math.abs(dx) > Math.abs(dy);
        if (touchHoriz) dragging = true;
      }
      if (!touchHoriz) return;
      event.preventDefault();
      if (Math.abs(dx) > moved) moved = Math.abs(dx);
      velocity = touch.clientX - lastX;
      lastX = touch.clientX;
      offset = startOffset - dx;
    }, { passive: false });

    function endTouch() {
      if (!touchActive) return;
      touchActive = false;
      if (touchHoriz) endDrag();
      touchHoriz = null;
    }
    strip.addEventListener("touchend", endTouch, { passive: true });
    strip.addEventListener("touchcancel", endTouch, { passive: true });

    strip.addEventListener("wheel", function (event) {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault();
        offset += event.deltaX;
        manualUntil = performance.now() + 2500;
      }
    }, { passive: false });

    function frame() {
      const half = track.scrollWidth / 2;
      if (!reduceMotion && half > 0) {
        if (!positioned) {
          positioned = true;
          if (reverse) offset = half;
        }
        if (!dragging) {
          if (Math.abs(inertia) > 0.1) {
            offset -= inertia;
            inertia *= 0.94;
          } else if (!paused && performance.now() > manualUntil) {
            offset += speed;
          }
        }
        // Two identical halves make these wraps invisible
        offset = ((offset % half) + half) % half;
        track.style.transform = "translate3d(" + (-offset) + "px, 0, 0)";
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return strip;
  }

  const rowA = WORKS.filter(function (w, i) { return i % 2 === 0; });
  const rowB = WORKS.filter(function (w, i) { return i % 2 === 1; });
  stripsHost.appendChild(buildStrip(rowA, false));
  stripsHost.appendChild(buildStrip(rowB, true));

  /* ----- Lightbox ----- */
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbTitle = document.getElementById("lbTitle");
  const lbLocation = document.getElementById("lbLocation");
  const lbSummary = document.getElementById("lbSummary");
  const lbCount = document.getElementById("lbCount");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbClose = document.getElementById("lbClose");

  let current = 0;
  let lastFocus = null;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function render(index) {
    current = (index + WORKS.length) % WORKS.length;
    const work = WORKS[current];
    lbImage.src = work.image;
    lbImage.alt = work.title + ", " + work.location;
    lbTitle.textContent = work.title;
    lbLocation.textContent = work.location;
    lbSummary.textContent = work.summary;
    lbCount.textContent = pad(current + 1) + " / " + pad(WORKS.length);
  }

  function openLightbox(index) {
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
        // Keep focus inside the dialog: cycle through its three buttons
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
