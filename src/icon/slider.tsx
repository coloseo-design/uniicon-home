/* eslint-disable no-mixed-operators */
import React, {
  useCallback, useEffect, useState,
} from 'react';
import './slider.less';

let canDrop = false;
// let start = 0;
const Slider: React.FC<any> = (props: any) => {
  const {
    disabled = false,
    max = 100,
    min = 0,
    onChange,
    value: valueFromProps,
    defaultValue,
  } = props;
  const [value, setValue] = useState(valueFromProps || defaultValue || 0);
  const [isDrop, setIsDrop] = useState(false);
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (typeof valueFromProps !== 'undefined') {
      setValue(valueFromProps);
    }
  }, [valueFromProps]);
  const prefix = 'slider';
  const wrapperClass = `${prefix} ${disabled ? `${prefix}-disabled` : ''}`

  const dotClass = `${prefix}-dot ${disabled ? `${prefix}-dot-disabled` : ''}`;

  const translateOffsetToValue = useCallback((evt: MouseEvent) => {
    const { pageXOffset } = window;
    const offsetX = evt.pageX - left - pageXOffset + 38;
    const newValue = offsetX / width * (max);
    let formatedValue = newValue;
    if (formatedValue > max) {
      formatedValue = max;
    }

    if (formatedValue < min) {
      formatedValue = min;
    }
    return formatedValue;
  }, [left, max, min, width]);

  const onRailClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return;
    // start = evt.pageX;
    const formatedValue = translateOffsetToValue(evt as unknown as MouseEvent);
    onChange && onChange(formateValue(formatedValue));
    setValue(formateValue(formatedValue));
  };

  const getPosition = (newValue = 0) => {
    const barWidthPercentage: number = (newValue - min) / (max - min) * 100;
    const barWidthCss = `${barWidthPercentage}%`;
    return barWidthCss;
  };

  const formateValue = (newValue: number) => Math.round(newValue);

  const getNode = (node: HTMLDivElement) => {
    if (node) {
      const { width: containerWidth, left: containerLeft } = node?.getBoundingClientRect();
      setWidth(containerWidth);
      setLeft(containerLeft);
    }
  };


  const onMouseMove = useCallback((evt: MouseEvent) => {
    if (canDrop) {
      const formatedValue = translateOffsetToValue(evt);
      onChange && onChange(formateValue(formatedValue));
      setValue(formateValue(formatedValue));
    }
  }, [onChange, translateOffsetToValue]);

  const onMouseUp = useCallback((evt: MouseEvent) => {
    evt.stopPropagation();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (canDrop) {
      const formatedValue = translateOffsetToValue(evt);
      onChange && onChange(formateValue(formatedValue));
    }
    canDrop = false;
    setIsDrop(false);
  }, [onChange, onMouseMove, translateOffsetToValue]);

  const onMouseDown = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return;
    // start = evt.pageX;
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
    evt.stopPropagation();
    evt.preventDefault();
    canDrop = true;
    setIsDrop(true);
  };

  return (
    <div className={wrapperClass} ref={getNode} onClick={onRailClick}>
      <div className={`${prefix}-rail`} />
      <div className={`${prefix}-bar`} style={{ width: getPosition(value) }} onClick={onRailClick} />
      <div
        className={dotClass}
        style={{ left: getPosition(value), zIndex: 1 }}
        onMouseDown={onMouseDown}
      >
        <div
          className="slider-tooltip"
          style={{
            top: -45,
            // visibility: 'visible',
            visibility: isDrop ? 'visible' : 'hidden',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="slider-tooltip-content">
            <div className="slider-tooltip-content-arrow slider-tooltip-content-arrow-top" />
            <div className="slider-tooltip-content-inner">{formateValue(value)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Slider;
