/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/prop-types */
import React, {
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import { Icon } from '@uni/design';
import './anchor.less';

export interface AnchorProps {
  position?: 'static' | 'fixed';
  /** 滚动时间 默认300毫秒 */
  duration?: number;
  dirs: { id: string, name: string }[];
  /** position：relative 字体颜色 默认：#3B5ED9 */
  color?: string;
  isMenu?: boolean;
}

export const Anchor = memo<AnchorProps>((props) => {
  const {
    position = 'fixed',
    duration = 300,
    color = '#3B5ED9',
    dirs = [],
    isMenu,
  } = props;
  const { current: obj } = useRef({ clickTo: '', isClick: false, timer: null as any });
  const [, update] = useState(0);

  const onClick = useCallback<typeof scrollToTop>((id, duration) => {
    obj.clickTo = id;
    obj.isClick = true;
    clearTimeout(obj.timer);
    obj.timer = setTimeout(() => {
      obj.isClick = false;
    }, duration + 100);
    scrollToTop(id, duration);
    update(new Date().getTime());
  }, []);

  useEffect(() => {
    if (position === 'static') return;
    const scroll = () => {
      if (obj.isClick) return;
      const scrollTop = document.documentElement.scrollTop;
      const offsetTop = 64;
      let activedId = '';
      dirs.forEach((item) => {
        if (scrollTop + offsetTop + 25 > (document.getElementById(item.id)?.offsetTop ?? 0)) {
          activedId = item.id;
        }
      });
      if (activedId !== obj.clickTo) {
        obj.clickTo = activedId;
        update(new Date().getTime());
      }
    };

    window.addEventListener('scroll', scroll);
    return () => {
      window.removeEventListener('scroll', scroll);
    };
  }, [dirs, position]);


  if (position === 'fixed') {
    return (
      <div
        style={{
          position,
          top: 161,
          right: 0,
          width: 120,
          borderLeft: '1px solid #D8D8D8',
        }}
        className="site-anchor-fixed"
      >
        {dirs.map((item) => (
          <div
            key={item.id}
            data-class={`item actived-${obj.clickTo === item.id}`}
            onClick={() => onClick(item.id, duration)}
            title={item.name}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  }

  const [menuActive, $menuActive] = useState('定义');
  const [isOpen, $open] = useState(true);

  if (position === 'static' && isMenu) {
    return (
      <div className='menu-content'>
        <div className='design-menu' onClick={() => $open(!isOpen)}>
          图标
          <Icon type={isOpen ? 'down' : 'up'}style={{ color: '#B3BACA'}} />
        </div>
        <div className='submenu' style={{ height: isOpen ? '100%' : 0, overflow: 'hidden'}}>
          {(dirs || []).map((item) => (
            <div
              key={item.id}
              className={`submenu-item ${menuActive === item.id ? 'item-active' : ''}`}
              onClick={() => {
                $menuActive(item.id);
                onClick(item.id, duration);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position,
        borderLeft: `4px solid ${color}`,
      }}
      className="site-anchor-static"
    >
      <div
        style={{
          fontSize: 14,
          lineHeight: '20px',
          marginBottom: 18,
          color: 'rgba(0, 0, 0, 0.65)',
          cursor: 'default',
          fontWeight: 400,
        }}
      >
        目录
      </div>
      {dirs.map((item) => (
        <div
          style={{ color }}
          key={item.id}
          data-class="item"
          onClick={() => onClick(item.id, duration)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
});

const scrollToTop = (id: string, duration: number) => {
  const ele = document.getElementById(id);
  const startTop = document.documentElement.scrollTop;
  if (!ele) return;
  const { offsetTop } = ele;
  // const { height } = document.querySelectorAll('.g-header')[0].getBoundingClientRect();
  const height = 0;
  // 预留64的偏移量(header 的高度)
  const gap = 64;
  const endTop = offsetTop - height - gap;

  const distance = endTop - startTop;
  if (Math.abs(distance) === 0) return;
  let start: number;
  const step: FrameRequestCallback = (timestamp) => {
    if (start === undefined) {
      start = timestamp;
    }
    const timeGap = Math.ceil(timestamp - start);
    const elapsed = Math.min(timeGap, duration);
    if (elapsed > duration) return;
    // eslint-disable-next-line no-mixed-operators
    const tempDistance = distance * elapsed / duration;
    document.documentElement.scrollTop = startTop + tempDistance;
    if (elapsed < duration) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};
