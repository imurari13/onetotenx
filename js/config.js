/* ==========================================================
   1to10X — SITE SETTINGS  (the only file you need to edit to go live)
   100% static: no PHP, no Node, no database.
   Leave things empty and the site runs in DEMO mode (forms and
   checkout look and work, but nothing is sent and no money moves).
   ========================================================== */
window.ONE10X_CONFIG = {

  /* ---------- 1. FORMS → your inbox ----------
     Every form (subscribe, guest pitch, contact, collab enquiry) and every
     booking is e-mailed to you by a free form service. Pick ONE:

     A) Web3Forms  (recommended, free)   → get an access key at web3forms.com
        { provider: "web3forms", accessKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }

     B) Formspree  (free tier)           → create a form at formspree.io
        { provider: "formspree", endpoint: "https://formspree.io/f/xxxxxxxx" }

     C) FormSubmit (no key, confirm by e-mail once)
        { provider: "formsubmit", email: "info@marcamor.com" }
  */
  forms: { provider: "none", accessKey: "", endpoint: "", email: "info@marcamor.com" },

  /* ---------- 2. PAYMENTS ----------
     Option 1 – Razorpay Checkout in the page (UPI, cards, netbanking):
       paste your PUBLIC key id (rzp_test_… to try, rzp_live_… to go live).
       Never paste the secret key here.                                     */
  razorpayKeyId: "",

  /* Option 2 – hosted payment links (fixed price, can't be tampered with, works for Stripe too).
       Create a link per plan in the Razorpay / Stripe dashboard, then add it below.
       Key format: "<kind>:<plan id>"   (see js/catalog.js for the ids)
       In the link's settings set the "after payment" redirect to
       https://YOUR-DOMAIN/html/webinars.html?paid=1  (or events.html / collab.html)
       so the visitor lands on the confirmation screen.                      */
  paymentLinks: {
    // "webinar:pro":  { razorpay: "https://rzp.io/l/xxxx", stripe: "https://buy.stripe.com/xxxx" },
    // "webinar:vip":  { razorpay: "https://rzp.io/l/xxxx" },
    // "event:builder":{ stripe:   "https://buy.stripe.com/xxxx" },
  },

  /* ---------- 3. HOMEPAGE: UPCOMING SESSIONS ----------
     type: "Webinar" | "Podcast" | "Event" | "Collab"
     when: leave "" until a date is confirmed (the card then says "Date to be announced")
     href: the page or link the row opens                                        */
  sessions: [
    { type: "Webinar", title: "Live founder webinars",        desc: "One founder, the real numbers, and time at the end for your questions.", when: "", href: "webinars.html" },
    { type: "Podcast", title: "Founder conversations",        desc: "Long, honest episodes on how a business went from one to ten times its size.", when: "", href: "podcasts.html" },
    { type: "Event",   title: "Marcamor 10 year celebration", desc: "A room full of founders, investors and operators. Venue and programme to follow.", when: "", href: "events.html" },
    { type: "Collab",  title: "Build something with us",      desc: "Joint episodes, co-hosted webinars and event partnerships for brands and communities.", when: "", href: "collab.html" }
  ],

  /* ---------- 4. HOMEPAGE: FROM THE BLOG ----------
     Entries marked placeholder:true show a "Placeholder" tag. Replace them with real posts
     (set url to the post link, remove placeholder). Entries with no url are not clickable. */
  posts: [
    { tag: "Founders", date: "", read: "6 min", title: "How a founder took revenue from 1 to 10X",   excerpt: "The decisions, the numbers and the one change that moved the needle. Sample story: replace with your own.", url: "", placeholder: true },
    { tag: "Webinars", date: "", read: "4 min", title: "What we learned from our first live sessions", excerpt: "Questions that came up, answers that landed and what attendees did next. Sample story: replace with your own.", url: "", placeholder: true },
    { tag: "Podcast",  date: "", read: "7 min", title: "Behind the mic: a founder conversation",       excerpt: "The moments that did not make the episode, and why they matter. Sample story: replace with your own.", url: "", placeholder: true },
    { tag: "Events",   date: "", read: "5 min", title: "Inside the room: community gatherings",       excerpt: "Who showed up, who they met and the introductions that followed. Sample story: replace with your own.", url: "", placeholder: true },
    { tag: "Funding",  date: "", read: "8 min", title: "Raising your first round, without the noise",  excerpt: "What investors look at first and how founders prepare. Sample story: replace with your own.", url: "", placeholder: true },
    { tag: "Founders", date: "", read: "5 min", title: "Small habits behind big growth",               excerpt: "The routines founders keep when the team doubles. Sample story: replace with your own.", url: "", placeholder: true }
  ]
};
