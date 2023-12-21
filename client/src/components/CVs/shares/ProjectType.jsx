import ActionButtons from "../shares/ActionButtons";
import { useBaseType } from "../../../hooks";
import TextEditCustomize from "./TextEditCustomize";

const ProjectType = ({
  handleMoveUp,
  handleMoveDown,
  handleAddAbove,
  handleAddBelow,
  handleDelete,
  handleContentChange,
}) => {
  const { isFocus, divRef1, divRef2, absoluteDivRef, handleFocusInput } =
    useBaseType(handleContentChange, "(01/2019 - Present)", 80, 40);

  return (
    <div className={`relative ${isFocus && "z-40"} block`}>
      <div
        ref={divRef1}
        className="flex w-full flex-col"
        onClick={handleFocusInput}
        role="textbox"
        tabIndex="0"
      >
        <div className="flex flex-col">
          <div className="flex">
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="(01/2019 - Present)"
              className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
            />
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="F8 TECHNOLOGY EDUCATION.,JSC"
              className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
            />
          </div>
          <div className="flex">
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="Descriptions"
              className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
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
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="Number of members"
              className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
            />
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="1"
              className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
            />
          </div>
          <div className="flex">
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="Position"
              className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
            />
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="Product Owner, BA, Developer, Tester, Video Editor"
              className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
            />
          </div>
          <div className="flex">
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="Responsibilities"
              className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
            />
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="- Developer<br>- Solution architect"
              className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
            />
          </div>
          <div className="flex">
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="Technology in use"
              className="bg-white z-20 w-[30%] px-1 py-[1px] text-sm font-bold rounded-none border-2 border-gray-300 outline-none"
            />
            <TextEditCustomize
              isFocus={isFocus}
              handleContentChange={handleContentChange}
              divRef={divRef2}
              html="- Frontend: ReactJS<br>
            - Backend: PHP (Laravel, Lumen), NodeJS, Apache Kafka, Websocket, Mongodb, MariaDB, Redis, Docker, AWS EC2, AWS S3<br>
            - Architecture: Microservice - Event driven (deploy with K8S), Websocket, SSO"
              className="bg-white z-20 w-[70%] px-1 py-[1px] text-sm font-medium rounded-none border-2 border-gray-300 outline-none"
            />
          </div>
        </div>
      </div>
      <ActionButtons
        isFocus={isFocus}
        absoluteDivRef={absoluteDivRef}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleAddAbove={handleAddAbove}
        handleAddBelow={handleAddBelow}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ProjectType;
