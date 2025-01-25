/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../ReduxStore/ReduxHooks";
import { IoMdClose } from "react-icons/io";
import { setUploadRatingBox } from "../../ReduxStore/features/uploadRatingBox";
import { Rating, Stack } from "@mui/material";

const UploadRating = memo(() => {
    const [selectedStars, setSelectedStars] = useState<number>(1);
    const [ratingDescription, setRatingDescription] = useState<string>("");

    const uploadRatingBox = useAppSelector((state) => state.uploadRatingBox);
    const dispatch = useAppDispatch();

    return (
      <div
        className={` flex flex-col items-center justify-center fixed top-0 w-[100vw] h-[100vh] px-[20px] bg-[#10141E] bg-opacity-90  z-[1000] transform transition-all duration-300 ${
          uploadRatingBox.open ? "" : "hidden"
        } `}
      >
        <section className="flex flex-col bg-[#161D2F] p-[24px] pb-[32] rounded-[10px] md:rounded-[20px] w-[100%] md:w-[536px] ">
          <div className="flex justify-end  ">
            <IoMdClose
              style={{
                color: "white",
                width: "24px",
                height: "24px",
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(setUploadRatingBox({ open: false, id: -1, name: "" }));
                setRatingDescription("");
                setSelectedStars(1);
              }}
            />
          </div>
          <h1 className="text-white text-[18px] md:text-[24px] ">
            Add review on {uploadRatingBox.name}
          </h1>
          <div className="flex items-center gap-[20px] mt-[24px] ">
            <Stack spacing={1}>
              <Rating
                name="half-rating"
                defaultValue={1}
                precision={1}
                style={{ border: "white" }}
                onChange={(e: any) => {
                  setSelectedStars(e.target.value);
                }}
                size="large"
                sx={{
                  "& .css-9xw0na-MuiRating-icon ": {
                    color: "#fab907",
                  },
                }}
              />
            </Stack>
            <p className="text-[#fab907] text-[24px]">{selectedStars}</p>
          </div>
          <textarea
            className="w-[100%] bg-transparent rounded-[20px] border-[1px] border-[#fab907] mt-[24px] resize-none focus:outline-none p-[10px] text-white "
            name="description"
            rows={3}
            value={ratingDescription}
            onChange={(e) => {                
              setRatingDescription(e.target.value);
            }}
            maxLength={100}
          ></textarea>
          <div className="flex justify-end mt-[24px]" >
            <button className="bg-[#fab907] text-white px-[6px] py-[2px] rounded-[12px] " >Submit</button>
          </div>
        </section>
      </div>
    );
  }
);

export default UploadRating;
