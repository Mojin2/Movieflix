import { click } from "@testing-library/user-event/dist/click";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
  IGetTopMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;
const Slider = styled.div`
  position: relative;
  top: -130px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: whitesmoke;
  height: 200px;
  font-size: 66px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 200%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  z-index: 98;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 99;
`;
const BigCover = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 300px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 46px;
  position: relative;
  top: -60px;
`;
const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  top: -80px;
  position: relative;
`;
const offset = 6;
const SliderTitle = styled.div`
  padding: 10px 10px;
  font-size: 24px;
`;
const IncreaseButton = styled.div`
  border: none;
  position: relative;
  z-index: 97;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    font-size: 30px;
  }
`;
const SliderTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
function Home() {
  const history = useHistory();
  const { scrollY } = useScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/now/:movieId"
  );
  const bigTopMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/top/:movieId"
  );
  const bigComingMovieMatch = useRouteMatch<{ movieId: string }>(
    "/movies/coming/:movieId"
  );
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: topData, isLoading: topLoading } =
    useQuery<IGetTopMoviesResult>(["movies", "topRating"], getTopRatedMovies);
  const { data: upcomingData, isLoading: upcoimgLoading } =
    useQuery<IGetTopMoviesResult>(["movies", "upcoming"], getUpcomingMovies);
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseTopIndex = () => {
    if (topData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = topData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const increaseComingIndex = () => {
    if (upcomingData) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = upcomingData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [leaving, setLeaving] = useState(false);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/now/${movieId}`);
  };
  const onTopBoxClicked = (movieId: number) => {
    history.push(`/movies/top/${movieId}`);
  };
  const onComingBoxClicked = (movieId: number) => {
    history.push(`/movies/coming/${movieId}`);
  };
  const onOverlayClick = () => {
    history.push("/");
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  const clickedTopMovie =
    bigTopMovieMatch?.params.movieId &&
    topData?.results.find(
      (movie) => movie.id + "" === bigTopMovieMatch.params.movieId
    );
  const clickedComingMovie =
    bigComingMovieMatch?.params.movieId &&
    upcomingData?.results.find(
      (movie) => movie.id + "" === bigComingMovieMatch.params.movieId
    );
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitleWrapper>
              <SliderTitle>Now Playing</SliderTitle>
              <IncreaseButton onClick={increaseIndex}>►</IncreaseButton>
            </SliderTitleWrapper>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((prev) => !prev)}
            >
              <Row
                transition={{ type: "tween", duration: 1 }}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index1}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index1, offset * index1 + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  exit={{ opacity: 0 }}
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId + ""}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,black,transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          <Slider style={{ top: "100px" }}>
            <SliderTitleWrapper>
              <SliderTitle>Top rated</SliderTitle>
              <IncreaseButton onClick={increaseTopIndex}>►</IncreaseButton>
            </SliderTitleWrapper>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((prev) => !prev)}
            >
              <Row
                transition={{ type: "tween", duration: 1 }}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index2}
              >
                {topData?.results
                  .slice(1)
                  .slice(offset * index2, offset * index2 + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "top"}
                      onClick={() => onTopBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTopMovieMatch ? (
              <>
                <Overlay
                  exit={{ opacity: 0 }}
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTopMovieMatch.params.movieId + "top"}
                >
                  {clickedTopMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,black,transparent),url(${makeImagePath(
                            clickedTopMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTopMovie.title}</BigTitle>
                      <BigOverview>{clickedTopMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
          <Slider style={{ top: "340px" }}>
            <SliderTitleWrapper>
              <SliderTitle>Upcoming</SliderTitle>
              <IncreaseButton onClick={increaseComingIndex}>►</IncreaseButton>
            </SliderTitleWrapper>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving((prev) => !prev)}
            >
              <Row
                transition={{ type: "tween", duration: 1 }}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index3}
              >
                {upcomingData?.results
                  .slice(1)
                  .slice(offset * index3, offset * index3 + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "coming"}
                      onClick={() => onComingBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigComingMovieMatch ? (
              <>
                <Overlay
                  exit={{ opacity: 0 }}
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigComingMovieMatch.params.movieId + "coming"}
                >
                  {clickedComingMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,black,transparent),url(${makeImagePath(
                            clickedComingMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedComingMovie.title}</BigTitle>
                      <BigOverview>{clickedComingMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
