import React, { useState, useMemo, useEffect } from 'react';
import {  Message } from '@uni/design';
import MenuData from './menu.config';
import { MenuType, DataType } from './index';
import { DownloadCopyPNG, DownloadCopySVG, Copy } from '../utils';
import CurrentIcon from './current';


interface IconFlexProps {
  data: any[];
  lineWidth: number;
  size: number;
  color: string;
  currentMenu: MenuType;
  isBatch?: boolean;
  batchData: DataType[];
  setBatchData: (data: DataType[]) => void;
  isChecked: boolean;
  isLine: boolean;
  setMenus: (menu: MenuType[]) => void;
}


const IconFlex = (props: IconFlexProps) => {
  const [simple, setSimple] = useState(false);
  const [active, setActive] = useState('');
  const {
    data,
    size,
    lineWidth,
    color,
    currentMenu,
    isBatch,
    setBatchData,
    batchData,
    isChecked,
    isLine,
    setMenus,
  }= props;


  const OperationPng = (current: DataType, isDownload: boolean) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    DownloadCopyPNG(current, size, color, lineWidth, isDownload);
    Message.info({
      content: isDownload ? '下载PNG成功' : '复制PNG成功',
    });
  };

  const OperationSvg = (current: DataType, isDownload: boolean) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    DownloadCopySVG(current, size, color, lineWidth, isDownload);
    Message.info({
      content: isDownload ? '下载SVG成功' : '复制SVG成功',
    });
  }

  const handleClick = (current: DataType) => {
    if (!isBatch) {
      setActive(current.englishName || '');
      DownloadCopySVG(current, size, color, lineWidth);
      Message.info({ content: '复制SVG成功' });
    } else {
      if (batchData.some((i) => i.englishName === current.englishName)) {
        setBatchData(batchData.filter((i) => i.englishName !== current.englishName));
      } else {
        const list = [...batchData];
        list.push({...current, level: currentMenu.level });
        setBatchData(list);
      }
    }
  };

  const handleCode = (current: DataType, type: 'react' | 'vue') => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (type === 'react') {
      const lw = current.type === 'Line' ? `lineWidth={${lineWidth}}` : '';
      const res = `<Icon name="${current.englishName}" ${lw} style={{ fontSize: ${size}, color: '${color}' }} />`;
      Copy(res);
    } else {
      const lw = current.type === 'Line' ? `:lineWidth="${lineWidth}"` : '';
      const res = `<Icon name="${current.englishName}" ${lw} style="color: ${color}; fontSize: ${size}px"  />`;
      Copy(res);
    }
    Message.info({
      content: type === 'react' ? '复制React代码成功' : '复制Vue代码成功',
    });
  }
  const popNode = (item: any) => {
    return (
      <div className='popNode'>
        <div onClick={handleCode(item, 'react')}>复制React代码</div>
        <div onClick={handleCode(item, 'vue')}>复制Vue代码</div>
        <div onClick={OperationPng(item, false)}>复制PNG</div>
        <div onClick={OperationSvg(item, false)}>复制SVG</div>
        <div onClick={OperationPng(item, true)}>下载PNG</div>
        <div onClick={OperationSvg(item, true)}>下载SVG</div>
      </div>
    )
  }
  const showData = useMemo(() => {
    if (isChecked) {
      const objData: any = {};
      batchData.filter((i) => isLine ? i.type === 'Line' : i.type === 'Surface').forEach((item) => {
        const name = item.category ? item.category.split('/')[1] : '';
        if (objData[name]) {
          Object.assign(objData, {
            [name]:  objData[name].concat(item),
          })
        } else {
          Object.assign(objData, {
            [name]: [item],
          })
        }
      });
      return objData;
    };
    return {[currentMenu.title]: data};
  }, [isChecked, isBatch, data, batchData, isLine]);

  useEffect(() => {
    if (isChecked) {
      const keys = Object.keys(showData).map((i: string) => ({ title: i, isTemp: true, children: [] }));
      setMenus(keys);
    } else {
      setMenus(MenuData)
    }
  }, [isChecked]);

  return (
    <div className='right'>
      {Object.values(showData).map((item: DataType[], index: number) => (
        <CurrentIcon
          size={size}
          color={color}
          lineWidth={lineWidth}
          popNode={popNode}
          simple={simple}
          setSimple={setSimple}
          data={item}
          handleClick={handleClick}
          batchData={batchData}
          active={active}
          setActive={setActive}
          idx={index}
          key={index}
          title={item.length > 0 &&  item[0].category ? item[0].category.split('/')[1] : ''}
        />
      ))}
    </div>
  )
}

export default IconFlex;
