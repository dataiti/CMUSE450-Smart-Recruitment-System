import ActionButtons from "../shares/ActionButtons";
import TextEditCustomize from "./TextEditCustomize";
import { useBaseType } from "../../../hooks";

const TextType = ({
  handleMoveUp,
  handleMoveDown,
  handleAddAbove,
  handleAddBelow,
  handleDelete,
  handleContentChange,
}) => {
  const { isFocus, divRef1, divRef2, absoluteDivRef, handleFocusInput } =
    useBaseType(handleContentChange, "Main", 80, 40);

  return (
    <div className={`relative ${isFocus && "z-40"} block`}>
      <div
        ref={divRef1}
        className="flex w-full"
        onClick={handleFocusInput}
        role="textbox"
        tabIndex="0"
      >
        <TextEditCustomize
          isFocus={isFocus}
          handleContentChange={handleContentChange}
          divRef={divRef2}
          html="- Over 2 years of experience in programming with good communication and quick learning skills<br>
              - Strengths: Front-end technology and Back-end web application development<br>
              - Proficiency in HTML, CSS, JavaScript<br>
              - Experience with popular React.js workflows (such as Flux or Redux)<br>
              - Familiarity with RESTful APIs<br>
              - Strong Experience in: PHP, JavaScript (ReactJS, React-native), MySQL, NoSQL, GraphQL, Redis, JSON, API, Docker, Kubernetes, Rancher, AWS services<br>"
          className={`bg-white z-20 min-w-[30px] px-1 py-[1px] text-sm font-medium rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
        />
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

export default TextType;
