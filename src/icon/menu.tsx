import React, { useState } from 'react';
import { Icon } from '@uni/design';
// import MenuData from './menu.config';
import { MenuType } from './index';



interface MenuProps {
  currentMenu: MenuType;
  setCurrentMenu: (current: MenuType) => void;
  setLine: (siLine: boolean) => void;
  isChecked: boolean;
  menus: MenuType[];
}

const MenuCom = (props: MenuProps) => {
  const { currentMenu, setCurrentMenu, setLine, menus = [], isChecked } = props;
  const [openTitle, $OpenTitle] = useState(['基础图标', 'M域特殊图标']);
  const handleClick = (i: MenuType) => (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.preventDefault();
    setCurrentMenu(i);
    const specialIcon = ['管理中台图标', '供应链图标', '办公组图标']; // 只有面性图标才有特殊图标
    if (specialIcon.includes(i.title)) {
      setLine(false);
    }
  };

  const handleChange = (key: MenuType) => {
    const list = [...openTitle];
    if (openTitle.includes(key.title)) {
      $OpenTitle(list.filter((i) => i !== key.title));
    } else {
      list.push(key.title);
      $OpenTitle([...list]);
    }
  };

  return (
    <div className='menu'>
      {isChecked ? <>
        {(menus || []).map((item) => (
          <div
            className={`item ${currentMenu.title === item.title ? 'active' : ''}`}
            onClick={handleClick(item)}
            key={item.title}
          >
            <a href={`#${currentMenu.title}`}>
              {item.title}
            </a>
          </div>
        ))}
      </>
        :
        <>
          {(menus || []).map((item: MenuType) => (
            <div key={item.title}>
              <div className='submenu' onClick={handleChange.bind(null, item)}>
                {item.title}
                <Icon type={openTitle.includes(item.title) ? 'down' : 'up'} style={{ color: '#B3BACA' }} />
              </div>
              <div style={{ height: openTitle.includes(item.title) ? '100%' : 0, overflow: 'hidden' }}>
                {(item.children || []).map((i) => (
                  <div className={`item ${currentMenu.title === i.title ? 'active' : ''}`} onClick={handleClick(i)} key={i.title}>{i.title}</div>
                ))}
              </div>
            </div>
          ))}
        </>

      }
    </div>
  )
};

export default MenuCom;