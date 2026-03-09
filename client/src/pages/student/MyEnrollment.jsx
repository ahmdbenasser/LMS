import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";

const MyEnrollment = () => {
  const { enrolledCourses, calcCourseDuration, navigate } =
    useContext(AppContext);

  // في الواقع هتيجي من API أو من context أو localStorage
  // هنا بنعمل حالة افتراضية فقط للتجربة
  const [progressMap, setProgressMap] = useState({});

  // مثال: لو عايز تحمل التقدم من مكان ما (مثلاً localStorage أو API)
  useEffect(() => {
    // محاكاة بيانات تقدم (في الواقع هتيجي من backend)
    const mockProgress = enrolledCourses.reduce((acc, course) => {
      // هنا ممكن تحط منطق حقيقي أو تجيب من API
      acc[course._id] = {
        lectureCompleted: Math.floor(Math.random() * 10),
        totalLectures: Math.floor(Math.random() * 8) + 3,
      };
      return acc;
    }, {});

    setProgressMap(mockProgress);
  }, [enrolledCourses]);

  return (
    <div className="md:px-36 px-8 pt-10 pb-20">
      <h1 className="text-2xl md:text-3xl font-semibold mb-8">
        My Enrollments
      </h1>

      {enrolledCourses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          You haven't enrolled in any courses yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200">
            <thead className="bg-gray-50 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Course</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">
                  Duration
                </th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">
                  Completed
                </th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {enrolledCourses.map((course) => {
                const progress = progressMap[course._id] || {
                  lectureCompleted: 0,
                  totalLectures: 1,
                };

                const percentage = Math.min(
                  100,
                  Math.round(
                    (progress.lectureCompleted / progress.totalLectures) * 100
                  )
                );

                const isCompleted =
                  progress.lectureCompleted === progress.totalLectures &&
                  progress.totalLectures > 0;

                return (
                  <tr key={course._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.courseThumbnail}
                          alt={course.courseTitle}
                          className="w-16 sm:w-20 md:w-24 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {course.courseTitle}
                          </p>
                          <div className="mt-2">
                            <Line
                              percent={percentage}
                              strokeWidth={4}
                              strokeColor="#3b82f6"
                              trailWidth={4}
                            />
                            <p className="text-xs text-gray-500 mt-1 md:hidden">
                              {progress.lectureCompleted} /{" "}
                              {progress.totalLectures} lectures
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {calcCourseDuration(course)}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {progress.lectureCompleted} / {progress.totalLectures}
                      <span className="text-gray-400 ml-1">lectures</span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() => navigate(`/player/${course._id}`)}
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                          isCompleted
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Continue"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEnrollment;
