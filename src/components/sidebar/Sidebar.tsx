import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from 'antd';
import { routeUrls } from "../../routes";

import './sidebar.css'
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { FileOutlined, AimOutlined, HomeOutlined, MinusCircleOutlined } from "@ant-design/icons";


export const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const items: ItemType<MenuItemType>[] = [
    {
      key: routeUrls.home,
      label: "Count Hand",
      onClick: () => navigate(routeUrls.home),
      icon: <HomeOutlined />,
    },
    {
      key: routeUrls.vite,
      label: "Find Best Joker",
      onClick: () => navigate(routeUrls.vite),
      icon: <AimOutlined />,
    }
  ]

  return (
    <div className="sidebar">
      <div className="padding-md text-center selectness border-normal">
        <h1 className="sidebar-title">Cribbage Helper</h1>
      </div>

      <Menu
        theme="light"
        selectedKeys={[`${location.pathname}`]}
        mode="inline"
        className="padding-top-lg"
        items={items}
      />;
    </div>
  );
}

export default SideBar;