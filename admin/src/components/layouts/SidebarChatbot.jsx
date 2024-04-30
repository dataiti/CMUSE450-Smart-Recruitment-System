import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { sidebarChatbotItems } from "../../utils/constants";
import { Link } from "react-router-dom";
import { images } from "../../assets/images";
import { ButtonCustom, Loading } from "../shares";
import axios from "axios";
import { toast } from "react-toastify";

const SidebarChatbot = () => {
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrainModel = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_URL_SERVER}/rasa/data-train`
      );

      if (res && res.data && res.data.data) {
        const url = `${process.env.REACT_APP_RASA_SERVER_API_URL}/model/train?save_to_default_model_directory=true&force_training=true`;

        setIsLoading(true);
        const response = await axios.post(url, res.data.data, {});
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Train model thất bại");
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="bg-blue-gray-900 h-screen w-full p-1 shadow-xl shadow-blue-gray-900/5 border-r border-white">
      {isLoading && <Loading />}
      <div className="p-4 flex flex-col gap-1 items-center">
        <img src={images.chatbotavatar} alt="" className="h-16 w-16" />
        <Typography className="text-sm font-bold text-light-blue-500">
          Intelligence IT Job Finding
        </Typography>
      </div>
      <List>
        {sidebarChatbotItems.map((item) => {
          return (
            <React.Fragment key={item.id}>
              {item.childrens ? (
                <Accordion
                  open={open}
                  icon={
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={`mx-auto h-4 w-4 transition-transform${
                        !open ? "rotate-180" : ""
                      }`}
                    />
                  }
                  key={`${item.title}-${item.id}`}
                >
                  <ListItem
                    key={`${item.title}-parent`}
                    className="p-0"
                    selected={open}
                  >
                    <AccordionHeader
                      onClick={() => setOpen((prev) => !prev)}
                      className="border-b-0 p-3"
                    >
                      <ListItemPrefix>{item.icon}</ListItemPrefix>
                      <Typography className="text-sm mr-auto text-white font-bold">
                        Training
                      </Typography>
                    </AccordionHeader>
                  </ListItem>
                  <AccordionBody className="py-1">
                    <List className="p-0">
                      {item.childrens.map((itemChild) => {
                        return (
                          <Link
                            to={itemChild.path}
                            key={`${itemChild.title}-${itemChild.id}`}
                          >
                            <ListItem className="font-bold text-white text-sm">
                              <ListItemPrefix>
                                <ChevronRightIcon
                                  strokeWidth={3}
                                  className="h-3 w-5"
                                />
                              </ListItemPrefix>
                              {itemChild.title}
                            </ListItem>
                          </Link>
                        );
                      })}
                      <ListItem
                        className="font-bold text-white"
                        key={`${item.title}-train-button`}
                      >
                        <ButtonCustom
                          className="w-full"
                          onClick={handleTrainModel}
                        >
                          Train
                        </ButtonCustom>
                      </ListItem>
                    </List>
                  </AccordionBody>
                </Accordion>
              ) : (
                <Link to={item.path} key={item.id}>
                  <ListItem className="text-sm font-bold text-white">
                    <ListItemPrefix>{item.icon}</ListItemPrefix>
                    {item.title}
                  </ListItem>
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
};

export default SidebarChatbot;
