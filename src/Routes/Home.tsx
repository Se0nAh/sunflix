import { useQuery } from "react-query";
import styled from "styled-components";
import {motion, AnimatePresence, useViewportScroll, useScroll} from "framer-motion";
import {
  getLatestMovies,
  getMovie,
  getMovies, getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
  IMovie
} from "../api";
import { makeImagePath } from "../utils";
import {useMemo, useState} from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieSlider from "../Components/MovieSlider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  min-height: 200px;
  max-height: 400px;
  height: 20%;
  
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 36px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const SliderWrapper = styled.div`
  position: relative;
  top: -100px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`


function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string, sliderTitle: string, }>("/movies/:movieId/:sliderTitle");
  const { scrollY } = useScroll();
  const { data: movieData, isLoading: isLoadingMovie } = useQuery<IMovie>(
    ["movies", "detail"],
    () => getMovie({movieId: bigMovieMatch?.params?.movieId || ''}),
    {
      enabled: !!bigMovieMatch?.params.movieId
    }
  );
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: popularData, isLoading: isLoadingPopular } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const { data: upcomingData, isLoading: isLoadingUpcoming } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );
  const { data: topRatedData, isLoading: isLoadingTopRated } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopRatedMovies
  );
  const onOverlayClick = () => history.push("/");

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            // onClick={incraseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <MovieSlider data={data} sliderTitle={'Now Playing'}/>
            {!isLoadingUpcoming && <MovieSlider data={upcomingData} sliderTitle={'Upcoming Movies'}/>}
            {!isLoadingTopRated && <MovieSlider data={topRatedData} sliderTitle={'Top Rated Movies'}/>}
            {!isLoadingPopular && <MovieSlider data={popularData} sliderTitle={'Popular Movies'}/>}
          </SliderWrapper>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId + bigMovieMatch.params.sliderTitle}
                >
                  {movieData && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            movieData.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{movieData.title}</BigTitle>
                      <BigOverview>{movieData.overview}</BigOverview>
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

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 58px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 18px;
  width: 50%;
`;