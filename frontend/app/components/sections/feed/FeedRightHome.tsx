import { useEffect, useState } from "react";

const range = (value = 5) => {
  const list = Array.from({ length: value }, (_, i) => i);
  return list;
};
const randomNumber = (min = 30, max = 100) => {
  const value = Math.floor(Math.random() * (max - min + 1)) + min;
  return value;
};
const randomWidth = (min = 30, max = 100) => {
  const value = randomNumber(min, max);
  return `${value}%`;
};

const Skeleton = () => {
  const List = () => {
    const list = range(randomNumber(3, 5));

    return (
      <ul className="flex flex-col gap-[15px]">
        {list.map((i) => {
          return (
            <li key={i} className="w-full">
              <div className="w-full h-[40px] flex gap-[10px]">
                <div className="skeleton min-w-[40px] rounded-full"></div>
                <div
                  className="skeleton w-full"
                  style={{ width: randomWidth() }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const Sections = () => {
    const list = range(randomNumber(1, 3));

    return (
      <div className="w-full ">
        <div className="w-full flex flex-col gap-[40px]">
          {list.map((i) => {
            return (
              <div key={i} className="w-full flex flex-col gap-[20px]">
                <p
                  className="skeleton w-full h-[40px]"
                  style={{ width: randomWidth(60) }}
                ></p>
                <List />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <Sections />
    </div>
  );
};

export const FeedRightHomeSample = () => {
  const list = range(randomNumber(2, 3));

  return (
    <div className="w-full flex flex-col gap-[20px]">
      {list.map((i) => {
        return <FeedRightHome key={i} />;
      })}
    </div>
  );
};

const FeedRightHome = () => {
  const [hydrate, setHydrate] = useState(false);

  useEffect(() => {
    setHydrate(true);
  }, []);
  if (!hydrate) return null;

  const Wrapper = ({ children }: Record<any, any>) => {
    return (
      <div className="w-full p-[20px] rounded-[5px] bg-white shadow-md">
        {children}
      </div>
    );
  };

  if (true) {
    return (
      <Wrapper>
        <Skeleton />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Skeleton />
    </Wrapper>
  );
};
export default FeedRightHome;
