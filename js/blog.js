
/* ==========================================================
   1to10X — BLOG STORY DECK
   GSAP + ScrollTrigger
   Features:
   - Smooth, aligned stacked-card transitions
   - Scroll-pinned desktop story deck
   - Layered depth, scale and brightness
   - Velocity-reactive marquee
   - Topic prioritization from ONE10X_CONFIG.posts
   - Accessible reduced-motion support
   - Responsive behavior and GSAP cleanup
   ========================================================== */

(function () {
  "use strict";

  var root = document.querySelector("[data-blog]");
  if (!root) return;

  var C = window.ONE10X_CONFIG || {};
  var reduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var deckEl = root.querySelector(".bk-deck");
  var rowEl = root.querySelector(".bk-row");
  var numEl = root.querySelector(".bk-count b");
  var totEl = root.querySelector(".bk-count span");
  var dotsEl = root.querySelector(".bk-dots");
  var h2 = root.querySelector(".bk-left h2");

  if (!deckEl) return;

  function esc(value) {
    return String(value == null ? "" : value).replace(
      /[&<>"']/g,
      function (char) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[char];
      }
    );
  }

  function pad(number) {
    return (number < 10 ? "0" : "") + number;
  }

  var ARROW =
    '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M5 12h14M13 6l6 6-6 6"/>' +
    "</svg>";

  /* ----------------------------------------------------------
     STORIES
     ---------------------------------------------------------- */

  var posts = (
    Array.isArray(C.posts) ? C.posts : []
  ).filter(function (post) {
    return post && post.title;
  });

  var wantedTag = root.dataset.tag;

  if (wantedTag) {
    posts = posts
      .filter(function (post) {
        return post.tag === wantedTag;
      })
      .concat(
        posts.filter(function (post) {
          return post.tag !== wantedTag;
        })
      );
  }

  posts = posts.slice(0, 6);

  if (!posts.length) {
    deckEl.innerHTML =
      '<p class="bk-empty">' +
      "Stories from the community are on the way." +
      "</p>";

    if (totEl) totEl.textContent = "/ 00";
    if (numEl) numEl.textContent = "00";

    return;
  }

  /* ----------------------------------------------------------
     CARD BACKGROUNDS
     ---------------------------------------------------------- */

  var BG = [
    "radial-gradient(70% 60% at 15% 15%,#ff7a45,transparent 60%)," +
      "radial-gradient(60% 60% at 95% 95%,#7a0f1c,transparent 62%),#1d0907",

    "radial-gradient(60% 60% at 85% 10%,#e51f31,transparent 60%)," +
      "radial-gradient(70% 60% at 5% 95%,#3a1a6e,transparent 62%),#10091d",

    "radial-gradient(70% 60% at 50% 0%,#ee5125,transparent 62%)," +
      "radial-gradient(60% 70% at 100% 100%,#00395c,transparent 60%),#06121c"
  ];

  /* ----------------------------------------------------------
     INLINE SVG ARTWORK
     ---------------------------------------------------------- */

  function art(index) {
    var gradientId = "bk-gradient-" + index;

    var gradient =
      '<defs>' +
      '<linearGradient id="' + gradientId + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0%" stop-color="#ee5125"/>' +
      '<stop offset="100%" stop-color="#e51f31"/>' +
      "</linearGradient>" +
      "</defs>";

    var kind = index % 3;

    if (kind === 0) {
      var points = [0.2, 0.45, 0.7, 0.92];

      return (
        '<svg viewBox="0 0 400 300" ' +
        'preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        gradient +
        '<path class="bk-line" ' +
        'd="M10 280 C120 276 220 250 280 170 S360 40 392 14" ' +
        'fill="none" stroke="url(#' + gradientId + ')" ' +
        'stroke-width="3" stroke-linecap="round"/>' +

        points.map(function (point, i) {
          return (
            '<circle class="bk-pulse" ' +
            'style="animation-delay:' + (-i * 0.6) + 's" ' +
            'cx="' + (10 + 382 * point) + '" ' +
            'cy="' + (280 - 266 * Math.pow(point, 2.2)) + '" ' +
            'r="' + (4 + i * 2) + '" fill="#ff8a63"/>'
          );
        }).join("") +

        "</svg>"
      );
    }

    if (kind === 1) {
      return (
        '<svg viewBox="0 0 400 300" ' +
        'preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        gradient +

        [0, 1, 2, 3, 4, 5, 6, 7].map(function (bar) {
          var height = 40 + bar * 28;

          return (
            '<rect class="bk-bar" ' +
            'x="' + (30 + bar * 44) + '" ' +
            'y="' + (290 - height) + '" ' +
            'width="26" height="' + height + '" rx="6" ' +
            'fill="url(#' + gradientId + ')" ' +
            'opacity="' + (0.35 + bar * 0.08) + '"/>'
          );
        }).join("") +

        "</svg>"
      );
    }

    return (
      '<svg viewBox="0 0 400 300" ' +
      'preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      gradient +

      '<g class="bk-spin">' +
      '<circle cx="200" cy="150" r="60" fill="none" stroke="#ffffff30"/>' +
      '<circle cx="200" cy="150" r="105" fill="none" stroke="#ffffff22"/>' +
      '<circle cx="200" cy="150" r="150" fill="none" stroke="#ffffff16"/>' +
      '<circle cx="260" cy="150" r="7" fill="#ff8a63"/>' +
      '<circle cx="200" cy="45" r="5" fill="#fff"/>' +
      '<circle cx="50" cy="150" r="9" fill="url(#' + gradientId + ')"/>' +
      "</g></svg>"
    );
  }

  /* ----------------------------------------------------------
     RENDER CARDS
     ---------------------------------------------------------- */

  deckEl.innerHTML = posts.map(function (post, index) {
    var isLink = Boolean(post.url);
    var tagName = isLink ? "a" : "article";

    var href = isLink
      ? ' href="' + esc(post.url) + '"'
      : "";

    var dateText = post.date
      ? esc(post.date)
      : (post.placeholder ? "Sample story" : "");

    var readText = post.read
      ? '<span class="bk-read">' +
        esc(post.read) + " read</span>"
      : "";

    var footerAction = isLink
      ? '<span class="bk-go">Read story <i>' +
        ARROW + "</i></span>"
      : '<span class="bk-soon">Coming soon</span>';

    return (
      "<" + tagName +
      ' class="bk-card"' +
      href +
      ' style="--bg:' + BG[index % BG.length] + '"' +
      ' data-card-index="' + index + '">' +

      '<div class="bk-art" aria-hidden="true">' +
      art(index) +
      "</div>" +

      '<span class="bk-no" aria-hidden="true">' +
      pad(index + 1) +
      "</span>" +

      '<div class="bk-top">' +
      '<span class="bk-tag">' +
      esc(post.tag || "Story") +
      "</span>" +
      readText +
      "</div>" +

      '<div class="bk-body">' +
      "<h3>" + esc(post.title) + "</h3>" +
      "<p>" + esc(post.excerpt || "") + "</p>" +

      '<div class="bk-foot">' +
      "<span>" + dateText + "</span>" +
      footerAction +
      "</div>" +

      "</div></" + tagName + ">"
    );
  }).join("");

  /* ----------------------------------------------------------
     MARQUEE
     ---------------------------------------------------------- */

  var words = [
    "Stories",
    "Numbers",
    "Lessons",
    "Founders",
    "Playbooks",
    "Growth"
  ];

  if (rowEl) {
    var sequence = words.map(function (word) {
      return (
        '<span class="bk-marquee-word">' +
        esc(word) +
        "<b>✦</b></span>"
      );
    }).join("");

    rowEl.innerHTML =
      sequence + sequence + sequence + sequence;
  }

  /* ----------------------------------------------------------
     CARD COUNTER AND DOTS
     ---------------------------------------------------------- */

  var cards = Array.prototype.slice.call(
    deckEl.querySelectorAll(".bk-card")
  );

  var dots = [];

  if (totEl) {
    totEl.textContent = "/ " + pad(cards.length);
  }

  if (dotsEl) {
    dotsEl.innerHTML = cards.map(function (_, index) {
      return (
        '<i class="bk-dot" aria-label="Story ' +
        (index + 1) + '"></i>'
      );
    }).join("");

    dots = Array.prototype.slice.call(dotsEl.children);
  }

  function show(index) {
    var active = Math.max(
      0,
      Math.min(cards.length - 1, index)
    );

    if (numEl) {
      numEl.textContent = pad(active + 1);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("on", dotIndex === active);
    });

    cards.forEach(function (card, cardIndex) {
      if (cardIndex === active) {
        card.setAttribute("aria-current", "true");
      } else {
        card.removeAttribute("aria-current");
      }
    });
  }

  show(0);

  /* ----------------------------------------------------------
     GSAP INITIALIZATION
     ---------------------------------------------------------- */

  if (!window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  gsap.registerPlugin(ScrollTrigger);

  /* ----------------------------------------------------------
     HEADING REVEAL
     ---------------------------------------------------------- */

  if (h2 && !reduce && !h2.dataset.bkSplit) {
    h2.dataset.bkSplit = "true";

    var originalHTML = h2.innerHTML;

    h2.innerHTML = originalHTML.replace(
      /(<em>)([^<]+)(<\/em>)|([^<>\s]+)/g,
      function (match, open, emphasized, close, word) {
        if (word) {
          return (
            '<span class="bk-w"><span>' +
            word +
            "</span></span>"
          );
        }

        return (
          open +
          emphasized.split(/\s+/).map(function (part) {
            return (
              '<span class="bk-w"><span>' +
              part +
              "</span></span>"
            );
          }).join(" ") +
          close
        );
      }
    );

    gsap.from(h2.querySelectorAll(".bk-w > span"), {
      yPercent: 115,
      rotation: 4,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.07,
      scrollTrigger: {
        trigger: root,
        start: "top 65%",
        once: true
      }
    });
  }

  /* ----------------------------------------------------------
     VELOCITY-RESPONSIVE MARQUEE
     ---------------------------------------------------------- */

  if (rowEl && !reduce) {
    var drift = gsap.to(rowEl, {
      xPercent: -25,
      duration: 22,
      ease: "none",
      repeat: -1
    });

    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",

      onUpdate: function (self) {
        var velocity = Math.min(
          5,
          Math.abs(self.getVelocity()) / 500
        );

        gsap.to(drift, {
          timeScale: 1 + velocity,
          duration: 0.25,
          overwrite: "auto"
        });

        gsap.to(drift, {
          timeScale: 1,
          duration: 0.9,
          delay: 0.2,
          overwrite: "auto"
        });
      }
    });
  }

  /* ----------------------------------------------------------
     DESKTOP STORY DECK
     ---------------------------------------------------------- */

  var mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", function () {
    if (reduce || cards.length < 2) return;

    var pin = root.querySelector(".bk-pin");

    if (!pin) return;

    var count = cards.length;
    var timeline = gsap.timeline({
      defaults: {
        ease: "none"
      },

    scrollTrigger: {
  trigger: pin,
  start: "top top",
  end: "+=" + ((count - 1) * 10) + "%",
  pin: true,
  scrub: 0.5,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  onUpdate: function (self) {
    show(
      Math.min(
        count - 1,
        Math.round(self.progress * (count - 1))
      )
    );
  }
}
    });

    /*
      All cards occupy the same grid cell.

      The newest card always has the highest z-index.
      Each incoming card starts below the visible deck.
      Previous cards move backward into consistent layers.
    */

    cards.forEach(function (card, index) {
      gsap.set(card, {
        zIndex: index + 1,
        yPercent: index === 0 ? 0 : 110,
        scale: 1,
        rotation: 0,
        filter: "brightness(1)",
        force3D: true,
        transformOrigin: "50% 100%",
        autoAlpha: 1
      });
    });

    /*
      At every stage:
      - The incoming card moves to the fixed stack position.
      - The immediately previous card becomes a shallow layer.
      - Older cards retain progressively deeper layers.
      - Transform values are absolute targets, not accumulated deltas.
    */

    for (var i = 1; i < count; i++) {
      var incoming = cards[i];

      timeline.to(incoming, {
        yPercent: 0,
        scale: 1,
        rotation: 0,
        filter: "brightness(1)",
        duration: 1
      }, i - 1);

      for (var j = 0; j < i; j++) {
        var previous = cards[j];
        var depth = i - j;

        var scale = 1 - Math.min(
          depth * 0.035,
          0.14
        );

        var offsetY = -Math.min(
          depth * 12,
          48
        );

        var brightness = Math.max(
          0.58,
          1 - depth * 0.1
        );

        timeline.to(previous, {
          y: offsetY,
          scale: scale,
          rotation: 0,
          filter: "brightness(" + brightness + ")",
          duration: 1
        }, i - 1);
      }
    }

    return function () {
      if (timeline.scrollTrigger) {
        timeline.scrollTrigger.kill();
      }

      timeline.kill();

      cards.forEach(function (card) {
        gsap.set(card, {
          clearProps: "transform,filter,opacity,visibility"
        });
      });
    };
  });

  /* ----------------------------------------------------------
     REFRESH AFTER ASSETS LOAD
     ---------------------------------------------------------- */

  function refreshDeck() {
    ScrollTrigger.refresh();
  }

  if (document.readyState === "complete") {
    refreshDeck();
  } else {
    window.addEventListener("load", refreshDeck, {
      once: true
    });
  }

  window.addEventListener("resize", function () {
    ScrollTrigger.refresh();
  });

})();
