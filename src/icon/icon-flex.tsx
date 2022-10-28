import React, { useState } from 'react';
import { Message } from '@uni/design';
import { MenuType, DataType, TestDataType, SpecialMap } from './index';
import { DownloadCopyPNG, DownloadCopySVG, Copy } from '../utils';
import CurrentIcon from './current';


interface IconFlexProps {
  lineWidth: number;
  size: number;
  color: string;
  currentMenu: MenuType;
  isBatch?: boolean;
  batchData: DataType[];
  setBatchData: (data: DataType[]) => void;
  resultData: TestDataType,
}


const IconFlex = (props: IconFlexProps) => {
  const [simple, setSimple] = useState(false);
  const [active, setActive] = useState('');
  const {
    size,
    lineWidth,
    color,
    currentMenu,
    isBatch,
    setBatchData,
    batchData,
    resultData,
  }= props;


  const OperationPng = (current: DataType, isDownload: boolean) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    DownloadCopyPNG(current, size, color, lineWidth, isDownload);
    Message.success({
      content: isDownload ? '下载PNG成功' : '复制PNG成功',
    });
  };

  const OperationSvg = (current: DataType, isDownload: boolean) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    DownloadCopySVG(current, size, color, lineWidth, isDownload);
    Message.success({
      content: isDownload ? '下载SVG成功' : '复制SVG成功',
    });
  }

  const handleClick = (current: DataType) => {
    if (!isBatch) {
      setActive(current.englishName || '');
      DownloadCopySVG(current, size, color, lineWidth);
      Message.success({ content: '复制SVG成功' });
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
    Message.success({
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

  const test =  Object.values(resultData).sort((a: any, b: any) => a.level - b.level).map((i) => i.data);
  return (
    <div className='right'>
      {test.map((item: DataType[], index: number) => (
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
          isBatch={isBatch}
          title={item.length > 0 &&  item[0].category ? SpecialMap[item[0].category.split('/')[1]] ||  item[0].category.split('/')[1]: ''}
        />
      ))}
    </div>
  )
}

export default IconFlex;
