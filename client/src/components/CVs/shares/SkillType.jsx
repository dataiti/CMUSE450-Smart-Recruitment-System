import ActionButtons from "../shares/ActionButtons";
import TextEditCustomize from "./TextEditCustomize";
import { useBaseType } from "../../../hooks";

const SkillType = ({
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
          html="Main"
          className={`bg-white z-20 font-bold w-[14%] px-1 py-[1px] text-sm rounded-none border-2 outline-none ${
            isFocus ? "border-gray-500" : "border-transparent"
          }`}
        />
        <TextEditCustomize
          isFocus={isFocus}
          handleContentChange={handleContentChange}
          divRef={divRef2}
          html="- HTML, CSS, JavaScript (ReactJS, React-Native, Lit)<br>
              - PHP (Laravel, Symfony, Codeigniter, Yii)<br>
              - Node (ExpressJS)<br>
              - RESTful API, GraphQL<br>
              - MySQL, PostgreSQL, NoSQL (MongoDB)<br>
              - Server (Apache, Nginx, Redis, Memcached, Queue, Log, Crontjob...), Rancher, K8S, Docker<br>
              - AWS (Load balancing, EC2, ECS, Router 53, RDS, S3)"
          className={`bg-white z-20 w-[86%]
              px-1 py-[1px] text-sm font-medium rounded-none border-2 outline-none ${
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

export default SkillType;
