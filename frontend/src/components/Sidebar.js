import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Sidebar() {
    const router = useRouter()


  return (
    <>
        <aside className='bg-gray-800 w-1/5 sm:min-h-screen p-5'>
            <div>
                <p className='text-white text-2xl font-black'>CRM</p>
            </div>

            <nav className='mt-5 list-none'>
                <li className={router.pathname === '/admin/clients' ? "bg-gray-600 p-2" : "p-2"}>
                    <Link href="/admin/clients"><a className='text-white block'>Clients</a></Link>
                </li>
                <li className={router.pathname === '/admin/products' ? "bg-gray-600 p-2" : "p-2"}>
                    <Link href="/admin/products"><a className='text-white block'>Products</a></Link>
                </li>
                <li className={router.pathname === '/admin/orders' ? "bg-gray-600 p-2" : "p-2"}>
                    <Link href="/admin/orders"><a className='text-white block'>Orders</a></Link>
                </li>
            </nav>
        </aside>
    </>
  )
}

export default Sidebar