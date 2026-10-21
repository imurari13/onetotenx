/* ==========================================================
   1to10X — PRICE CATALOG (single source of truth)
   Read by the checkout in the browser (window.ONE10X_CATALOG).
   Amounts are INR (₹). Plan ids are used in js/config.js payment links
   as  "<kind>:<plan id>"  e.g.  "webinar:pro".
   >>> Prices are PLACEHOLDERS — edit them to your real ones. <<<
   ========================================================== */
window.ONE10X_CATALOG = {
  "currency": "INR",
  "kinds": {
    "webinar": {
      "title": "Webinar seat",
      "blurb": "Join a live 1to10X session and keep the replay.",
      "plans": [
        {
          "id": "free",
          "name": "Community",
          "price": 0,
          "tag": "Free",
          "perks": [
            "Live seat",
            "Public chat",
            "Email reminder"
          ]
        },
        {
          "id": "pro",
          "name": "Pro",
          "price": 499,
          "tag": "Most picked",
          "perks": [
            "Live seat + Q&A",
            "HD replay for 90 days",
            "Slides & resources"
          ]
        },
        {
          "id": "vip",
          "name": "VIP",
          "price": 1499,
          "tag": "Best value",
          "perks": [
            "Everything in Pro",
            "Networking room access",
            "1:1 intro with a speaker"
          ]
        }
      ],
      "fields": [
        "company"
      ]
    },
    "event": {
      "title": "Event pass",
      "blurb": "Meet founders, builders and investors in the room.",
      "plans": [
        {
          "id": "community",
          "name": "Community",
          "price": 999,
          "tag": "Entry",
          "perks": [
            "Full-day entry",
            "Networking lunch",
            "Swag kit"
          ]
        },
        {
          "id": "builder",
          "name": "Builder",
          "price": 2499,
          "tag": "Most picked",
          "perks": [
            "Everything in Community",
            "Workshop track",
            "Founder roundtable"
          ]
        },
        {
          "id": "patron",
          "name": "Patron",
          "price": 7999,
          "tag": "All access",
          "perks": [
            "Everything in Builder",
            "Front-row seating",
            "Speaker dinner"
          ]
        }
      ],
      "fields": [
        "company",
        "city",
        "qty"
      ]
    },
    "collab": {
      "title": "Partnership",
      "blurb": "Put your brand in front of the 1to10X community.",
      "plans": [
        {
          "id": "community-partner",
          "name": "Community Partner",
          "price": 25000,
          "tag": "Start here",
          "perks": [
            "Logo on site & sessions",
            "1 shout-out per month",
            "Community newsletter slot"
          ]
        },
        {
          "id": "growth-partner",
          "name": "Growth Partner",
          "price": 75000,
          "tag": "Most picked",
          "perks": [
            "Everything in Community",
            "Co-hosted webinar",
            "Podcast mention + lead list"
          ]
        },
        {
          "id": "title-partner",
          "name": "Title Partner",
          "price": 0,
          "custom": true,
          "tag": "Custom",
          "perks": [
            "Season-long presence",
            "Stage + studio branding",
            "Custom activation"
          ]
        }
      ],
      "fields": [
        "company",
        "website",
        "role",
        "message"
      ]
    }
  },
  "cities": [
    "Hyderabad",
    "Chennai",
    "Bengaluru",
    "Gurugram",
    "Mumbai"
  ]
};
