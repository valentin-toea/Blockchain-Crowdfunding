import { styled } from "@stitches/react";
import { useEffect } from "react";
import Card from "../../../components/Card";
import PillButon from "../../../components/PillButon";
import {
  editProjectActions,
  selectEditProject,
} from "../../../slices/editProjectSlice";
import {
  newProjectActions,
  selectNewProject,
  setCategories,
} from "../../../slices/newProjectSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { CATEGORIES } from "../../../utils";

const categories = [
  "Supply Chain",
  "Security",
  "Service",
  "Transportation",
  "Entertainment",
  "Education",
  "Media",
  "Self Interest",
  "Animals",
  "Lala band",
  "Sales",
  "Others",
];

const Step1 = ({ editMode = false }) => {
  const dispatch = useAppDispatch();
  const selectedCategories = useAppSelector(
    !editMode ? selectNewProject : selectEditProject
  )?.categories;

  useEffect(() => {
    if (!editMode) {
      if (selectedCategories.length === 0) {
        dispatch(newProjectActions.setInvalidField(["step1"]));
      } else dispatch(newProjectActions.removeInvalidFields(["step1"]));
    } else {
      if (selectedCategories.length === 0) {
        dispatch(editProjectActions.setInvalidField(["step1"]));
      } else dispatch(editProjectActions.removeInvalidFields(["step1"]));
    }
  }, [selectedCategories, dispatch, editMode]);

  return (
    <Card>
      <Wrapper>
        <CategorySelector>
          {CATEGORIES.map((category, index) => (
            <PillButon
              key={index}
              selected={selectedCategories.some((value) => value === category)}
              value={category}
              onChange={(selected, value) => {
                const categorySelection = (() => {
                  if (selected && value && selectedCategories.length < 3)
                    return [...selectedCategories, value];
                  else if (!selected && value)
                    return selectedCategories.filter(
                      (category) => value !== category
                    );

                  return selectedCategories;
                })();

                dispatch(
                  setCategories(categorySelection.map((x) => x.toString()))
                );
              }}
            >
              {category}
            </PillButon>
          ))}
        </CategorySelector>
        <h3>Select the category that describes your project the best.</h3>
        <h4>*Maximum 3 categories. Minimum 1 category.</h4>
      </Wrapper>
    </Card>
  );
};

export default Step1;

const Wrapper = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  with: "100%",
  marginBottom: 100,
});

const CategorySelector = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: 20,
  justifyContent: "flex-start",
  maxWidth: 730,
  margin: "100px 0",
});
