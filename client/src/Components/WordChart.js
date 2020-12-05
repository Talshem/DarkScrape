import React, {useState, useEffect} from 'react'
import { AreaChart, Area, CartesianGrid, YAxis, XAxis,Tooltip, Legend } from 'recharts';
import Sentiment from "sentiment";
import axios from "axios";

function WordChart() {
const [words, setWords] = useState([])

useEffect(() => {
const fetchData = async () => {
var sentiment = new Sentiment();
let dataArray = []

const { data } = await axios.get(`http://localhost:8080/content`)
data.forEach((ticket) => {
dataArray = dataArray
          .concat(
            sentiment
              .analyze(ticket.content)
              .positive
              .map((word) => ({ word: word, rate:'positive', date: ticket.date.split('T')[0]}))
          ).concat(
            sentiment
              .analyze(ticket.content)
              .negative
              .map((word) => ({ word: word, rate:'negative', date: ticket.date.split('T')[0]}))
          )
      });

let obj = {}
for (let item of dataArray) {
if (!obj[item.date]) obj[item.date] = { positive: 0, negative: 0 }
item.rate === 'positive' ? obj[item.date].positive += 1 : obj[item.date].negative += 1
}

let newArray = []
for (const [key, value] of Object.entries(obj)) {
newArray.push({date: key, positive:value.positive, negative:value.negative})
}

setWords(newArray.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
          }))
}; fetchData();
}, [])


    return (
        <div>
    <center><h3>Usage of positive and negative words</h3></center>
<AreaChart width={600} height={400} data={words}
  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="blue" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="blue" stopOpacity={0}/>
    </linearGradient>
    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="red" stopOpacity={0.3}/>
      <stop offset="95%" stopColor="red" stopOpacity={0}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="date" tickFormatter={date => date.split('-').reverse().join('-')} />
  <YAxis/>
<CartesianGrid strokeDasharray="3 3" />
  <Area type="monotone" dataKey='positive' stroke="#c8d2ee" fillOpacity={1} fill="url(#colorUv)" />
  <Area type="monotone" dataKey='negative' stroke="#eec8c8" fillOpacity={1} fill="url(#colorPv)" />
  <Tooltip />
  <Legend verticalAlign="bottom" height={50} />
</AreaChart>
        </div>
    )
}

export default WordChart
