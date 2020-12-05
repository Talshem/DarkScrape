import React, { useEffect, useState } from "react";
import reactStringReplace from "react-string-replace";
import Button from "@material-ui/core/Button";
import Sentiment from "sentiment";

export default function Ticket({ ticket, search }) {
  const [content, setContent] = useState(ticket.content);
  const [showAll, setShowAll] = useState(false);
  const [words, setWords] = useState([]);

  useEffect(() => {
    let dataArray = [];
    let paragraph = ticket.content;
    var sentiment = new Sentiment();
    paragraph.forEach((row) => {
      dataArray = dataArray
        .concat(
          sentiment
            .analyze(row)
            .positive.map((word) => ({ word: word, rate: "positive" }))
        )
        .concat(
          sentiment
            .analyze(row)
            .negative.map((word) => ({ word: word, rate: "negative" }))
        );
    });

    let newArray = [];
    for (let item of dataArray) {
      if (!JSON.stringify(newArray).includes(JSON.stringify(item)))
        newArray.push(item);
    }
    setContent(showAll ? paragraph : paragraph.slice(0,5));
    setWords(newArray);
  }, [ticket, showAll]);

  const markWord = (match, index, offset) => (
    <span style={{ background: "yellow" }} key={index}>
      {match}
    </span>
  );

  return (
    <div className="ticket">
      <h2 style={{ marginBottom: "-20px" }}>
        {search !== ""
          ? reactStringReplace(ticket.title, search, markWord)
          : ticket.title}
      </h2>
      <br />
      {content.map((line, index) => (
        <span key={index}>
          {search !== "" ? reactStringReplace(line, search, markWord) : line}
          <br />
        </span>
      ))}
      {ticket.content.length > 5 && (
        <>
          <br />
          <Button
            variant="contained"
            style={{ background: "rgb(167,213,237)", color: "white" }}
            size="small"
            onClick={() => {
              setShowAll(!showAll);
            }}
          >
            {" "}
            {showAll ? "Show Less" : "Show More"}{" "}
          </Button>
        </>
      )}
      <h5>
        By{" "}
        {search !== ""
          ? reactStringReplace(ticket.author, search, markWord)
          : ticket.author}
        {" | "}
        Posted at {new Date(ticket.date).toUTCString()}
      </h5>
      <div className="margin">
        {words
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
              <span key={index} className="positiveWord">
                {e.word}{" "}
              </span>
            ) : (
              <span key={index} className="negativeWord">
                {e.word}{" "}
              </span>
            )
          )}
      </div>
    </div>
  );
}
