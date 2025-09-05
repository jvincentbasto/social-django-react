import LayoutWrapper from "~/components/layouts/LayoutWrapper";
import PrivateRoute from "~/components/layouts/PrivateRoute";
import Loading from "~/components/loading/Loading";

const NotFound = ({}) => {
  return (
    <PrivateRoute>
      <LayoutWrapper>
        <div className="w-full min-h-dvh">
          <div className="w-full min-h-[600px] flex justify-center items-center">
            <p>
              <Loading />
              <span className="ml-[10px]">Not Found</span>
            </p>
          </div>
        </div>
      </LayoutWrapper>
    </PrivateRoute>
  );
};

export default NotFound;
