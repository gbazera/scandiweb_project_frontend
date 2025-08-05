import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ProductPage from './pages/ProductPage.tsx'
import Layout from './components/Layout.tsx'
import { CartProvider } from 'react-use-cart'
import CategoryPage from './pages/CategoryPage.tsx'

const client = new ApolloClient({
	uri: 'https://scandiwebprojectbackend-production.up.railway.app/graphql',
	cache: new InMemoryCache(),
})

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Navigate to="all" replace />,
			},
			{
				path: 'product/:productId',
				element: <ProductPage />,
			},
			{
				path: '/:selectedCategory',
				element: <CategoryPage />,
			},
		],
	},
])

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ApolloProvider client={client}>
			<CartProvider>
				<RouterProvider router={router} />
			</CartProvider>
		</ApolloProvider>
	</StrictMode>
)
