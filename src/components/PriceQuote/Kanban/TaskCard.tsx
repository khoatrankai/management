import React, { useRef } from "react";
import { Draggable } from "@hello-pangea/dnd";
import styled from "@emotion/styled";
import { Popover } from "antd";
import { RiAttachment2 } from "react-icons/ri";
import { IoMenuOutline } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store/store";
// import { useParams } from "next/navigation";
import { IGetPriceQuote } from "@/models/priceQuoteInterface";
const TaskInformation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
  min-height: 80px;
  border-radius: 5px;
  overflow: hidden;
  max-width: 311px;
  background: white;
  margin-top: 15px;

  .secondary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-weight: 400px;
    color: #7d7d7d;
  }
  /* .priority{ */
  /* margin-right: 12px; */
  /* align-self: center;
    svg{
      width: 12px !important;
      height: 12px !important;
      margin-right: 12px; */
  /* margin-top: 2px; */
  /* } */
  /* } */
`;
type Props = {
  item: IGetPriceQuote;
  index: number;
};
const TaskCard = ({ item, index }: Props) => {
  // const { id } = useParams();
  const refBtn = useRef<HTMLButtonElement>();
  return (
    <Draggable
      key={item.price_quote_id}
      draggableId={item.price_quote_id}
      index={index}
    >
      {(provided) => {
        // console.log(provided);
        return (
          <div
            onClick={() => {}}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TaskInformation
              className="shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
              onClick={() => {
                refBtn.current?.click();
              }}
            >
              {/* {item.picture_urls && item.picture_urls?.length > 0 && (
                <div
                  className="w-full h-40 overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="h-full">
                    <Image
                      alt=""
                      width={270}
                      height={160}
                      className="object-cover"
                      src={item.picture_urls[item.picture_urls.length - 1].url}
                    />
                  </div>
                </div>
              )} */}

              <div className="p-3 w-full flex flex-col gap-2">
                <div className="flex justify-between w-full">
                  <div>
                    <p className="text-sm font-semibold">
                      Báo giá {item.reference_code}
                    </p>
                  </div>
                  <div>
                    <div className="secondary-details">
                      <p>
                        <span>
                          {new Date(item.created_at).toLocaleDateString(
                            "en-us",
                            {
                              month: "short",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <div className="flex gap-4">
                    <Popover content={item.description}>
                      <IoMenuOutline />
                    </Popover>
                    <div className="flex gap-1 items-center">
                      <RiAttachment2 />
                      <p className="text-xs font-light">
                        {item.parts?.length ?? 0}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-black/40 font-bold">
                    {item.project.name}
                  </p>
                </div>
              </div>
            </TaskInformation>
            {/* <ModalUpdateActivity
              ID={item?.activity_id}
              idType={id as string}
              refBtn={refBtn as React.Ref<HTMLButtonElement>}
              type="schedule"
            /> */}
          </div>
        );
      }}
    </Draggable>
  );
};

export default TaskCard;

// <span className="priority">
// {item.Priority === 'High' ? (<RedArrow />) : item.Priority === 'Medium' ? (<YellowArrow />) : (<BlueArrow />)}
// </span>
// <div><CustomAvatar name={item.Assignee} isTable={false} size={16} /></div>
