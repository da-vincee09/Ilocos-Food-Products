# SSOP Monitoring Records Management System

Static frontend-only SSOP records system for **Ilocos Food Products**, Taleb, Bantay, Ilocos Sur.

The app uses only:

- HTML
- CSS
- JavaScript
- Supabase JavaScript CDN
- Chart.js CDN for simple dashboard charts

No PHP, MySQL, Laravel, React, Vite, Node.js, Bootstrap, Tailwind, or custom backend API is required.

## Files

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

## Supabase Setup

1. Create the listed tables in Supabase.
2. Enable Supabase Auth with email/password login.
3. Enable Row Level Security.
4. Add policies that allow authenticated users to select, insert, update, and delete records according to your rules.
5. Make sure the columns match the table names and fields requested for this project.

The Supabase publishable key is already placed in `app.js`:

```js
const SUPABASE_URL = "https://hlpikdpjjqzvzrwilrot.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_CfdtPu53A9i0xdYqWTGqhw_uFf4YhN8";
```

Use only the publishable anon key in this browser app. Do not place service role keys in frontend code.

## Modules

- Dashboard
- Employees
- Suppliers
- Delivery Vehicles
- Raw Materials Receiving
- Delivery Truck Monitoring
- Pest Control
- Oil Temperature / Deep Frying
- Cleaning & Sanitation
- Stock Management
- Reports

## Features

- Email/password login and registration
- Session persistence through Supabase Auth
- Protected dashboard
- CRUD for all monitoring modules
- Search and filters
- CSV export
- Print-friendly SSOP forms
- Delete confirmation modal
- Success and error toasts
- Dynamic child rows for raw materials, pest control, oil temperature, and stock management
- Oil temperature status logic: Below Range, Normal, Above Range
- Corrective action required for oil readings outside 180°C to 190°C
- Reports page with date filters and compliance summaries

## GitHub Pages Deployment

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md`.
3. Go to repository **Settings**.
4. Open **Pages**.
5. Select the branch and root folder.
6. Save and wait for GitHub Pages to publish the site.

Because this is a static frontend, there is no build step.

## Usage

1. Open the published GitHub Pages URL.
2. Register an account or login with an existing Supabase Auth account.
3. Use the sidebar to open a module.
4. Add, edit, delete, print, search, filter, or export records.
5. Use Reports to generate SSOP summaries by monitoring type and date range.

If a save fails, check the toast message and confirm your Supabase RLS policies allow the current user to perform the action.
