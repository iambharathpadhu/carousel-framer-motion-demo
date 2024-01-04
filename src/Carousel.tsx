import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";

const slides = [
  "src/assets/slides/1.png",
  "src/assets/slides/2.png",
  "src/assets/slides/3.png",
  "src/assets/slides/4.png",
  "src/assets/slides/5.png",
  "src/assets/slides/6.png",
  "src/assets/slides/7.png",
  "src/assets/slides/8.png",
  "src/assets/slides/9.png",
  "src/assets/slides/10.png",
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const Carousel = ({ isFullscreen }: { isFullscreen: boolean }) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const imageIndex = wrap(0, slides.length, page);

  const paginate = (newDirection: number) => {
    setPage(page + newDirection);
    setDirection(newDirection);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          paginate(-1);
          break;
        case "ArrowRight":
          paginate(1);
          break;
        default:
          break;
      }
    },
    [paginate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={slides[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AnimatePresence>
      {!isFullscreen && (
        <div className="next" onClick={() => paginate(1)}>
          {"‣"}
        </div>
      )}
      {!isFullscreen && (
        <div className="prev" onClick={() => paginate(-1)}>
          {"‣"}
        </div>
      )}
    </>
  );
};
