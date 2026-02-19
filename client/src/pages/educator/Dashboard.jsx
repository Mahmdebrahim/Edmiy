import React, { useEffect, useState } from "react";
import { dummyDashboardData } from "../../assets/assets";
import { PropagateLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";
import { assets } from "../../assets/assets";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Dashboard() {
  const { user } = useUser();

  const [dashBoardData, setDashBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fechDashBoardData = async () => {
    setDashBoardData(dummyDashboardData);
  };

  useEffect(() => {
    fechDashBoardData();
    setLoading(false);
  }, [dashBoardData]);

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
    <div className="min-h-screen flex flex-col gap-8 md:p-2 md:pb-0 p-4 pt-8 ">
      <div className="w-full flex flex-wrap gap-5 items-center">
        <div
          className="flex items-center gap-3 shadow-card border
border-blue-500 p-4 w-56 rounded-md"
        >
          <img src={assets.appointments_icon} alt="patients_icon" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {dashBoardData?.totalCourses}
            </p>
            <p className="text-base text-gray-500">Total Courses</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
          <img src={assets.earning_icon} alt="patients_icon" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {dashBoardData?.totalEarnings}
            </p>
            <p className="text-base text-gray-500">Total Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
          <img src={assets.patients_icon} alt="patients_icon" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {dashBoardData?.enrolledStudentsData.length}
            </p>
            <p className="text-base text-gray-500">Total Students</p>
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Enrolled Students
        </h2>
        <DataTable
          value={dashBoardData?.enrolledStudentsData || []} // fallback عشان ما يحصلش error لو null
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: "50rem" }}
          emptyMessage="لا يوجد طلاب مسجلين بعد"
        >
          {/* رقم تسلسلي */}
          <Column
            header="#"
            body={(rowData, { rowIndex }) => (
              <span className="font-medium text-gray-700">{rowIndex + 1}</span>
            )}
            style={{ width: "5%"}}
          />

          {/* اسم الطالب – من داخل student */}
          <Column
            header="Student Name"
            body={(rowData) => (
              <div className="flex items-center gap-3">
                {rowData.student?.imageUrl && (
                  <img
                    src={rowData.student.imageUrl}
                    alt={rowData.student.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                )}
                <span className="font-medium">
                  {rowData.student?.name || "غير معروف"}
                </span>
              </div>
            )}
            style={{ width: "30%" }}
          />

          {/* عنوان الكورس */}
          <Column
            field="courseTitle"
            header="Course Title"
            style={{ width: "40%" }}
            body={(rowData) => (
              <span className="text-gray-800 font-medium">
                {rowData.courseTitle || "—"}
              </span>
            )}
          />

          {/* لو عايز تضيف عمود إضافي لاحقًا (مثل تاريخ التسجيل لو موجود) */}
          {/* <Column field="enrollDate" header="تاريخ التسجيل" style={{ width: "25%" }} /> */}
        </DataTable>
      </div>
    </div>
  );
}

export default Dashboard;
