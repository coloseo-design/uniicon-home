import React, { useState, useMemo, useEffect } from 'react';
import { SvgNode } from '@uni/icons/lib/types';
import * as Icons from '@uni/icons';
import MenuCom from './menu';
import Operation from './operation';
import IconFlex from './icon-flex';
import MenuData from './menu.config';
import Search from './search';


import './index.less';


export interface ListType {
  name: string;
  svgHTML: string;
}

export interface MenuType {
  title: string;
  children?: MenuType[];
  level: number;
  isTemp?: boolean;
  alias?: string;
}

export interface DataType extends SvgNode {
  level?: number;
}

export interface TestDataType {
  [x: string]: {
    level: number,
    data: DataType[],
  }
}

export const SpecialMap: any = {
  'M域管理中台': '管理中台',
  'M域供应链组': '供应链',
  'M域办公组': '办公组',
}

const AllData = Object.values(Icons);

const LineData = AllData.filter((i) => i.type === 'Line');

const SurfaceData = AllData.filter((i) => i.type === 'Surface');

const specialIcon = ['管理中台图标', '供应链图标', '办公组图标'];

export const menusList = (MenuData.map((i) => i.children) as any).flat(2);

const Design = () => {
  const [currentMenu, setCurrentMenu] = useState<MenuType>({title: '通用名词图标', level: 1 });
  const [isLine, setLine] = useState(false);
  const [size, setSize] = useState(24);
  const [lineWidth, setLineWidth] = useState(2);
  const [color, setColor] = useState('#9298B5');
  // const [color, setColor] = useState('#595959');
  const [isBatch, $isBatch] = useState(false); // 是否开始批量操作
  const [batchData, setBatchData] = useState<DataType[]>([]); // 批量操作选择的icon
  const [isChecked, setChecked] = useState(false); // 是否只查看已选择的icon
  const [searchValue, $search] = useState('');
  const [menus, $menus] = useState<MenuType[]>(MenuData);

  const getData = (temData: DataType[], value: boolean | string) => {
    return typeof value !== 'boolean' ? temData.filter((i) =>( i.search && i.search.indexOf(value) >= 0 || i.englishName && i.englishName.indexOf(value) >= 0)) : temData;
  };

  const resultData = useMemo(() => {
    const batchFilter = isLine ? batchData.filter((i) => i.type === 'Line') : batchData.filter((i) => i.type === 'Surface');
    const normalData = isLine ? LineData : SurfaceData;
    const filterData = isChecked ?  getData(batchFilter, searchValue) : getData(normalData, searchValue);
    const result: TestDataType = {};
    filterData.forEach((item) => {
      const name = item.category ? item.category.split('/')[1] : '';
      if (result[name]) {
        Object.assign(result, {
          [name]:  {level: result[name].level, data: result[name].data.concat(item)},
        })
      } else {
        Object.assign(result, {
          [name]: {level: menusList.find((i: MenuType) => (i.alias === `${name}图标` || i.title === `${name}图标`))?.level || 1, data: [item]},
        })
      }
    });
    return result;
  }, [isLine, isChecked, searchValue]);


  useEffect(() => {
    if (isChecked) {
      const tem = menusList.filter((i: MenuType) => {
        const title = i.alias ? i.alias.slice(0, i.alias.length - 2) : i.title.slice(0, i.title.length - 2);
        if (Object.keys(resultData).includes(title)) {
          return { ...i, isTemp: true };
        }
      })
      tem.length > 0 && setCurrentMenu(tem[0]);
      $menus(tem.sort((a: MenuType, b: MenuType) => a.level - b.level));
    } else {
      $menus(MenuData);
    }
  }, [isChecked, isLine]);

  return (
    <div className='design-icon'>
      <Search
        $search={$search}
        searchValue={searchValue}
        isBatch={isBatch}
        setChecked={setChecked}
        batchData={batchData}
        resultData={resultData}
        isChecked={isChecked}
        setBatchData={setBatchData}
        size={size}
        color={color}
        lineWidth={lineWidth}
        $isBatch={$isBatch}
      />
      <div className='section'>
        { // 搜索为空展示
          searchValue && Object.keys(resultData).length === 0 ?
            <div className='no-content'>
              <img src={require('../assets/no-content.svg')} alt="no-content" />
            </div>
            :
            <>
              {menus.length > 0 && <MenuCom
                currentMenu={currentMenu}
                setCurrentMenu={setCurrentMenu}
                setLine={setLine}
                isChecked={isChecked}
                specialIcon={specialIcon}
                menus={menus}
              />}
              <div className='content' id="checkedContent">
                { // 仅看已选没有数据展示
                menus.length ?
                  <IconFlex
                    size={size}
                    lineWidth={lineWidth}
                    color={color}
                    currentMenu={currentMenu}
                    isBatch={isBatch}
                    batchData={batchData}
                    setBatchData={setBatchData}
                    resultData={resultData}
                  />
                  :
                  <img src={require('../assets/no-content.svg')} className="no-data" alt="no-content" />}
              </div>
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
                specialIcon={specialIcon}
              />
            </>
        }
      </div>
    </div>
  )
};

export default Design;
