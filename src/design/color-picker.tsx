import React, { useCallback, useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Button, Dropdown } from '@uni/design';

interface ColorPickerProps {
  defaultColor?: string;
  onChange?: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  defaultColor = '#9298B5',
  onChange,
}: ColorPickerProps) => {
  const [color, setColor] = useState(defaultColor || '#326eff');

  const [visible, setVisible] = useState(false);
  const onChangeComplete = useCallback(({ hex }: any) => {
    setColor(hex);
    onChange && onChange(hex);
  }, [onChange]);

  const clickHandler = useCallback((evt: Event) => {
    const paths = evt.composedPath();
    const inside = paths.find((item: HTMLElement) => item.className === 'float-picker');
    if (inside) return;
    setVisible(false);
  }, []);

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  useEffect(() => {
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, [clickHandler]);

  return (
    <div className="component-color-picker">
      <Dropdown
        visible={visible}
        trigger={['click']}
        onVisibleChange={(v) => setVisible(v)}
        overlay={
          <div className="float-picker">
            <SketchPicker
              color={color}
              onChange={onChangeComplete}
            />
          </div>
        }
      >
        <div className="picker" style={{ backgroundColor: color }} />
      </Dropdown>
      
        <Button style={{ width: 99, height: 24 }}>{color}</Button>
    </div>
  );
};

ColorPicker.defaultProps = {
  defaultColor: '#9298B5',
  onChange: (color) => console.log('color', color),
};

export default ColorPicker;
