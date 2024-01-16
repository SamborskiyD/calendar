"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { deleteEvent } from "@/db/actions";
import * as yup from "yup";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  timeFrom: yup.string(),
  timeTo: yup.string(),
});

const hoursToMinutes = (timeFrom, timeTo) => {
  const startTime = new Date();
  const endTime = new Date();
  const minTime = new Date();

  minTime.setHours(8, 0, 0, 0);
  startTime.setHours(
    timeFrom.split(":")[0],
    timeFrom.split(":")[1],
    0,
    0
  );
  endTime.setHours(timeTo.split(":")[0], timeTo.split(":")[1], 0, 0);

  const start = (startTime - minTime) / 30 / 1000;
  const duration = (endTime - startTime) / 60 / 1000;

  return {start, duration}
};

const minutesToHours = (start, duration) => {

  const timeFrom = new Date()
  const timeTo = new Date()
  const minTime = new Date();

  minTime.setHours(8, 0, 0, 0);
  timeFrom.setTime(minTime.getTime() + start*30*1000)
  timeTo.setTime(minTime.getTime() + start*30*1000 + duration*60*1000)

  return {timeFrom: timeFrom.toLocaleTimeString(), timeTo: timeTo.toLocaleTimeString()}
}

const ModalWindow = ({ event, onClose, onSave }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      title: event?.title,
      ...minutesToHours(event?.start, event?.duration)
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    
    const time = hoursToMinutes(data.timeFrom, data.timeTo)

    const payload = {
      id: event?.id ? event.id : Math.floor(Math.random() * 100000),
      title: data.title,
      ...time
    };

    const res = await onSave(payload);
    if (res?.error) {
      setError("root.serverError", {
        message: res.error,
      });
    } else {
      onClose();
    }
  };

  const onDelete = async () => {
    await deleteEvent(event.id);
    onClose();
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-gray-500 opacity-50"></div>

      <div className="absolute z-10 top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center">
        <div className="min-w-[70vw] md:min-w-[50vw] lg:min-w-[40vw] p-5 bg-white rounded-xl relative flex flex-col gap-5">
          <svg
            onClick={onClose}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute top-2 right-2 w-6 h-6 text-darkBlue cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            method="post"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-gray-400 text-lg">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                className="input"
              />
              {errors.title?.message && (
                <p className=" text-red-500 mt-2" role="alert">
                  {errors.title?.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-between">
              <div className="flex flex-col gap-2 w-[50%]">
                <label htmlFor="timeFrom" className="text-gray-400 text-lg">
                  From
                </label>
                <input
                  type="time"
                  id="timeFrom"
                  {...register("timeFrom")}
                  className="input"
                />
                {errors.timeFrom?.message && (
                  <p className=" text-red-500 mt-2" role="alert">
                    {errors.timeFrom?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-[50%]">
                <label htmlFor="timeTo" className="text-gray-400 text-lg">
                  To
                </label>
                <input
                  type="time"
                  id="timeTo"
                  {...register("timeTo")}
                  className="input"
                />
                {errors.timeTo?.message && (
                  <p className=" text-red-500 mt-2" role="alert">
                    {errors.timeTo?.message}
                  </p>
                )}
              </div>
            </div>

            {event && (
              <button onClick={onDelete} className="button button__delete">
                Delete Event
              </button>
            )}

            <button className="button button__submit">Submit</button>
            {errors.root?.serverError && (
              <p className=" text-red-500 mt-2 text-center">
                {errors.root.serverError.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalWindow;
