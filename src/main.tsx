import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProductPage from './pages/ProductPage.tsx'
import Layout from './components/Layout.tsx'
import { CartProvider } from 'react-use-cart'

const client = new ApolloClient({
  'uri': 'https://scandiwebprojectbackend-production.up.railway.app/graphql',
  cache: new InMemoryCache()
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: 'product/:productId',
        element: <ProductPage />
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </ApolloProvider>
  </StrictMode>,
)
