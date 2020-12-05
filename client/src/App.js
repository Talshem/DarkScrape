import React, { useState, useEffect } from "react";
import "./App.css";
import Ticket from "./Components/Ticket";
import axios from "axios";
import { DebounceInput } from "react-debounce-input";
import InfiniteScroll from "react-infinite-scroll-component";
import TextField from '@material-ui/core/TextField';
import AppBar from './Components/AppBar'
import WordChart from './Components/WordChart'
import ActivityChart from './Components/ActivityChart'
import Labels from './Components/Labels'
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';


const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    color:'gray',
    height: '100%',
    marginTop:"6px",
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    marginTop:'10px',
    border:'2px solid #e5e5e5',
    borderRadius:'5px',
    marginRight: '100px',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '60ch'
    },
  },
}));


function App() {
  const [tickets, setTickets] = useState(null);
  const [search, setSearch] = useState("");
  const [payload, setPayload] = useState(5);
const [date, setDate] = useState(null)
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(`http://localhost:8080/posts?search=${search}`)
        .then((results) => {
          let array = results.data.sort((a, b) => {
            return Date.parse(a.date) - Date.parse(b.date);
          });
          if (date) array = array.filter(ticket => ticket.date.split('T')[0] === date)
          setTickets(array.reverse());
        });
    };
    fetchData();
  }, [search, date]);

  return (
    <div>
<AppBar/>
<br/><br/>
          <div style={{marginLeft:'20%'}} className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
      <DebounceInput
        element={InputBase}
        minLength={2}
         classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              placeholder="Search..."
              
        debounceTimeout={300}
        onChange={(event) => setSearch(event.target.value)}
      />

 <form style={{display:"inline"}}>
      <TextField
        onChange={(event) => setDate(event.target.value)}
        id="date"
        label="Date"
        type="date"
        defaultValue=""
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
          </div>
<br/><br/>
<Labels search={(e) => setSearch(e)}/>
<br/><br/>
<div style={{display:'flex'}}>

<div>
<WordChart/>
<ActivityChart/>
</div>
      {tickets && (
        <InfiniteScroll
          dataLength={payload}
          next={() =>
            setTimeout(() => {
              setPayload((payload) => payload + 5);
            }, 500)
          }
          hasMore={tickets.length >= payload}
          loader={<p style={{ color: "black" }}>Loading...</p>}
        >
          {tickets.slice(0, payload).map((ticket, index) => (
            <Ticket key={index} ticket={ticket} search={search} />
          ))}
        </InfiniteScroll>
      )}
      </div>
    </div>
  );
}

export default App;
