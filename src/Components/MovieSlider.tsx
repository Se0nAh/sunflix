import {useState} from "react";
import {IGetMoviesResult} from "../api";
import {useHistory, useRouteMatch} from "react-router-dom";
import {AnimatePresence, motion, useScroll} from "framer-motion";
import {makeImagePath} from "../utils";
import styled from "styled-components";
const offset = 6;

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
    zIndex: 5,
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const buttonVariants = {
  hover: {
    opacity: 1,
    color: "white",
    backgroundColor: "rgb(255, 255, 255, 0.5)",
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
      filter: 'blur(50px)',
},
  },
};


const MovieSlider = ({data, sliderTitle}: { data: IGetMoviesResult | undefined, sliderTitle: string }) => {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string, sliderTitle: string }>("/movies/:movieId");
  const { scrollY } = useScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}/${sliderTitle}`);
  };
  const onOverlayClick = () => history.push("/");
  if (!data) return <></>;

  const changeIndex = (increase: 'INCREASE' | 'DECREASE') => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (increase === 'INCREASE') setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      else setIndex((prev) => (prev === 0 ? maxIndex : prev + 1));

    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev + 1));
    }
  };


  return (
    <Wrapper style={{border: '2px red'}}>

      <SliderTitle> {sliderTitle} </SliderTitle>
      <LeftArrowBtn variants={buttonVariants} onClick={()=>changeIndex('DECREASE')} >
        <img src={'https://www.tving.com/img/icon_slide_left.svg'}/>
      </LeftArrowBtn>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.5 }}
            key={index}
          >
            {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + sliderTitle}
                key={movie.id}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                onClick={() => onBoxClicked(movie.id)}
                transition={{ type: "tween" }}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
          </Row>
        </AnimatePresence>

      <RightArrowBtn onClick={()=>changeIndex('INCREASE')}>
        <img src={'https://www.tving.com/img/icon_slide_right.svg'}/>
      </RightArrowBtn>
    </Wrapper>


  )
}
export default MovieSlider


const Wrapper = styled.div`
  position: relative;
  height: 300px;
  
`;

const Slider = styled.div`
  //display: flex;
  position: relative;
  height: 250px;
`;

const ArrowBtn = styled(motion.div)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  padding-left: 20px;
  padding-right: 20px;
  height: 350px;
  color: #fff;

  background-repeat: no-repeat;
  transition: all 0.3s;
  z-index: 2;
  cursor: pointer;
  display: flex;
  align-items: center;
  overflow: hidden;

  :before {
    content: '';
    border-radius: 50%;
    position: absolute;
    z-index: -1;
    width: 90px;
    height: 300px;
    filter: blur(10px);

  }
`;

const LeftArrowBtn = styled(ArrowBtn)`
  left:0;
  justify-content: start;

  :before {
    left: -20px;
    background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  }
`;

const RightArrowBtn = styled(ArrowBtn)`
  right: 0;
  justify-content: end;

  :before {
    right: -20px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  }
`;

const SliderTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  padding-left: 40px;
  padding-bottom: 40px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  //top: 0;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  position: relative;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
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
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;