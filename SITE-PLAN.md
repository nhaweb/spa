# Site expansion plan — mori

Tracking file for IA / roadmap. Product truth stays in `PRODUCT.md`.

**Status:** Phase A implemented · Phase B not started  
**Last updated:** 2026-10-20

---

## Decisions locked

| Topic | Choice |
|--------|--------|
| Primary user now | Real spa customers booking for mori |
| Booking UX | Dedicated `/dat-lich` page + post-submit states (not modal-only) |
| Content breadth | Full public site: services, about, team, FAQ, contact, blog |
| Ship order | **Public site first** → owner dashboard later |
| Dashboard MVP | Near calendar ops: filter by day, internal notes, cancel/reschedule |
| Owner access | Simple login (email/password or single owner account) |
| Visual world | Inherit landing; do not invent a new brand look for new pages |
| Slug style | Vietnamese (`/dich-vu`, …) |
| Persistence (Phase A) | JSON file `data/appointments.json` via `/api/appointments` + `/api/slots` |
| Zalo | Optional contact link on `/lien-he` |
| Treatment detail pages | Yes — `/dich-vu/[slug]` for all menu items |

---

## Success criteria

- [x] Customer can discover treatments and complete booking on `/dat-lich`, then see a clear next-step state
- [x] Landing stays calm: brand + CTA + paths into depth — not a dump of every section
- [x] Every primary CTA points to booking (prefer prefill service when coming from menu)
- [ ] Owner can log in and manage appointments; customers never see owner nav
- [x] Demo content stays honest (no fake verified reviews / real address claims)

---

## Anti-goals

- [x] ~~Stuff everything into the landing page~~
- [x] ~~Ship blog before menu + booking are clear~~
- [ ] ~~Expose `/owner` in public nav or rely on “secret URL” alone~~ *(Phase B)*
- [ ] ~~Build a full PMS (payroll, inventory, multi-branch, etc.)~~

---

## Phase A — Public site (ship first)

### Shared shell

- [x] Site nav: Trang chủ · Dịch vụ · Về chúng tôi · Đội ngũ · Blog · Liên hệ · **Đặt lịch**
- [x] Footer: FAQ link, hours, contact, configurable placeholders
- [x] Shared layout inherits landing visual world
- [x] Persistent booking CTA (header and/or key section ends)

### Routes

| Done | Route | Job | Notes |
|------|--------|-----|--------|
| [x] | `/` | Persuade: brand + CTA + teaser | Slim landing; deep content moved out |
| [x] | `/dich-vu` | Menu + price (VND) + duration | CTA book per service |
| [x] | `/dich-vu/[slug]` | Treatment detail | All 8 services |
| [x] | `/ve-chung-toi` | Studio story / space / trust | No fabricated press |
| [x] | `/doi-ngu` | Therapists | Demo names; no fake credentials |
| [x] | `/faq` | Cancel/change, prep, payment | Also linked from footer |
| [x] | `/lien-he` | Hours, map, phone/Zalo/email | Owner-configurable in `lib/site.ts` |
| [x] | `/dat-lich` | Full booking flow | Prefill via `?service=` |
| [x] | `/blog` | Index | Demo posts labeled |
| [x] | `/blog/[slug]` | Article | 3 sample posts |

### Booking flow (`/dat-lich`)

- [x] Step: chọn dịch vụ
- [x] Step: chọn thời gian (slot)
- [x] Step: thông tin khách (tên, SĐT, ghi chú…)
- [x] Prefill service from `/dich-vu` query or link
- [x] State: submitting
- [x] State: success — chờ xác nhận
- [x] State: validation error
- [x] State: server / network error
- [x] State: slot đầy hoặc ngoài giờ mở cửa
- [x] Persist appointments (`data/appointments.json`)

### Content ranges (demo)

- [x] 6–12 services with VND prices *(8)*
- [x] 2–4 therapists *(3)*
- [x] 5–10 FAQs *(8)*
- [x] A few sample blog posts *(3)*

---

## Phase B — Owner dashboard (after public)

| Done | Route | Job |
|------|--------|-----|
| [ ] | `/owner/login` | Email/password (single owner OK for MVP) |
| [ ] | `/owner` | Appointment ops dashboard |
| [ ] | Auth guard on `/owner/*` | Session required; logout clear |
| [ ] | Hide owner routes from public nav | |

### Dashboard capabilities

- [ ] List appointments (customer, phone, service, time, status)
- [ ] Filter by day
- [ ] Status: mới / đã xác nhận / hoàn thành / hủy (adjust labels in VI as needed)
- [ ] Internal notes (owner-only)
- [ ] Cancel appointment
- [ ] Reschedule slot
- [ ] Empty state for a day with no bookings
- [ ] Loading / error states

---

## Open decisions (resolve before or during build)

- [x] Slug style: Vietnamese (`/dich-vu`)
- [x] Zalo: optional on contact
- [ ] Reschedule: owner-only vs customer self-serve later
- [x] Appointment storage (Phase A): JSON file — upgrade DB/auth later if needed
- [x] Treatment detail pages: always
- [ ] Record Impeccable `buildPath` (`comp` vs `code`) when doing Persuade comps — optional until image-gen workflow
- [ ] Auth provider for Phase B (credentials / Auth.js / etc.)

---

## Suggested build order (within phases)

**Phase A**

1. [x] Shared layout + nav/footer
2. [x] Slim `/` + `/dich-vu` (+ `[slug]`)
3. [x] `/dat-lich` + states + persistence hookup
4. [x] `/ve-chung-toi`, `/doi-ngu`, `/faq`, `/lien-he`
5. [x] `/blog` + sample posts

**Phase B**

1. [ ] Auth + `/owner/login`
2. [ ] `/owner` list + day filter + statuses
3. [ ] Notes + cancel/reschedule

---

## Notes / changelog

| Date | Note |
|------|------|
| 2026-10-20 | Shape brief locked; tracking file created |
| 2026-10-20 | Phase A shipped: multi-page VN site, booking API, JSON persistence. Configurable content in `lib/site.ts`, `lib/services.ts`, etc. |
