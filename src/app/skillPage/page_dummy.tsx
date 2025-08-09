"use client";

export default function SkillPage() {
  return (
    <main className="flex flex-row items-center justify-evenly h-screen w-full bg-gray-800">
      {/* Side Bar */}
      {/* <div className="h-9/10 w-[18%] mt-8 rounded-md border-[0.5px] border-slate-400 bg-gray-700 flex flex-col justify-between p-4">
        
        Menu Items
        <div className="flex flex-col space-y-3">
          {["Dashboard", "Notes", "Skills"].map((item) => (
            <button
              key={item}
              className="w-full py-2 px-4 rounded-md text-left bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-200"
            >
              {item}
            </button>
          ))}
        </div>

        Profile Button at Bottom
        <button className="mt-auto py-2 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-200">
          Profile
        </button>
      </div> */}

      {/* Skill RoadMap */}
      <div className="bg-gray-800 border-[0.2px] border-slate-400 rounded-xl shadow-lg p-6 w-[39.5%] h-9/10 mx-auto mt-8">
        {/* Modal Header */}
        <div className="flex flex-row items-center justify-between border-b-2 border-slate-500 pb-3">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">
            Progress Review: <span className="italic">Dummy Skill</span>
          </h2>
          <div className="flex items-center justify-end w-[40%] dark:text-white mr-5">
            <div className="mr-3 w-full bg-gray-200 rounded-full h-2.5 border-[0.5px] dark:bg-gray-800 dark:border-slate-500 dark:text-white">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: `65%` }}
              ></div>
            </div>
            <p>65%</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto h-full w-full mt-6 pr-2 space-y-3">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="border border-gray-600 rounded-md">
              {/* Module Accordion Button */}
              <div className="w-full flex justify-between items-center px-4 py-2 bg-gray-700 text-white font-medium cursor-default">
                <span>Dummy Module {idx + 1}</span>

                {/* Progress bar and dropdown icon */}
                <div className="flex flex-row items-center justify-end gap-3 w-3/5">
                  <div className="w-[30%] mr-3 bg-gray-200 rounded-full h-2.5 border-[0.5px] dark:bg-gray-800 dark:border-slate-500">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{ width: `${40 + idx * 20}%` }}
                    ></div>
                  </div>
                  <p>{40 + idx * 20}%</p>
                  <span>
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Hardcoded Submodules */}
              <ul className="px-6 pb-3 pt-1 list-none text-md space-y-1">
                {["First Subtask", "Second Subtask", "Third Subtask"].map(
                  (title, i) => (
                    <li
                      key={i}
                      className={`relative pl-6 ${
                        i % 2 === 0
                          ? "before:content-['✓'] before:text-green-400 text-slate-200"
                          : "before:content-['•'] before:text-amber-600 text-slate-400"
                      } before:absolute before:left-0 before:top-0.5`}
                    >
                      {title}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Close Button (non-functional) */}
        {/* <div className="flex justify-end gap-4 mt-4 mr-2">
          <button className="px-4 py-1 text-sm rounded-md mr-2 bg-slate-300 cursor-not-allowed">
            Close
          </button>
        </div> */}
      </div>

      {/* Learning Area */}
      <div className="h-9/10 w-[60%] mt-8 rounded-xl border-[0.5px] border-slate-400 bg-gray-700 p-4 flex flex-col items-start justify-start space-y-4">
        <h3 className="text-lg font-semibold text-gray-200 border-b border-slate-500 pb-2 w-full">
          Learning Area
        </h3>
        {/* <p className="text-sm text-slate-400">
          This is a placeholder for the learning section.
        </p> */}
        <div className="w-full h-9/10 bg-gray-800 rounded-md border border-gray-600 flex items-center justify-center text-slate-500 text-sm">
            Learning content will appear here.<br/>
            Draggable width of the roadmap and learning area.<br/>
            Expand Icon on the learning area to take max width of the page.<br/>
        </div>
      </div>
    </main>
  );
}
