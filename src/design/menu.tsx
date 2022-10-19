import React from 'react';
import MenuData from './menu.config';

interface MenuType {
  title: string;
  children?: MenuType[];
}

interface MenuProps {
  currentMenu: string;
  setMenu: (current: string) => void;
  setLine: (siLine: boolean) => void;
}

const MenuCom = (props: MenuProps) => {
  const { currentMenu, setMenu, setLine } = props;
  const handleClick = (i: MenuType) => (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.preventDefault();
    setMenu(i.title);
    const specialIcon = ['管理中台图标', '供应链图标', '办公组图标']; // 只有面性图标才有特殊图标
    setLine(specialIcon.includes(i.title) ? false : true);
  }
  return (
    <div className='menu'>
      {(MenuData || []).map((item: MenuType) => (
        <div key={item.title}>
          <div className='submenu'>
            {item.title}
          </div>
          <div>
            {(item.children || []).map((i) => (
              <div className={`item ${currentMenu === i.title ? 'active' : '' }`} onClick={handleClick(i)} key={i.title}>{i.title}</div>
            ))}
            </div>
        </div>
      ))}
    </div>
  )
};

export default MenuCom;