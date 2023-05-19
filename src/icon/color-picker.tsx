import React, { useCallback, useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Dropdown } from '@uni/design';

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


  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);



  return (
    <div className="component-color-picker" id="component-color-picker">
      <Dropdown
        visible={visible}
        trigger={['click']}
        onVisibleChange={(v) => {
          setVisible(v)
        }}
        getPopupContainer={() => document.querySelector('#component-color-picker')}
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
      
        <div className='color'>{color}</div>
    </div>
  );
};

ColorPicker.defaultProps = {
  defaultColor: '#9298B5',
  onChange: (color) => console.log('color', color),
};

export default ColorPicker;
