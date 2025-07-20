# Scandiweb Project — Frontend 🚀

Repository for the **React/Vite SPA frontend** supporting the Scandiweb Full‑Stack Developer test task.

---

## 🧠 Overview

This frontend is built with:

- **React** (functional components)  
- **Vite** as a build tool  
- **React Router** for SPA navigation  
- **Apollo Client** for GraphQL communication  
- **react-use-cart** for cart management  
- **TailwindCSS** for styling  
- **react-hot-toast** for toast notifications
- Strict adherence to **testing IDs** to satisfy Auto QA

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/gbazera/scandiweb_project_frontend.git
   cd scandiweb_project_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create `.env` if needed (e.g., `VITE_GRAPHQL_URL`):
   ```dotenv
   VITE_GRAPHQL_URL=http://localhost:8080/graphql
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. The app will be available at:
   ```
   http://localhost:5173
   ```

---

## 📚 Available Scripts

- `npm run dev` – Development server with HMR  
- `npm run build` – Build for production  
- `npm run preview` – Preview production build  
- `npm run test` – Run frontend end-to-end tests (Auto QA compatible)

---

## 🔍 Features

### ✅ SPA Routing

- Category listing pages under `/`, `/all`, `/clothes`, `/tech`  
- Product detail pages under `/product/:productId`  
- Browser refresh support via Netlify `_redirects`

### 🛒 Cart Overlay

- Cart button (`data-testid="cart-btn"`) in header  
- Overlay (`data-testid="cart-overlay"`) automatically opens on add  
- Supports quantity increment/decrement  
- Shows product attributes, total (`data-testid="cart-total"`), and Place Order button

### 🇵🇱 Product Listing (PLP)

- Product cards labeled `data-testid="product-{kebab-name}"`  
- Stock awareness: greyed out, “Out of stock” message  
- Quick Shop adds default attributes correctly

### 📦 Product Detail (PDP)

- Galleries (`data-testid="product-gallery"`)  
- Attribute selectors with test IDs like: `product-attribute-{name}-{value}`  
- Add to Cart button `data-testid="add-to-cart"`  
- Product description tagged as `data-testid="product-description"`

---

## 🧩 Architectural Notes

- **Custom Hooks** for cart overlay visibility  
- **HTML parsing** done via `html-react-parser`, without `dangerouslySetInnerHTML`  
- **Test‑friendly structure**, no third‑party component libraries

---

## 🎯 Deployment

Deployed to Netlify at:

```
https://scandiweb-project-frontend.netlify.app/
```

---

## 🤝 Credits

Built and maintained by **gbazera** for Scandiweb’s Full‑Stack Developer test.
