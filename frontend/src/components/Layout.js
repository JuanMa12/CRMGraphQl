import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Sidebar from './Sidebar'
import Header from './Header'

function Layout({children}) {
  const router = useRouter()

  return (
    <>
        <Head>
          <title>CRM - ADMIN</title>
        </Head>

        { router.pathname === "/" || router.pathname === "/register" ? (
          <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
              {children}
          </div>
        ) : (
          <div className='bg-gray-200 min-h-screen'>
            <div className='flex min-h-screen'>
                <Sidebar />
                <main className='4/5 sm:min-h-screen p-5 w-full'>
                    <Header />
                    {children}
                </main>
            </div>
        </div>
        )}
        
    </>
  )
}

export default Layout