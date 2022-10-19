import React, { useState } from 'react';
import { Popover, Message } from '@uni/design';
import ReactIcon from 'uni-icons-react';
import { SvgNode } from 'uni-icons/lib/types';
import { DownloadCopyPNG, DownloadCopySVG, Copy } from '../utils';

interface IconFlexProps {
  data: any[];
  lineWidth: number;
  size: number;
  color: string;
  currentMenu: string;
  isBatch?: boolean;
  batchData: SvgNode[];
  setBatch: (data: SvgNode[]) => void;
}


const IconFlex = (props: IconFlexProps) => {
  const { data, size, lineWidth, color, currentMenu, isBatch, setBatch, batchData }= props;
  const [simple, setSimple] = useState(false);
  const [active, setActive] = useState('');


  const OperationPng = (current: SvgNode, isDownload: boolean) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    DownloadCopyPNG(current, size, color, lineWidth, isDownload);
    Message.info({
      content: isDownload ? '下载PNG成功' : '复制PNG成功',
    });
  };

  const OperationSvg = (current: SvgNode, isDownload: boolean) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    DownloadCopySVG(current, size, color, lineWidth, isDownload);
    Message.info({
      content: isDownload ? '下载SVG成功' : '复制SVG成功',
    });
  }

  const handleClick = (current: SvgNode) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (!isBatch) {
      setActive(current.englishName || '');
      DownloadCopySVG(current, size, color, lineWidth);
      Message.info({ content: '复制SVG成功' });
    } else {
      if (batchData.some((i) => i.englishName === current.englishName)) {
        setBatch(batchData.filter((i) => i.englishName !== current.englishName));
      } else {
        const list = [...batchData];
        list.push(current) 
        setBatch(list);
      }
    }
  };

  const handleCode = (current: SvgNode, type: 'react' | 'vue') => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

  return (
    <div className='right'>
      <div className='right-header'>
        <div className='info'>{`${currentMenu}（${data.length}）`}</div>
        <div className='btns'></div>
      </div>
      <div className='right-section'>
        {data.map((item) => (
          <div key={item.englishName}>
            <div
              className='current'
              style={{
                width: simple ? 55 : 93,
                height: simple ? 55 : 93,
                border: batchData.some((i) => i.englishName === item.englishName) ? '1px solid #326EFF' : undefined,
              }}
              onClick={handleClick(item)}
            >
              <div>
                <ReactIcon name={item.englishName} lineWidth={lineWidth} style={{ fontSize: size, color: active === item.englishName ? 'rgb(74, 127, 255)' : color }} />
                {!simple && <div className='text'>{item.chineseName}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IconFlex;
