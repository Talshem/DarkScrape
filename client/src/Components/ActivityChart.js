import React, {useState, useEffect} from 'react'
import axios from "axios";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from 'recharts';

function ActivityChart() {
const [activity, setActivity] = useState([])

useEffect(() => {
const fetchData = async () => {
let { data } = await axios.get(`http://localhost:8080/dates`)
data = data.map(date => date.split('T')[0])

let obj = {}
for (let item of data) {
obj[item] ? obj[item] += 1 : obj[item] = 1
}

let newArray = []
for (const [key, value] of Object.entries(obj)) {
newArray.push({date: key, number: value})
}

setActivity(newArray.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
          }))

}; fetchData();
}, [])


    return (
     <>
      <center><h3>Number of posts daily</h3></center>
        <LineChart
        width={600}
        height={350}
        data={activity}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={date => date.split('-').reverse().join('-')}/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Line strokeWidth={3} type="monotone" dataKey="number" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      </>
    )
}

export default ActivityChart
