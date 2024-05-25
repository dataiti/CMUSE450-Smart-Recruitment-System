import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Rating,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { icons } from "../../utils/icons";
import { categoriesBarItems } from "../../utils/constants";
import { SelectCustom } from "../shares";
import axiosClient from "../../configs/axiosConfig";

const CategoryBar = ({
  industryFilter,
  rating,
  typeJobFilter,
  genderFilter,
  levelFilter,
  handleCheckboxChangeByType,
  setRating,
  clearFilters,
  experienceFilter,
}) => {
  const [openJobMenu, setOpenJobMenu] = useState(true);
  const [provincesValue, setProvincesValue] = useState([]);

  useEffect(() => {
    const fetchWorkLocationsApi = async () => {
      try {
        const response = await axiosClient.get("/province");
        if (response && response.data && response.data.results) {
          const provinceNames = response.data.results.map((item) => ({
            id: item.province_id,
            value: item.province_name,
          }));
          setProvincesValue(provinceNames);
        }
      } catch (error) {}
    };
    fetchWorkLocationsApi();
  }, []);

  const handleOpenJobMenu = () => {
    setOpenJobMenu(!openJobMenu);
  };

  return (
    <div>
      <div className="p-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 p-3 text-teal-800">
            <icons.HiFilter size={24} />
            <Typography className="uppercase text-sm font-bold ">
              Bộ lọc theo
            </Typography>
          </div>
          <Button
            onClick={clearFilters}
            className="bg-red-50 text-red-800 text-xs capitalize !py-2 !px-4 shadow-none hover:shadow-none"
          >
            Xoá bộ lọc
          </Button>
        </div>
        {/* <SelectCustom label="Tỉnh / Thành phố" options={provincesValue} /> */}
      </div>
      <List className="p-2 text-sm">
        {categoriesBarItems.map((item) => {
          return (
            <Accordion
              open={openJobMenu}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    openJobMenu ? "rotate-180" : ""
                  }`}
                />
              }
              key={item.id}
            >
              <ListItem className="p-0" selected={openJobMenu}>
                <AccordionHeader
                  onClick={handleOpenJobMenu}
                  className="border-b-0 p-3"
                >
                  <Typography className="mr-auto text-sm font-bold text-teal-800">
                    {item.display}
                  </Typography>
                </AccordionHeader>
              </ListItem>
              {item.type === "rating" ? (
                <div className="flex items-center gap-2 px-3">
                  <Rating
                    value={rating}
                    onChange={(value) => setRating(value)}
                  />
                  <Typography className="font-medium text-xs">
                    {rating} sao
                  </Typography>
                </div>
              ) : (
                item.childrens.map((itemChild) => {
                  return (
                    <AccordionBody className="!p-0" key={itemChild.id}>
                      <List className="!p-0">
                        <ListItem className="text-xs !py-1">
                          <ListItemPrefix>
                            <input
                              type="checkbox"
                              id={`checkbox-${itemChild.value}`}
                              value={itemChild.value}
                              onChange={() =>
                                handleCheckboxChangeByType({
                                  type: item.type,
                                  value: itemChild.value,
                                })
                              }
                              checked={
                                item.type === "industry"
                                  ? industryFilter?.includes(itemChild.value)
                                  : item.type === "gender"
                                  ? genderFilter?.includes(itemChild.value)
                                  : item.type === "level"
                                  ? levelFilter?.includes(itemChild.value)
                                  : item.type === "jobType"
                                  ? typeJobFilter?.includes(itemChild.value)
                                  : item.type === "experience"
                                  ? experienceFilter?.includes(itemChild.value)
                                  : false
                              }
                              className="custom-checkbox"
                            />
                          </ListItemPrefix>
                          <label
                            htmlFor={`checkbox-${itemChild.value}`}
                            className="w-full cursor-pointer text-blue-gray-600 text-sm font-bold hover:text-blue-gray-800"
                          >
                            {itemChild.text || itemChild.value}
                          </label>
                        </ListItem>
                      </List>
                    </AccordionBody>
                  );
                })
              )}
            </Accordion>
          );
        })}
      </List>
    </div>
  );
};

export default CategoryBar;
