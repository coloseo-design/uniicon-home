import React, { useState, useMemo } from 'react';
import { Button, Input, Icon, Checkbox } from '@uni/design';
import { SvgNode } from 'uni-icons/lib/types';
import * as Icons from 'uni-icons';
import MenuCom from './menu';
import Operation from './operation';
import IconFlex from './icon-flex';
import { BatchDownload,  objectToSvg} from '../utils';


import './index.less';

const { Search } = Input;

export interface ListType {
  name: string;
  svgHTML: string;
}

const AllData = Object.values(Icons);

const LineData = AllData.filter((i) => i.type === 'Line');

const SurfaceData = AllData.filter((i) => i.type === 'Surface');

const Design = () => {
  const [currentMenu, setMenu] = useState('通用名词图标');
  const [isLine, setLine] = useState(true);
  const [size, setSize] = useState(24);
  const [lineWidth, setLineWidth] = useState(2);
  const [color, setColor] = useState('#9298B5');
  const [isBatch, $isBatch] = useState(false);
  const [batchData, setBatchData] = useState<SvgNode[]>([]);
  const [isChecked, setChecked] = useState(false);
  const [searchValue, $search] = useState('');

  const handleSearch = (val: string) => {
    console.log('===val', val);
    $search(val);
  }

  const data = useMemo(() => {
    const keys = currentMenu.slice(0, currentMenu.length - 2);
    const filterData = isLine ? LineData : SurfaceData;
    const batchFilterData = isLine ? batchData.filter((i) => i.type === 'Line') : batchData.filter((i) => i.type === 'Surface');
    let result: SvgNode[] = [];
    if (searchValue) {
      const temData = isChecked ? batchFilterData : filterData;
      result = temData.filter((i) => i.search && i.search.indexOf(searchValue) >= 0);
    } else {
      result = isChecked ? batchFilterData : filterData.filter((i) => i.category && i.category.indexOf(keys) >=0);
    }
    return result;
  }, [isLine, currentMenu, isChecked, searchValue]);


  const handleExport = () => {
    const list: ListType[] = [];
    const exportData = isBatch ? batchData : data;
    exportData.forEach((item) => {
      list.push({
        name: item.englishName || '',
        svgHTML: objectToSvg(item, size, color, lineWidth),
      });
    });
    BatchDownload(list);
  };


  return (
    <div className='design-icon'>
      <div className='icon-header'>
        <div className='user'></div>
        <div className='input'>
          <Search onSearch={handleSearch} style={{ flex: 1 }} placeholder="输入图标关键词" />
          {isBatch && <div style={{ marginTop: 5, marginLeft: 8 }}>
            <Checkbox onChange={(checked) => setChecked(checked)}>仅看已选</Checkbox>
          </div>}
        </div>
        <div className='btn'>
          {isBatch ?
            <>
              <Button onClick={() => setBatchData(data)}>全部</Button>
              <Button onClick={handleExport} style={{ margin: '0px 8px' }} type='primary'>导出</Button>
              <Button onClick={() => $isBatch(false)}>取消</Button>
            </>
            :
            <>
              <Button
                style={{ marginRight: 8 }}
                onClick={() => $isBatch(true)}
              >
                <Icon type="add" style={{ fontSize: 12 }} />
                批量操作
              </Button>
              <Button onClick={handleExport} type="primary">全部导出</Button>
            </>
          }
        </div>
      </div>
      <div className='section'>
        <MenuCom
          currentMenu={currentMenu}
          setMenu={setMenu}
          setLine={setLine}
        />
        <div className='content'>
          <IconFlex
            data={data}
            size={size}
            lineWidth={lineWidth}
            color={color}
            currentMenu={currentMenu}
            isBatch={isBatch}
            batchData={batchData}
            setBatchData={setBatchData}
          />
          <Operation
            size={size}
            setSize={setSize}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            color={color}
            setColor={setColor}
            setLine={setLine}
            isLine={isLine}
            currentMenu={currentMenu}
          />
        </div>
      </div>
    </div>
  )
};

export default Design;
