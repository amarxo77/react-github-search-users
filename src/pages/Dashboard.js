import React from "react";
import { Info, Repos, User, Search, Navbar } from "../components";
import loadingImage from "../images/preloader.gif";
import { useGithubContext } from "../context/context";
const Dashboard = () => {
  const { isLoading } = useGithubContext();

  return (
    // <main>
    //   <Navbar />
    //   <Search />
    //   <Info />
    //   <User />
    //   <Repos />
    // </main>
    <main>
      <Navbar />
      <Search />
      {isLoading ? (
        <>
          <img src={loadingImage} className="loading-img" alt="loading" />
        </>
      ) : (
        <>
          <Info />
          <User />
          <Repos />
        </>
      )}
    </main>
  );
};

export default Dashboard;
