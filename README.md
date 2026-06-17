# App-Web

Static web prototype for a B2B logistics platform, including:

- Public landing page (`index.html`) with company/service information
- Top actions for **Log in** and **Request information**
- Login flow (`login.html`) with role-based access selection (customer/employee)
- Role-aware operational dashboard (`dashboard.html`) with:
  - live cargo location panel
  - customer cargo/trip/invoice/credit data
  - employee customer/invoice/trip data

## Run locally

From the repository root, start a static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.
