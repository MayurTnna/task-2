import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/scss/Home.scss";

function Home() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [searchGame, setSearchGame] = useState("");
  const [title,setTitle]=useState([]);
  const [selectPlatform, setSelectPlatform] = useState();
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/gamesarena274f2bf.json"
      )
      .then((response) => {
        setGames(response.data.slice(1));

        setFilteredGames(response.data.slice(1));
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleSearchChange = (value) => {
    let regEx=new RegExp(value,'gi');
    let array=[];
      setSearchGame(value);
      filteredGames.map((item)=>{
        if(item.title){
          if(item.title.match(regEx)){
            array.push(item.title);
          }
        }
      })
      setTitle(Array.from(new Set(array)));
  };

  const handlePlatformChange = (event) => {
    const platform = event.target.value;
    setSelectPlatform(platform);
    filterGamesByPlatform(platform);
  };
  const searchGames = (event) => {
    event.preventDefault();
    const filterData = filteredGames.filter((game) =>
      game.title.toLowerCase().includes(searchGame.toLowerCase())
    );
    setGames(filterData);
  };
const filterGamesByPlatform = (platform) => {
    if (!platform) {
      setGames(filteredGames);
    } else {
      const filteredData = filteredGames.filter((game) => game.platform === platform);
      setGames(filteredData);
    }
  }
  const titleSearch = (title) => {
    const filteredData = filteredGames.filter((game) => game.title === title);
    setGames(filteredData);
    setSearchGame(title);
  };

  const platforms_main = new Set(games.map((game) => game.platform));
  const uniquePlatforms = Array.from(platforms_main);
  uniquePlatforms.shift();
  return (
    <>
      <div>
        <div className="container">
          <h1 className="text-center p-2">Game Center</h1>
          {error !== null && <h2>{error}</h2>}
          <select
            id="platform"
            value={selectPlatform}
            className="form-select"
            aria-label="Default select example"
            onChange={handlePlatformChange}
          >
            <option value="">All Platforms</option>
            {uniquePlatforms.map((platform, index) => (
              <option
                key={uniquePlatforms[index]}
                value={uniquePlatforms[index]}
              >
                {uniquePlatforms[index]}
              </option>
            ))}
          </select>
          <form>
            <div className="mb-3 mt-3 search">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label"
              ></label>
              <input
                type="textarea"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Search your favourite game"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              
              <div className="px-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => searchGames(e)}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            
            <ul className="auto-suggestions">
            {title.length !=0 ?title.map((item,index)=>(
              <li onClick={()=>titleSearch(item)} key={index}>{item}</li>
            )):
            <></>
          }
            </ul>
          </form>

          <div className="row">
            {games !== null &&
              games.map((game, index) => (
                <div className="col-lg-3 col-sm-12 col-md-4 p-4">
                  <div
                    className="card "
                    style={{ width: "100%", height: "100%" }}
                  >
                    <ul className="list-group list-group-flush ">
                      <li className="list-group-item">
                        <b>{game.title}</b>
                      </li>
                      <li className="list-group-item">{game.platform}</li>
                      <li className="list-group-item">{game.score}</li>
                      <li className="list-group-item">{game.genre}</li>
                      <li className="list-group-item">{game.editors_choice}</li>
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
