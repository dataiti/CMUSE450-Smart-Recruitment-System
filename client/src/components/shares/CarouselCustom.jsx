import { Carousel } from "@material-tailwind/react";
import { icons } from "../../utils/icons";
import IconButtonCustom from "./IconButtonCustom";

const CarouselCustom = ({ images = [], isNaviagtion = true }) => {
  return (
    <Carousel
      className="rounded-md"
      autoplay={true}
      loop={true}
      transition={{ type: "tween", duration: 0.3 }}
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div
          className={`${
            !isNaviagtion && "hidden"
          } absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2`}
        >
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-[#212f3f]" : "w-4 bg-light-blue-600"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
      prevArrow={({ handlePrev }) => (
        <IconButtonCustom
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className={`${
            images.length <= 1 && "hidden"
          } !absolute top-2/4 left-4 -translate-y-2/4`}
        >
          <icons.IoIosArrowDropleftCircle size={24} />
        </IconButtonCustom>
      )}
      nextArrow={({ handleNext }) => (
        <IconButtonCustom
          variant="text"
          color="white"
          size="lg"
          onClick={handleNext}
          className={`${
            images.length <= 1 && "hidden"
          } !absolute top-2/4 right-4 -translate-y-2/4`}
        >
          <icons.IoIosArrowDroprightCircle size={24} />
        </IconButtonCustom>
      )}
    >
      {images?.map((image, index) => {
        return (
          <div className="h-full w-full" key={index}>
            <img
              src={image}
              alt="banner"
              className="h-full w-full object-cover"
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export default CarouselCustom;
