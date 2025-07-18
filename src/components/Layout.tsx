import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const GET_CATEGORIES = gql`
  query GetCategories{
    categories{
      name
    }
  }
`;

function Layout(){

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const { loading, error, data } = useQuery(GET_CATEGORIES);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return(
        <div>
            <header>
                <nav className='flex items-center py-6 mb-8 px-36 bg-white'>
                {data.categories.map((category: {name: string}) => (
                    <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`
                        px-4 pb-6 mr-8 uppercase cursor-pointer
                        ${selectedCategory === category.name
                        ? 'text-green-500 border-b-2 border-green-500 font-semibold'
                        : 'text-black border-b-2 border-transparent'}
                    `}
                    >
                    {category.name}
                    </button>
                ))}
                </nav>
            </header>

            <main>
                <Outlet context={{ selectedCategory }} />
            </main>
        </div>
    )
}

export default Layout;