import React, { useContext, useMemo, useEffect, useState } from "react";
import SearchBar from "../../components/common/searchBar";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "../../components/students/courseCard";
import { assets } from "../../assets/assets";
import { PropagateLoader } from "react-spinners";
function CourseList() {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [loading, setLoading] = useState(true);

  //!
  // const [filteredCourses, setFilteredCourses] = useState([]);
  // useEffect(() => {
  //   if (allCourses && allCourses.length > 0) {
  //     let tempCourses = allCourses.slice();
  //     console.log(tempCourses);
  //     input
  //       ? setFilteredCourses(
  //           tempCourses.filter((c) =>
  //             c.courseTitle.toLowerCase().includes(input.toLowerCase()),
  //           ),
  //         )
  //       : setFilteredCourses(tempCourses);
  //   }
  //   setLoading(false);
  //   console.log(filteredCourses);
  // }, [allCourses, input]);

  const filteredCourses = useMemo(() => {
    if (!allCourses?.length) return [];
    if (!input || input.trim() === "") return allCourses;

    const searchTerm = input.toLowerCase().trim();

    return allCourses.filter(
      (course) =>
        course.courseTitle?.toLowerCase().includes(searchTerm) ||
        course.educator?.name?.toLowerCase().includes(searchTerm),
    );
  }, [allCourses, input]);

  // Handle loading separately with useEffect
  useEffect(() => {
    if (allCourses?.length > 0) {
      setLoading(false);
    }
  }, [allCourses]);

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

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex flex-wrap md:flex-row px-4 md:px-0 flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>

            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar />
        </div>
        {input ? (
          <div className="inline-flex items-center gap-4 px-4 py-2 mt-8 -mb-8  border border-gray-300 text-gray-600">
            <p>{input}</p>
            <img
              className="cursor-pointer"
              src={assets.cross_icon}
              onClick={() => navigate("/course-list")}
            />
          </div>
        ) : (
          ""
        )}
        <div className="px-4 py-10 md:py-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            ) : (
              <div className="col-span-full flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
                <svg
                  className="mb-6 h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mb-2 text-xl font-semibold text-gray-700">
                  No courses found
                </h3>
                <p className="mb-6 max-w-md text-gray-500">
                  Sorry, we couldn't find any courses matching your search "
                  {input}"
                </p>
                <button
                  onClick={() => navigate("/course-list")}
                  className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Show All Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseList;
