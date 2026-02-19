import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { ProgressBar } from "primereact/progressbar";
import { Skeleton } from "primereact/skeleton"; // ← أضفناه
import { AppContext } from "../../context/AppContext";


export default function MyEnrollments() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل

  const { allCourses, calcAvgRatin, calcCourseDuration } =
    useContext(AppContext);
  const navigate = useNavigate();

  // بيانات تجريبية (ممكن تحذفها لاحقًا لو هتجيب الـ progress من الـ backend)
  const [progressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 },
  ]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      setProducts(allCourses);
      setLoading(false);
    }
  }, [allCourses]);

  // Skeleton لكل صف (نستخدمها في body لكل عمود)
  const skeletonBody = () => <Skeleton height="1.5rem" className="w-full" />;

  const imageSkeleton = () => (
    <Skeleton shape="rectangle" height="80px" className="w-24" />
  );

  const progressSkeleton = () => (
    <div className="flex flex-col gap-3 w-full">
      <Skeleton height="1.2rem" className="w-5/6" />
      <Skeleton height="14px" className="w-40" />
    </div>
  );

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Courses</span>
    </div>
  );

  const footer = `In total there are ${products.length} products`;

  if (loading) {
    return (
      <div className="md:px-36 px-8 pt-10">
        <h2 className="text-home-heading-small text-gray-800 font-bold mb-4">
          My Enrollments
        </h2>
        <div className="card">
          <DataTable
            value={Array.from({ length: 6 })}
            className="p-datatable-striped"
          >
            <Column
              header="Thumbnail"
              body={imageSkeleton}
              style={{ width: "10%" }}
            />
            <Column
              header="Course Title"
              body={progressSkeleton}
              style={{ width: "30%" }}
            />
            <Column
              header="Duration"
              body={skeletonBody}
              style={{ width: "15%" }}
            />
            <Column
              header="Reviews"
              body={skeletonBody}
              style={{ width: "15%" }}
            />
            <Column
              header="Completed"
              body={skeletonBody}
              style={{ width: "15%" }}
            />
            <Column
              header="Status"
              body={skeletonBody}
              style={{ width: "15%" }}
            />
          </DataTable>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h2 className="text-home-heading-small text-gray-800 font-bold mb-4">
          My Enrollments
        </h2>
        <div className="card">
          <DataTable value={products} header={header} footer={footer}>
            <Column
              header="Thumbnail"
              body={(rowData) => (
                <img
                  src={rowData.courseThumbnail}
                  alt={rowData.courseTitle}
                  className="w-26 shadow-2 border-round"
                />
              )}
              style={{ width: "10%" }}
            />

            <Column
              field="courseTitle"
              header="Course Title"
              body={(rowData, { rowIndex }) => (
                <div className="flex flex-col gap-4 w-full">
                  <span className="font-medium flex-1 min-w-0 truncate">
                    {rowData.courseTitle || "—"}
                  </span>

                  <div className="shrink-0">
                    <ProgressBar
                      value={
                        progressArray[rowIndex]
                          ? (progressArray[rowIndex].lectureCompleted /
                              progressArray[rowIndex].totalLectures) *
                            100
                          : 0
                      }
                      displayValueTemplate={(value) => `${Math.round(value)}%`}
                      style={{ height: "14px" }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
              style={{ width: "30%", minWidth: "220px" }}
            />

            <Column
              field="Duration"
              header="Duration"
              body={(rowData) => <span>{calcCourseDuration(rowData)}</span>}
              style={{ width: "15%" }}
            />

            <Column
              field="rating"
              header="Reviews"
              body={(rowData) => (
                <Rating
                  value={calcAvgRatin(rowData)}
                  readOnly
                  cancel={false}
                  pt={{
                    onIcon: { className: "text-yellow-500 !text-yellow-500" },
                    offIcon: { className: "text-gray-300" },
                  }}
                />
              )}
              style={{ width: "15%" }}
            />

            <Column
              field="Completed"
              header="Completed"
              body={(rowData, { rowIndex }) =>
                progressArray[rowIndex]
                  ? `${progressArray[rowIndex].lectureCompleted} / ${progressArray[rowIndex].totalLectures} Lectures`
                  : "0 / 0 Lectures"
              }
              style={{ width: "15%" }}
            />

            <Column
              field="Status"
              header="Status"
              body={(rowData, { rowIndex }) => {
                const progress = progressArray[rowIndex];
                if (!progress)
                  return <span className="text-gray-500">No data</span>;

                const isCompleted =
                  progress.lectureCompleted / progress.totalLectures === 1;

                return (
                  <button
                    onClick={() => navigate(`/player/${rowData._id}`)}
                    className={`p-button p-button-text p-button-plain p-button-rounded p-button-sm ${
                      isCompleted ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    {isCompleted ? "Completed" : "On Going"}
                  </button>
                );
              }}
              style={{ width: "15%" }}
            />
          </DataTable>
        </div>
      </div>
      
    </>
  );
}
