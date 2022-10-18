import React, { useEffect } from 'react'
import { 
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { gql, useQuery } from '@apollo/client'

const TOP_CLIENTS = gql`
query topClients {
    topClients {
      client {
        name
        email
      }
      total
    }
  }
`;


function TopClients() {

   const { data, loading, error, startPolling, stopPolling } = useQuery(TOP_CLIENTS);

    useEffect(() => {
        startPolling(1000);
        return () => {
            startPolling();
        }
    }, [startPolling, stopPolling])
    
   if(loading) return 'Cargando...';

   const clients_graph = [];
   const topClients = data.topClients;

   topClients.map((client,index) => {
    clients_graph[index] = {
        ...client.client[0],
        total: client.total
    }
   })

   console.log(clients_graph)

  return (
    <>
        <h1 className='text-2xl text-gray-800 font-light'>Top Clients</h1>
        <ResponsiveContainer width={'99%'} height={350}>
            <BarChart
                className='mt-10'
                width={600}
                height={500}
                data={clients_graph}
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

export default TopClients