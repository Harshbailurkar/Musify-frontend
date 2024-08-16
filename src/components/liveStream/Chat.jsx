import React, { useState, useMemo, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import { useChat } from "@livekit/components-react";

export default function Chat({ hostIdentity }) {
  const [value, setValue] = useState("");
  const { chatMessages, send } = useChat(hostIdentity);
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {}, [chatMessages]);

  const reversedMessages = useMemo(() => {
    return chatMessages.sort((a, b) => b.timestamp - a.timestamp);
  }, [chatMessages]);

  const onSubmit = () => {
    if (!send) {
      return;
    }
    send(value);
    setValue(""); // Clear the input field here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (value.trim() === "") {
      return;
    }
    if (isDelayed) {
      setTimeout(() => {
        setIsDelayed(true);
        onSubmit();
      }, 3000);
    } else {
      setIsDelayed(true);
      onSubmit();
    }
  };

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <div className="flex w-full md:w-1/3">
      <div className="text-white w-full md:mx-2 mt-1 px-2 border border-gray-800 rounded">
        <h1 className="flex justify-center p-3 items-center text-sm md:text-lg bg-zinc-950">
          Live Chats
        </h1>
        <div className="md:h-96 h-52 bg-zinc-950 overflow-auto ">
          {reversedMessages.map((message) => (
            <div key={message.timestamp} className="flex p-2">
              {message.from.identity.replace("host-", "") !== hostIdentity ? (
                <span className="flex">
                  <p className=" mr-2 font-bold text-blue-600">
                    {message.from?.name}:
                  </p>
                  <p className="text-gray-300 flex flex-wrap">
                    {message.message}
                  </p>
                </span>
              ) : (
                <span className="flex">
                  <p className=" mr-2 font-bold text-red-600">
                    {message.from?.name}:
                  </p>
                  <p className="text-gray-300 flex flex-wrap">
                    {message.message}
                  </p>
                </span>
              )}
            </div>
          ))}
        </div>

        <form className="flex flex-col mt-2" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex">
            <input
              type="text"
              className="w-full p-2 bg-black border focus:outline-none border-gray-700 rounded-l"
              placeholder="Write something..."
              value={value} // Bind the input value to state
              onChange={(e) => onChange(e.target.value)}
            />
            <button
              className="p-2 border border-gray-700 rounded-r"
              aria-label="Send message"
              type="submit"
            >
              <IoSend />
            </button>
          </div>
          {isDelayed && (
            <p className="text-gray-300 mt-2 text-center">
              3 sec delay mode is on for chats
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
