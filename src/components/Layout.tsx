import { useQuery, gql } from '@apollo/client'
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useCart } from 'react-use-cart';
import CartOverlay from './CartOverlay';
import logoUrl from '../assets/logo.png';

const GET_CATEGORIES = gql`
  query GetCategories{
    categories{
      name
    }
  }
`;

function Layout(){

    const [isCartOpen, setIsCartOpen] = useState(false);
    const { totalUniqueItems, items } = useCart();
    const [prevItemsCount, setPrevItemsCount] = useState(items.length);

    useEffect(() => {
        if(items.length !== prevItemsCount){
            setIsCartOpen(true);
        }
    }, [items.length]);

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const { loading, error, data } = useQuery(GET_CATEGORIES);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return(
        <div>
            <header className='flex justify-between items-center px-36 mb-8 bg-white relative z-50'>
                <nav className='flex items-center'>
                {data.categories.map((category: {name: string}) => (
                    <Link
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    to={`/${category.name}`}
                    className={`
                        px-4 py-8 mr-8 uppercase cursor-pointer
                        ${selectedCategory === category.name
                        ? 'text-green-500 border-b-2 border-green-500 font-semibold'
                        : 'text-black border-b-2 border-transparent'}
                    `}
                    data-testid={selectedCategory === category.name ? 'active-category-link' : 'category-link'}
                    >
                    {category.name}
                    </Link>
                ))}
                </nav>

                <Link to={`/`} className='absolute left-1/2 transform -translate-x-1/2'>
                    <img src={logoUrl} alt="logo" className='object-contain object-top' />
                </Link>

                <button
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="relative cursor-pointer"
                    aria-label='open cart'
                    data-testid='cart-btn'
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.39 2.78A.66.66 0 004.22 17H18.8a.66.66 0 00.61-.22L21 13M9 21a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    {totalUniqueItems > 0 && (
                        <span className='absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                            {totalUniqueItems}
                        </span>
                    )}
                </button>
            </header>

            {isCartOpen && (
                <>
                    <div
                        onClick={() => setIsCartOpen(false)}
                        className='fixed inset-0 bg-black opacity-50 z-10'
                        aria-label='Close cart overlay'
                    ></div>
                    <CartOverlay />
                </>
            )}

            <main>
                <Outlet context={{ selectedCategory }} />
            </main>
        </div>
    )
}

export default Layout;