import uniqid from "uniqid";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);

  const [chapters, setChapters] = useState([]);

  const [showPop, setShowPop] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreview: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  /* ================= Chapters ================= */

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (!title) return;

      setChapters((prev) => [
        ...prev,
        {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: prev.length + 1,
        },
      ]);
    }

    if (action === "remove") {
      setChapters((prev) => prev.filter((c) => c.chapterId !== chapterId));
    }

    if (action === "toggle") {
      setChapters((prev) =>
        prev.map((c) =>
          c.chapterId === chapterId ? { ...c, collapsed: !c.collapsed } : c
        )
      );
    }
  };

  /* ================= Lectures ================= */

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPop(true);
    }

    if (action === "remove") {
      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.chapterId === chapterId
            ? {
                ...chapter,
                chapterContent: chapter.chapterContent.filter(
                  (_, i) => i !== lectureIndex
                ),
              }
            : chapter
        )
      );
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle) return;

    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.chapterId === currentChapterId
          ? {
              ...chapter,
              chapterContent: [
                ...chapter.chapterContent,
                {
                  ...lectureDetails,
                  lectureId: uniqid(),
                  lectureOrder: chapter.chapterContent.length + 1,
                },
              ],
            }
          : chapter
      )
    );

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreview: false,
    });

    setShowPop(false);
  };

  /* ================= Submit ================= */

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      courseTitle,
      coursePrice,
      discount,
      chapters,
    });
  };

  return (
    <div className="h-screen overflow-scroll p-4 md:p-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 text-gray-600"
      >
        {/* Course Title */}
        <div className="flex flex-col gap-2">
          <p>Course Title</p>
          <input
            className="border px-3 py-2 w-full"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
        </div>

        {/* Course Description */}
        <div className="flex flex-col gap-2">
          <p>Course Description</p>
          <div ref={editorRef} className="border h-40" />
        </div>

        {/* Price & Image */}
        <div className="flex gap-6 flex-wrap">
          <div>
            <p>Course Price</p>
            <input
              type="number"
              className="border px-3 py-2 w-28"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
            />
          </div>

          <div>
            <p>Thumbnail</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <img src={assets.file_upload_icon} className="w-8" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image && (
                <img src={URL.createObjectURL(image)} className="h-10" />
              )}
            </label>
          </div>
        </div>

        {/* Discount */}
        <div>
          <p>Discount %</p>
          <input
            type="number"
            min={0}
            max={100}
            className="border px-3 py-2 w-28"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        {/* Chapters */}
        {chapters.map((chapter, index) => (
          <div key={chapter.chapterId} className="border rounded mb-4">
            <div className="flex justify-between items-center p-3 border-b">
              <div className="flex items-center gap-2">
                <img
                  src={assets.dropdown_icon}
                  className={`w-3 cursor-pointer ${
                    chapter.collapsed ? "rotate-90" : ""
                  }`}
                  onClick={() => handleChapter("toggle", chapter.chapterId)}
                />
                <span className="font-semibold">
                  {index + 1}. {chapter.chapterTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
                <img
                  src={assets.cross_icon}
                  className="w-4 cursor-pointer"
                  onClick={() => handleChapter("remove", chapter.chapterId)}
                />
              </div>
            </div>

            {!chapter.collapsed && (
              <div className="p-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div
                    key={lecture.lectureId}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {lectureIndex + 1}. {lecture.lectureTitle} –{" "}
                      {lecture.lectureDuration || "0"} mins –{" "}
                      <a
                        href={lecture.lectureUrl}
                        target="_blank"
                        className="text-blue-500"
                      >
                        Link
                      </a>{" "}
                      – {lecture.isPreview ? "Free" : "Paid"}
                    </span>

                    <img
                      src={assets.cross_icon}
                      className="w-4 cursor-pointer"
                      onClick={() =>
                        handleLecture("remove", chapter.chapterId, lectureIndex)
                      }
                    />
                  </div>
                ))}

                <div
                  className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                  onClick={() => handleLecture("add", chapter.chapterId)}
                >
                  + Add Lecture
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Chapter */}
        <div
          className="border-2 border-dashed border-blue-300 rounded-lg p-3 text-center text-blue-600 cursor-pointer hover:bg-blue-50"
          onClick={() => handleChapter("add")}
        >
          + Add Chapter
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg w-max"
        >
          ADD
        </button>

        {/* Lecture Popup */}
        {showPop && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-80 relative">
              <img
                src={assets.cross_icon}
                className="w-4 absolute top-3 right-3 cursor-pointer"
                onClick={() => setShowPop(false)}
              />

              <p className="font-semibold mb-3">Add Lecture</p>

              <input
                placeholder="Lecture Title"
                className="border w-full px-2 py-1 mb-2"
                value={lectureDetails.lectureTitle}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureTitle: e.target.value,
                  })
                }
              />

              <input
                placeholder="Duration (mins)"
                className="border w-full px-2 py-1 mb-2"
                value={lectureDetails.lectureDuration}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureDuration: e.target.value,
                  })
                }
              />

              <input
                placeholder="Lecture URL"
                className="border w-full px-2 py-1 mb-2"
                value={lectureDetails.lectureUrl}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    lectureUrl: e.target.value,
                  })
                }
              />

              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={lectureDetails.isPreview}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreview: e.target.checked,
                    })
                  }
                />
                Free Preview
              </label>

              <button
                className="bg-blue-600 text-white w-full py-2 rounded"
                onClick={addLecture}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCourse;
