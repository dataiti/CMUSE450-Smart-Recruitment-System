import React from "react";

const ExperienceInput = ({
  divRef1,
  divRef2,
  isFocus,
  label,
  value,
  description,
}) => {
  return (
    <>
      <div
        ref={divRef1}
        className={`bg-white z-20 font-bold w-[24%] px-1 py-[1px] text-sm rounded-none border-2 outline-none ${
          isFocus ? "border-gray-500" : "border-transparent"
        }`}
        spellCheck={false}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <div className="flex flex-col w-[76%]">
        <div
          ref={divRef2}
          className={`bg-white z-20 min-w-[30px] px-1 py-[1px] text-sm font-bold uppercase rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: value }}
        />
        <div
          ref={divRef2}
          className={`bg-white z-20 min-w-[30px] px-1 py-[1px] text-sm font-medium rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </>
  );
};

const TextInput = ({ divRef2, isFocus, value }) => {
  return (
    <>
      <div
        ref={divRef2}
        className={`bg-white z-20 min-w-[30px] px-1 py-[1px] text-sm font-medium rounded-none border-2 outline-none ${
          isFocus ? "border-gray-500" : "border-transparent"
        }`}
        spellCheck={false}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </>
  );
};

const ProjectInput = ({ divRef2 }) => {
  return (
    <>
      <div className="flex">
        <div
          ref={divRef2}
          className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "(01/2019 - Present)" }}
        />
        <div
          ref={divRef2}
          className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-bold uppercase rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "F8 TECHNOLOGY EDUCATION.,JSC" }}
        />
      </div>
      <div className="flex">
        <div
          ref={divRef2}
          className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "Descriptions" }}
        />
        <div
          ref={divRef2}
          className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{
            __html: "Learn programming online (https://f8.edu.vn)",
          }}
        />
      </div>
      <div className="flex">
        <div
          ref={divRef2}
          className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "Number of members" }}
        />
        <div
          ref={divRef2}
          className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "1" }}
        />
      </div>
      <div className="flex">
        <div
          ref={divRef2}
          className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "Position" }}
        />
        <div
          ref={divRef2}
          className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{
            __html: "Product Owner, BA, Developer, Tester, Video Editor",
          }}
        />
      </div>
      <div className="flex">
        <div
          ref={divRef2}
          className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "Responsibilities" }}
        />
        <div
          ref={divRef2}
          className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{
            __html: "- Developer<br>- Solution architect",
          }}
        />
      </div>
      <div className="flex">
        <div
          ref={divRef2}
          className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: "Technology in use" }}
        />
        <div
          ref={divRef2}
          className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
          spellCheck={false}
          contentEditable={true}
          dangerouslySetInnerHTML={{
            __html:
              "- Frontend: ReactJS<br>" +
              "- Backend: PHP (Laravel, Lumen), NodeJS, Apache Kafka, Websocket, Mongodb, MariaDB, Redis, Docker, AWS EC2, AWS S3<br>" +
              "- Architecture: Microservice - Event driven (deploy with K8S), Websocket, SSO",
          }}
        />
      </div>
    </>
  );
};

const InfoInput = ({ divRef1, divRef2, isFocus, label, value, isBlock }) => {
  return (
    <>
      <div
        ref={divRef1}
        className={`bg-white z-20 font-bold ${
          isBlock && "w-[14%]"
        } px-1 py-[1px] text-sm rounded-none border-2 outline-none ${
          isFocus ? "border-gray-500" : "border-transparent"
        }`}
        spellCheck={false}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <div
        ref={divRef2}
        className={`bg-white z-20 ${
          isBlock && "w-[86%]"
        } px-1 py-[1px] text-sm font-medium rounded-none border-2 outline-none ${
          isFocus ? "border-gray-500" : "border-transparent"
        }`}
        spellCheck={false}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </>
  );
};

const TitleInput = ({ divRef2, isFocus, value }) => {
  return (
    <>
      <div
        ref={divRef2}
        className={`bg-white text-teal-600 text-3xl uppercase z-20 min-w-[30px] px-1 py-[2px] font-extrabold rounded-none border-2 outline-none ${
          isFocus ? "border-gray-500" : "border-transparent"
        }`}
        spellCheck={false}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </>
  );
};

export { ExperienceInput, TextInput, ProjectInput, InfoInput, TitleInput };
