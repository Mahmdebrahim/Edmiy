import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Rating } from "primereact/rating";
import { Accordion, AccordionTab } from "primereact/accordion";
import {
  PlayCircle,
  Lock,
  Clock,
  CheckCircle,
  AlarmClock,
  Video,
  ArrowDown,
  ArrowLeft,
} from "lucide-react";
import Youtube from "react-youtube";

import { assets } from "../../assets/assets";
// import PropagateLoader from 'react-spinners'
import { PropagateLoader } from "react-spinners";
function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    allCourses,
    calcAvgRatin,
    calcChapterTime,
    calcCourseDuration,
    calcLecturesNo,
    calcLecTime,
  } = useContext(AppContext);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playedData, setPlayedData] = useState(null);

  // ✅ Function to parse HTML description
  const parseHTMLDescription = (htmlString) => {
    if (!htmlString) {
      return {
        mainHeading: "",
        paragraphs: [],
        listItems: [],
      };
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, "text/html");

      return {
        mainHeading: doc.querySelector("h2")?.textContent || "",
        paragraphs: Array.from(doc.querySelectorAll("p"))
          .map((p) => p.textContent.trim())
          .filter(Boolean),
        listItems: Array.from(doc.querySelectorAll("ul li"))
          .map((li) => li.textContent.trim())
          .filter(Boolean),
      };
    } catch (error) {
      console.error("Error parsing HTML:", error);
      return {
        mainHeading: "",
        paragraphs: [],
        listItems: [],
      };
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Course ID is missing");
      setLoading(false);
      return;
    }

    if (!allCourses?.length) {
      setLoading(true);
      return;
    }

    const found = allCourses.find((c) => c._id === id);

    if (found) {
      setCourseData(found);
      setError(null);
    } else {
      setError("Course not found");
    }

    setLoading(false);
  }, [id, allCourses]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <PropagateLoader color="#155dfc" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || "Course not found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/course-list")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  // ✅ Parse description after checking courseData exists
  const description = parseHTMLDescription(courseData.courseDescription);

  // Success state - Show course
  return (
    <>
      <div className="relative md:py-36 md:px-36 px-8 md:pt-30 pt-20 ">
        <div className="absolute top-0 left-0 w-full h-2/5 -z-1 bg-linear-to-b from-blue-300/50"></div>
        <div>
          <button
            onClick={() => navigate("/course-list")}
            className="flex items-center  w-fit gap-2 text-gray-500 hover:text-gray-700 transition-colors pb-4 py-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Courses
          </button>
        </div>
        <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between text-left">
          {/* left column */}
          <div className="max-w-xl z-10 text-gray-500">
            <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
              {courseData.courseTitle}
            </h1>
            <p
              className="pt-4 md:text-base text-sm"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription.slice(0, 200),
              }}
            ></p>

            {/* rating */}
            <div className="flex items-center gap-2 mb-3 pt-3">
              <span className="text-sm font-semibold text-gray-800">
                {calcAvgRatin(courseData).toFixed(1)}
              </span>
              <Rating
                value={calcAvgRatin(courseData)}
                readOnly
                cancel={false}
                pt={{
                  item: { className: "p-rating-item" }, // اختياري
                  onIcon: {
                    className: "text-yellow-500 !text-yellow-500",
                  },
                  offIcon: {
                    className: "text-gray-300",
                  },
                }}
              />
              <span className="text-blue-500 text-sm">
                ({courseData.courseRatings.length}{" "}
                {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
              </span>
              <p className="text-gray-500 text-sm">
                {courseData.enrolledStudents.length}{" "}
                {courseData.enrolledStudents.length > 1
                  ? "students"
                  : "student"}
              </p>
            </div>
            <p className="text-sm">
              Course by{" "}
              <span className="text-blue-500 underline">maxmilian</span>
            </p>

            <div className="pt-12 text-gray-800">
              {/* Course Structure */}
              <div className="">
                <h2 className="text-2xl font-bold mb-4">Course Structure</h2>

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
                              {lecture.isPreviewFree ? (
                                <PlayCircle
                                  size={18}
                                  className="text-blue-600 group-hover:text-blue-700"
                                />
                              ) : (
                                <Lock size={18} className="text-gray-400" />
                              )}
                              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                {lecture.lectureTitle}
                              </span>
                              {lecture.isPreviewFree && (
                                <span
                                  onClick={() =>
                                    setPlayedData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium"
                                >
                                  Preview
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={14} />
                              <span>
                                {calcLecTime(lecture.lectureDuration)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionTab>
                  ))}
                </Accordion>
              </div>

              {/* ✅ Course Description - UPDATED SECTION */}
              <div className="pt-6 space-y-6">
                {/* Main Description */}
                {(description.mainHeading ||
                  description.paragraphs.length > 0) && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      {description.mainHeading || "Course Description"}
                    </h2>
                    <div className="space-y-4">
                      {description.paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-gray-700 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* What you'll learn */}
                {description.listItems.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      What you'll learn
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {description.listItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle
                            size={20}
                            className="text-green-600 mt-0.5 shrink-0"
                          />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="max-w-106 z-10 rounded-t md:rounded-none overflow-hidden bg-white min-w-75 sm:min-w-105 shadow-md ">
            {playedData ? (
              <Youtube
                videoId={playedData.videoId}
                opts={{
                  playerVars: {
                    autoplay: 1,
                  },
                }}
                iframeClassName="w-full aspect-video"
              />
            ) : (
              <img src={courseData.courseThumbnail} alt="courseThumbnail" />
            )}

            <div className="p-5">
              <div className="flex gap-1.5  text-red-500">
                <AlarmClock />
                <p>
                  <span className="font-medium">5 day</span> left as this price!
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 ">
                <p className="text-2xl md:text-4xl font-semibold text-gray-800">
                  $
                  {(
                    courseData.coursePrice -
                    (courseData.discount * courseData.coursePrice) / 100
                  ).toFixed(2)}
                </p>

                {courseData.discount && (
                  <>
                    <del className="text-gray-400 md:text-lg">
                      ${courseData.coursePrice}
                    </del>
                  </>
                )}
                <p className="md:text-lg text-gray-500">
                  {courseData.discount}% off{" "}
                </p>
              </div>
              <div className="flex gap-3 items-center pt-2 mt-2 border-t border-gray-100 ">
                <div className="flex gap-1 text-gray-500 ">
                  <img src={assets.star} />{" "}
                  {calcAvgRatin(courseData).toFixed(1)}
                </div>
                <div className="h-4 w-px bg-gray-500/40"></div>
                <div className="flex items-center gap-1">
                  <img src={assets.time_clock_icon} alt="clock icon" />
                  <p className="text-gray-500">
                    {calcCourseDuration(courseData)}
                  </p>
                </div>
                <div className="h-4 w-px bg-gray-500/40"></div>
                <div className="flex items-center gap-2">
                  <img src={assets.lesson_icon} alt="clock icon" />
                  <p className="text-gray-500">{calcLecturesNo(courseData)} </p>
                </div>
              </div>
              <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">
                {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
              </button>

              <div className="pt-6">
                <p className="md:text-xl text-lg font-medium text-gray-800">
                  What's in the course ?
                </p>
                <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                  <li>Lifetime access with free updates .</li>
                  <li>Step-by-step, hands-on project guidance. </li>
                  <li>Downloadable resources and source code. </li>
                  <li>Quizzes to test your knowledge .</li>
                  <li>Certificate of completion .</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetails;
