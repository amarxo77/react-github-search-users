import React, { useState, useEffect, createContext, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = createContext();

export default function GithubContextProvider({ children }) {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  const searchGithubUser = async (user) => {
    setIsLoading(true);
    toggleError();
    try {
      const { data } = await axios(`${rootUrl}/users/${user}`);
      setGithubUser(data);
      const { login, followers_url } = data;
      const { data: repos } = await axios(
        `${rootUrl}/users/${login}/repos?per_page=100`
      );
      setRepos(repos);
      const { data: followers } = await axios(`${followers_url}?per_page=100`);
      setFollowers(followers);
    } catch (error) {
      console.log(error);
      if (error.status === 404) {
        return toggleError(true, "there is no user with that username");
      }
    } finally {
      checkRequests();
      setIsLoading(false);
    }
  };

  const checkRequests = async () => {
    try {
      const { data } = await axios(`${rootUrl}/rate_limit`);
      const { remaining } = data.rate;
      setRequests(remaining);
      if (remaining === 0) {
        toggleError(true, "sorry you have exceeded your hourly rate limit");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(() => {
    checkRequests();
  }, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        isLoading,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
}

export const useGithubContext = () => useContext(GithubContext);
