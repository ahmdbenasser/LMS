import { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fectchEnrolledStudents = () => {
    setEnrolledStudents(dummyStudentEnrolled);
  };

  useEffect(() => {
    fectchEnrolledStudents();
  }, []);
  return (
    enrolledStudents && (
      <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 pt-8 pb-0 ">
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border-collapse border-gray-500/20">
          <table className="table-fixed md:table-auto w-full overflow-hidden pb-4 border">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                  #
                </th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Course Title</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {enrolledStudents.map((item, index) => (
                <tr className="border-b border-gray-500/20 text-center ">
                  <td className="px-4 py-3  space-x-3">{index + 1}</td>
                  <td className="md:px-4 px-2 flex items-center py-3 space-x-3">
                    <img
                      className="w-9 h-9 rounded-full"
                      src={item.student.imageUrl}
                      alt="student image"
                    />
                    <span className="truncate px-4 py-3 ">
                      {item.student.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 truncate text-left">
                    {item.courseTitle}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-left">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default StudentsEnrolled;
