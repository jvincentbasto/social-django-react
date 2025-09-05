import { Link, useNavigate } from "react-router";
import { useAuth } from "~/contexts/useAuth";
import envs from "~/constants/envs";

import LayoutWrapper from "./LayoutWrapper";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const { apiUrl } = envs;

interface PrivateRouteProps {
  children?: React.ReactNode;
  // [key: string]: unknown;
}

const samples = {
  image1: "https://m.media-amazon.com/images/I/5132RLcVxhL.jpg",
  image2:
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
};

const Navbar = ({}: PrivateRouteProps) => {
  const navigate = useNavigate();
  const { loggedIn, dataUser, logout } = useAuth();
  // const {} = useAuth();

  const profileImage = dataUser?.profileImage
    ? `${apiUrl}${dataUser?.profileImage}`
    : samples.image1;

  const Logo = () => {
    return (
      <div className="min-w-0 flex items-center gap-[10px]">
        <a
          href="/"
          className="link no-underline text-[18px] font-black uppercase"
        >
          Social
          {/* <span className="capitalize text-primary">django</span> */}
        </a>
      </div>
    );
  };
  const Navs = () => {
    const linkStyles = { size: "20px" };
    const privateLinks = [
      { icon: <IoMdAddCircleOutline {...linkStyles} />, path: "/post/create" },
    ];
    const links = [
      { icon: <IoSearch {...linkStyles} />, path: "/search" },
      ...(loggedIn ? privateLinks : []),
    ];

    return (
      <div className="min-w-0 flex items-center gap-[5px]">
        {links.map((m, i) => {
          return (
            <a key={i} href={m.path} className="btn btn-ghost btn-circle">
              {m.icon}
            </a>
          );
        })}
      </div>
    );
  };
  const Menu = () => {
    const handleLogout = async (e: React.MouseEvent) => {
      await logout();
      navigate(`/`);
    };

    const menuItems = [
      { name: "Profile", href: dataUser ? `/${dataUser.username}` : "" },
      {
        name: "Settings",
        href: dataUser ? `/settings` : "",
      },
      { name: "Logout", href: "", onClick: handleLogout },
    ];

    const MenuItem = ({ item }: { item: (typeof menuItems)[number] }) => {
      const btn = item.onClick ? (
        <button onClick={item.onClick} className="">
          {item.name}
        </button>
      ) : (
        <Link to={item.href} className="">
          {item.name}
        </Link>
      );

      return <li>{btn}</li>;
    };

    if (!loggedIn) return null;

    return (
      <div className="flex items-center">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-[36px] rounded-full">
              <img alt="User Profile Picture" src={profileImage} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 min-w-[150px] mt-[20px] p-[10px] shadow-md"
          >
            {menuItems.map((item, i) => {
              return <MenuItem key={i} item={item} />;
            })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="navbar w-full h-[70px] bg-white shadow-md">
      <LayoutWrapper>
        <div className="w-full h-full flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-[10px]">
            <Navs />
            <Menu />
          </div>
        </div>
      </LayoutWrapper>
    </div>
  );
};

export default Navbar;
