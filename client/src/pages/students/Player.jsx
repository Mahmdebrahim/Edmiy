import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Accordion, AccordionTab } from "primereact/accordion";
import { PlayCircle, Lock, Clock } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { PropagateLoader } from "react-spinners";
import YouTube from "react-youtube";
import Ratingg from "../../components/students/Rating";
function Player() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    allCourses,
    calcCourseDuration,
    calcChapterTime,
    calcLecTime,
    calcLecturesNo,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vidIsLoading, setIsVidLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setNotFound(true);
      return;
    }

    if (!allCourses || allCourses.length === 0) {
      return;
    }

    const found = allCourses.find((course) => course._id === id);

    setCourseData(found || null);
    setNotFound(!found);
    setIsLoading(false);

    // if (!found) navigate("/courses");
  }, [id, allCourses]);

  const handelPlayLecture = (lecture) => {
    // setIsVidLoading(true);
    setPlayerData(lecture);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <PropagateLoader color="#155dfc" />
        </div>
      </div>
    );
  }

  if (notFound || !courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Course Not Found</h2>
          <p className="mt-4 text-gray-600">
            The link may be incorrect or the course has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-10 flex flex-col-reverse xl:grid md:grid-cols-2 gap-10 md:px-36">
        {/* left column */}
        <div className="text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span>{courseData.courseContent?.length || 0} sections</span>
            <span>•</span>
            <span>{calcLecturesNo(courseData)} lectures</span>
            <span>•</span>
            <span>{calcCourseDuration(courseData)}</span>
          </div>

          <Accordion activeIndex={0}>
            {courseData.courseContent?.map((chapter, i) => (
              <AccordionTab
                key={chapter.chapterId || i}
                header={
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="font-semibold text-gray-900">
                      {chapter.chapterTitle}
                    </span>
                    <span className="text-sm text-gray-500">
                      {chapter.chapterContent?.length || 0} lectures •{" "}
                      {calcChapterTime(chapter)}
                    </span>
                  </div>
                }
              >
                <div className="space-y-1">
                  {chapter.chapterContent?.map((lecture, idx) => (
                    <div
                      key={lecture.lectureId || idx}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {!lecture.lectureUrl ? (
                          <Lock size={18} className="text-gray-400" />
                        ) : (
                          <PlayCircle
                            size={18}
                            className="text-blue-600 group-hover:text-blue-700"
                          />
                        )}

                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {lecture.lectureTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {lecture.lectureUrl && (
                          <span
                            onClick={() =>
                              handelPlayLecture({
                                ...lecture,
                                section: i + 1,
                                lecture: idx + 1,
                              })
                            }
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium"
                          >
                            Watch
                          </span>
                        )}
                        <Clock size={14} />
                        <span>{calcLecTime(lecture.lectureDuration)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionTab>
            ))}
          </Accordion>
          <div className="mt-10 flex items-center  gap-4">
            <h3 className="text-xl font-bold ">Rate This Course:</h3>
            <Ratingg />
          </div>
        </div>

        {/* right column – placeholder for video player */}
        <div className="min-h-100 flex items-center justify-center">
          {playerData ? (
            <div>
              {vidIsLoading ? (
                <div className="flex justify-between items-center mt-1">
                  <div className="text-center">Loading video player...</div>
                </div>
              ) : (
                <>
                  <YouTube
                    videoId={playerData.lectureUrl.split("/").pop()}
                    iframeClassName="w-full aspect-video"
                    onReady={() => setIsVidLoading(false)}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p>
                      {playerData.section} . {playerData.lecture} {"-"}{" "}
                      {playerData.lectureTitle}
                    </p>
                    <button className="text-blue-600 cursor-pointer">
                      {false ? "Completed" : "Mark Complete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center">
              <PlayCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Select a lecture to start watching
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Player;
