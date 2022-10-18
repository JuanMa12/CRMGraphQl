import React, { useEffect } from 'react'
import { 
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { gql, useQuery } from '@apollo/client'

const TOP_USERS = gql`
query topUsers {
    topUsers {
      user {
        name
        email
      }
      total
    }
  }
`;


function TopSellers() {

   const { data, loading, error, startPolling, stopPolling } = useQuery(TOP_USERS);

    useEffect(() => {
        startPolling(1000);
        return () => {
            startPolling();
        }
    }, [startPolling, stopPolling])
    
   if(loading) return 'Cargando...';

   const users_graph = [];
   const topUsers = data.topUsers;

   topUsers.map((user,index) => {
    users_graph[index] = {
        ...user.user[0],
        total: user.total
    }
   })

   console.log(users_graph)

  return (
    <>
        <h1 className='text-2xl text-gray-800 font-light'>Top Sellers</h1>
        <ResponsiveContainer width={'99%'} height={350}>
            <BarChart
                className='mt-10'
                width={600}
                height={500}
                data={users_graph}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#1f2937" />
            </BarChart>
        </ResponsiveContainer>
    </>
  )
}

export default TopSellers
