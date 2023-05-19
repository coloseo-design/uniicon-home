import React, { useCallback } from 'react';
import { Button, Divider, InputNumber } from '@uni/design';
import ColorPicker from './color-picker';
import { MenuType } from './index';
import Slider from './slider';

interface OperationProps {
  size: number,
  setSize: (size: number) => void;
  setColor: (color: string) => void;
  lineWidth: number;
  color: string;
  setLineWidth: (line: number) => void;
  setLine: (isLine: boolean) => void;
  isLine: boolean;
  currentMenu: MenuType;
  specialIcon: string[];
}

const Operation = (props: OperationProps) => {
  const {
    size,
    setSize,
    lineWidth,
    setLineWidth,
    setColor,
    color,
    isLine,
    setLine,
    currentMenu,
    specialIcon,
  } = props;

  const handleSizeChange = (val: number) => {
    setSize(val);
  };

  const handleLineChange = (val: number) => {
    setLineWidth(val);
  }


  const onChange = useCallback((selectedColor: string) => {
    setColor(selectedColor);
  }, []);

  const handleRest = () => {
    setColor('#9298B5');
    setSize(24);
    setLineWidth(2);
  }

  const handleLine = (bol: boolean) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setLine(bol);
  }


  return (
    <div className='left-fixed'>
      <div className='title' style={{ marginBottom: 8 }}>样式</div>
      <div className='btn'>
        <Button
          onClick={handleLine(true)}
          disabled={specialIcon.includes(currentMenu.title)}
          type={isLine ? "primary" : 'default'}
          style={{ width: 103, height: 24, marginRight: 8, color: !isLine ? '#5c6785' : '#fff' }}
        >
          线性
        </Button>
        <Button
          onClick={handleLine(false)}
          type={!isLine ? "primary" : 'default'}
          style={{ width: 103, height: 24, color: !isLine ? '#fff' : '#5c6785' }}
        >
          面性
        </Button>
      </div>
      <Divider style={{ borderTop: '1px solid #E8E9ED', margin: '16px 0px 8px 0px' }} />
      <div className='title'>图标大小</div>
      <div className='btn'>
        <div style={{ flex: 1, marginTop: 8, marginLeft: 8 }}>
          <Slider
            min={16}
            max={32}
            value={size}
            onChange={handleSizeChange}
            className="changeSlider"
          />
        </div>
        <InputNumber
          min={16}
          max={32}
          onChange={handleSizeChange}
          style={{ width: 49, height: 24, marginLeft: 8, color: '#5c6785' }}
          value={size}
        />
      </div>
      <Divider style={{ borderTop: '1px solid #E8E9ED', margin: '16px 0px 8px 0px' }} />
      <div className='title'>描边粗细</div>
      <div className='btn'>
        <div style={{ flex: 1, marginTop: 8, marginLeft: 8 }}>
          <Slider
            disabled={!isLine}
            min={!isLine ? 0 : 1}
            max={4}
            value={!isLine ? 0 : lineWidth}
            onChange={handleLineChange}
            className="changeSlider"
          />
        </div>
        <InputNumber
          min={1}
          max={4}
          onChange={handleLineChange}
          style={{ width: 49, height: 24, marginLeft: 8, color: '#5c6785' }}
          value={!isLine ? 0 : lineWidth}
          disabled={specialIcon.includes(currentMenu.title) || !isLine}
        />
      </div>
      <Divider style={{ borderTop: '1px solid #E8E9ED', margin: '16px 0px 6px 0px' }} />
      <div className='title'>颜色</div>
      <div className='btn'>
        <div>
          <ColorPicker defaultColor={color} onChange={onChange} />
        </div>
      </div>
      <Button
        onClick={handleRest}
        style={{ margin: '0px auto', width: 214, height: 24, marginTop: 16 }}
      >
        清空配置
      </Button>
    </div>
  )
};

export default Operation;
