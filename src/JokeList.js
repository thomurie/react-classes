import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  state = {
    jokes: [],
  };
  // const [jokes, setJokes] = useState([]);

  /* get jokes if there are no jokes */

  getJokes = async () => {
    let j = [...this.state.jokes];
    console.log(j, this.props);
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  };
  async componentDidMount() {
    if (this.state.jokes.length === 0) await this.getJokes();
  }
  async componentDidUpdate(jokes) {
    if (jokes.length === 0) this.getJokes(jokes);
  }

  // useEffect(function() {
  //   async function getJokes() {
  //     let j = [...jokes];
  //     let seenJokes = new Set();
  //     try {
  //       while (j.length < this.props.numJokesToGet) {
  //         let res = await axios.get("https://icanhazdadjoke.com", {
  //           headers: { Accept: "application/json" }
  //         });
  //         let { status, ...jokeObj } = res.data;

  //         if (!seenJokes.has(jokeObj.id)) {
  //           seenJokes.add(jokeObj.id);
  //           j.push({ ...jokeObj, votes: 0 });
  //         } else {
  //           console.error("duplicate found!");
  //         }
  //       }
  //       setJokes(j);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }

  //   if (jokes.length === 0) getJokes();
  // }, [jokes, numJokesToGet]);

  /* empty joke list and then call getJokes */

  generateNewJokes = () => {
    this.setState({ jokes: [] });
  };

  /* change vote for this id by delta (+1 or -1) */

  vote = (id, delta) => {
    this.setState({
      jokes: this.state.jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      ),
    });
  };

  /* render: either loading spinner or list of sorted jokes. */
  render() {
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={this.vote}
            />
          ))}
        </div>
      );
    }

    return null;
  }
}

JokeList.defaultProps = {
  numJokesToGet: 10,
};

export default JokeList;
