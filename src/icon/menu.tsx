import React, { useState } from 'react';
import { Icon } from '@uni/design';
import { MenuType } from './index';



interface MenuProps {
  currentMenu: MenuType;
  setCurrentMenu: (current: MenuType) => void;
  setLine: (siLine: boolean) => void;
  isChecked: boolean;
  specialIcon: string[];
  menus: MenuType[];
}

const MenuCom = (props: MenuProps) => {
  const { currentMenu, setCurrentMenu, setLine, isChecked, specialIcon,  menus } = props;
  const [openTitle, $OpenTitle] = useState(['基础图标', 'M域特殊图标']);
  const handleClick = (i: MenuType) => (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    evt.preventDefault();
    setCurrentMenu(i);
    const parent = document.getElementById('checkedContent');
    const scrollChild = document.getElementById(i.title) as HTMLElement
    if ( scrollChild && parent) {
      parent.scrollTo({
        top: scrollChild.offsetTop - 55,
        // behavior: 'smooth',
      })
    }
    
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
            {item.title}
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
                  <div
                    className={`item ${currentMenu.title === i.title ? 'active' : ''}`}
                    onClick={handleClick(i)}
                    key={i.title}
                  >
                    {i.title}
                  </div>
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