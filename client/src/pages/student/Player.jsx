import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";

const Player = () => {
  const { allCourses, enrolledCourses } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [openSection, setOpenSection] = useState({});

  const fetchCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
      }
    });
  };

  useEffect(() => {
    fetchCourseData();
  }, [enrolledCourses]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calcChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach(
      (lecture) => (time += lecture.lectureDuration)
    );
    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
    });
  };

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        {/* Left Column */}
        <div>
          <h2 className="text-xl font-semibold">Course Structure</h2>

          {courseData &&
            courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      className={`transition-transform ${
                        openSection[index] ? "rotate-180" : ""
                      }`}
                    />
                    <p className="font-medium">{chapter.chapterTitle}</p>
                  </div>

                  <p className="text-sm">
                    {chapter.chapterContent.length} lectures –{" "}
                    {calcChapterTime(chapter)}
                  </p>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSection[index] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="px-4 py-2 border-t">
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="flex justify-between py-1 text-sm">
                        <img
                          src={false ? assets.blue_tick_icon : assets.play_icon}
                          alt=""
                        />
                        <span>{lecture.lectureTitle}</span>

                        <div className="flex gap-2">
                          {lecture.lectureUrl && (
                            <span
                              className="text-blue-500 cursor-pointer"
                              onClick={() =>
                                setPlayerData({
                                  ...lecture,
                                  chapter: index + 1,
                                  lectureNumber: i + 1,
                                })
                              }
                            >
                              Watch
                            </span>
                          )}
                          <span>
                            {humanizeDuration(lecture.lectureDuration * 60000)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course: </h1>
            <Rating initialRating={0} />
          </div>
        </div>

        {/* Right Column */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              {" "}
              <YouTube
                iframeClassName="w-full aspect-video"
                videoId={playerData.lectureUrl.split("/").pop()}
              />
              <div className="flex justify-between items-center mt-1">
                <p>
                  {playerData.chapter}.{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button className="text-blue-600">
                  {false ? "complete" : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            <img src={courseData ? courseData.courseThumbnail : ""} alt="" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
