import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const AUTH = gql`
    query getAuth {
        getAuth {
            id
            name
            surname
        }
    }
`;

function Header() {
    const router = useRouter()

    const { data, loading, error } = useQuery(AUTH)

    if(loading) return 'Cargando...';

    if(!data.getAuth) {
        return router.push('/')
    } 

    const { id, name, surname } = data.getAuth;

    const logout = () => {
        localStorage.removeItem("token")
        router.push('/')
    }

  return (
    <div className='flex justify-between mb-6 border-b-4 border-gray-800 py-2'>
        <p className=''>Hi, {name} {surname}. </p>
        <button className='bg-gray-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md' 
            type='button' onClick={() => logout()}>
            Logout
        </button>
    </div>
  )
}

export default Header