import { createContext, useEffect } from "react";
import { useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration"

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [allCourses, setAllCourses] = useState([]);

  const fetchAllCourses = async () => {
    setTimeout(() => {
      setAllCourses(dummyCourses);
    }, 3000);
  };
  // calculate avrage rating coursse
  const calcAvgRatin = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRate = 0;
    course.courseRatings.forEach((rating) => {
      totalRate += rating.rating;
    });
    return totalRate / course.courseRatings.length;
  };

  //calculate course chapter time

  const calcChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lec) => (time += lec.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //calculate course  Duration

  const calcCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((ch) =>
      ch.chapterContent.map((lec) => (time += lec.lectureDuration)),
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //calculate course  Duration

  const calcLecTime = (lecTime) => {
    return humanizeDuration(lecTime * 60 * 1000, { units: ["h", "m"] });
  };

  //calculate number of lec in the course
  
  const calcLecturesNo = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((ch) =>
     totalLectures += ch.chapterContent.length,
    );
    return totalLectures;
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const value = {
    allCourses,
    calcAvgRatin,
    calcChapterTime,
    calcCourseDuration,
    calcLecturesNo,
    calcLecTime
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
