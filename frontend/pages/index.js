import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'

const LOGIN = gql`
  mutation authenticateUser($input: AuthenticateUserInput) {
    authenticateUser(input : $input) {
      token
    }
  }
`;

export default function Home() {
  const router = useRouter()
  const [message, setMessage] = useState(null)

  // mutation 
  const [ authenticateUser ]  = useMutation(LOGIN)

  // valid form
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object ({
      email: Yup.string().email('Email is not valid').required('Email is required'),
      password: Yup.string().required('Password is required')
                    .min(6, 'Password min 6 characters'),
    }),
    onSubmit: async values => {
      console.log(values)
      const { email, password } = values

      try {
       const { data } = await authenticateUser({
          variables : {
            input: {
              email,
              password
            }
          }
        })
        console.log(data)
        const token = data.authenticateUser.token
        localStorage.setItem('token', token)
        router.push('/admin/clients')
      } catch (error) {
        console.log(error)
        setMessage(error.message)

        setTimeout(() => {
          setMessage(null)
        }, 2000)
      }
    }
  })

  const viewMessage = () => {
    return (
      <div className="bg-blue-600 py-2 px-3 w-full max-w-sm text-center mx-auto my-2">
        <p className="font-bold text-white">{message}</p>
      </div>
    )
  }

  return (
    <>
        <h1 className="text-2xl text-white text-center">Login</h1>
        {message && viewMessage()}
        <div className="flex justify-center mt-5"> 
          <div className="w-full max-w-sm">
              <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email" type="email" placeholder="Email"
                      value={formik.values.email} 
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      />
                  </div>
                  { formik.errors.email && formik.touched.email ? (
                    <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                        <p className="font-bold text-sm">{formik.errors.email}</p>
                    </div>
                  ) : null}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password" type="password" placeholder="Password"
                      value={formik.values.password} 
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      />
                  </div>
                  { formik.errors.password && formik.touched.password ? (
                    <div className="bg-red-100 my-2 border-l-4 border-red-500 text-red-700 p-4">
                        <p className="font-bold text-sm">{formik.errors.password}</p>
                    </div>
                  ) : null}
                  <input type="submit" className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900" 
                      value="Send"/>
                  <p className="text-sm flex">
                    No tienes una cuenta?
                    <Link href="/register"><a className='block ml-1'>Registrate aquí</a></Link>
                  </p>
              </form>
          </div>
        </div>
    </>
  )
}
