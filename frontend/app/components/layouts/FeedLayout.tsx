const FeedLayout = ({ contentLeft, contentRight, children, styles }: any) => {
  // const { left, middle, right } = styles
  const testStyles = false ? "border-2 border-red-500 lg:border-black " : "";
  const baseStyles = `min-w-[250px] w-full min-h-dvh ${testStyles}`;
  const leftStyles = "max-w-[275px] lg:max-w-[300px] max-md:hidden";
  const rightStyles = "max-w-[275px] lg:max-w-[300px] max-lg:hidden";
  const middleStyles = "min-w-[300px] md:min-w-[420px] lg:max-w-[600px]";

  const ContentLeft = () => {
    return (
      <div className={`${baseStyles} ${leftStyles} ${styles?.left ?? ""}`}>
        {contentLeft}
      </div>
    );
  };
  const ContentRight = () => {
    return (
      <div className={`${baseStyles} ${rightStyles} ${styles?.right ?? ""}`}>
        {contentRight}
      </div>
    );
  };
  const ContentMiddle = () => {
    return (
      <div className={`${baseStyles} ${middleStyles} ${styles?.middle ?? ""}`}>
        {children}
      </div>
    );
  };

  return (
    <div className="w-full min-h-dvh flex gap-[20px] justify-start max-lg:justify-start lg:justify-center">
      <ContentLeft />
      <ContentMiddle />
      <ContentRight />
    </div>
  );
};

export default FeedLayout;
