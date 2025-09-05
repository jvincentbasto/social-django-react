interface WrapperProps {
  children: React.ReactNode;
  // [key: string]: unknown;
}

const LayoutWrapper = ({ children }: WrapperProps) => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full min-w-[375px] max-w-[1400px] px-[20px] mx-auto">
        <div className="w-full h-full min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
