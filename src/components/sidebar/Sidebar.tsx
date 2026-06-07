import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from 'antd';
import { routeUrls } from "../../routes";

import './sidebar.css'
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { AimOutlined, CalculatorOutlined, HomeOutlined } from "@ant-design/icons";


export const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const items: ItemType<MenuItemType>[] = [
    {
      key: routeUrls.home,
      label: "Simple Count",
      onClick: () => navigate(routeUrls.home),
      icon: <HomeOutlined />,
    },
    {
      key: routeUrls.hand,
      label: "Count Hand",
      onClick: () => navigate(routeUrls.hand),
      icon: <CalculatorOutlined />,
    },
    {
      key: routeUrls.bestJoker,
      label: "Find Best Joker",
      onClick: () => navigate(routeUrls.bestJoker),
      icon: <AimOutlined />,
    }
  ]

  return (
    <>
      <div >
        <h1 className="sidebar-title">Cribbage Helper</h1>
      </div>

      <Menu
        theme="light"
        selectedKeys={[`${location.pathname}`]}
        mode="horizontal"
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
    </>
  );
}

export default SideBar;