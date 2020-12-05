import React, { useEffect, useState } from "react";
import Sentiment from "sentiment";
import axios from "axios";
import Button from "@material-ui/core/Button";

function Labels({ search }) {
  const [words, setWords] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      var sentiment = new Sentiment();
      let dataArray = [];

      const { data } = await axios.get(`http://localhost:8080/content`);
      data.forEach((ticket) => {
        dataArray = dataArray
          .concat(
            sentiment
              .analyze(ticket.content)
              .positive.map((word) => ({ word: word, rate: "positive" }))
          )
          .concat(
            sentiment
              .analyze(ticket.content)
              .negative.map((word) => ({ word: word, rate: "negative" }))
          );
      });

      let newArray = [];
      for (let item of dataArray) {
        if (!JSON.stringify(newArray).includes(JSON.stringify(item)))
          newArray.push(item);
      }
      setWords(newArray);
    };
    fetchData();
  }, [showAll]);

const labels = showAll ? words : words.slice(0,30)

  return (
    <div
      className="margin"
      style={{ textAlign: "center", width: "80%", marginLeft: "10%" }}
    >
      {labels
        .sort((a, b) => {
          if (a.word < b.word) {
            return -1;
          }
          if (a.word > b.word) {
            return 1;
          }
          return 0;
        })
        .map((e, index) =>
          e.rate === "positive" ? (
            <span
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => search(e.word)}
              className="positiveWord"
            >
              {e.word}{" "}
            </span>
          ) : (
            <span
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => search(e.word)}
              className="negativeWord"
            >
              {e.word}{" "}
            </span>
          )
        )}
      <br />
      {!showAll && (
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          onClick={() => setShowAll(true)}
        >
          Show All Labels
        </Button>
      )}
    </div>
  );
}

export default Labels;
