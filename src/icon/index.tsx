import React, { useState, useMemo, useEffect } from 'react';
import { Button, Icon, Checkbox, Message } from '@uni/design';
import { SvgNode } from 'uni-icons/lib/types';
import * as Icons from 'uni-icons';
import MenuCom from './menu';
import Operation from './operation';
import IconFlex from './icon-flex';
import MenuData from './menu.config';
import { BatchDownload,  objectToSvg} from '../utils';


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
  const [isChinaStart, $isChinaStart] = useState(false); // 是否开始中文拼音输入
  const [isLine, setLine] = useState(false);
  const [size, setSize] = useState(24);
  const [lineWidth, setLineWidth] = useState(2);
  const [color, setColor] = useState('#9298B5');
  const [isBatch, $isBatch] = useState(false); // 是否开始批量操作
  const [batchData, setBatchData] = useState<DataType[]>([]); // 批量操作选择的icon
  const [isChecked, setChecked] = useState(false); // 是否只查看已选择的icon
  const [searchValue, $search] = useState('');
  const [temValue, $temValue] = useState(''); // 临时的搜索值用来在中文拼音输入完成时更新真正的搜索值
  const [isOver, $over] = useState(false);
  const [menus, $menus] = useState<MenuType[]>(MenuData);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value =  e.target.value;
    $temValue(value);
    if (isChinaStart) return;
    $search(value);
  };

  const onCompositionStart = () => {
    $isChinaStart(true);
  };

  const onCompositionEnd = () => {
    $isChinaStart(false);
    $search(temValue);
  };

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


  const handleExport = () => {
    const list: ListType[] = [];
    const exportData = isBatch ? batchData : (Object.values(resultData).map((i) => i.data) as any).flat(2);
    if (exportData.length) {
      exportData.forEach((item: DataType) => {
        list.push({
          name: `${item.englishName}-${item.chineseName}` || '',
          svgHTML: objectToSvg(item, size, color, lineWidth),
        });
      });
      BatchDownload(list);
    } else {
      Message.error('请选择图标');
    }
  };


  const ChoseCurrentAll = () => {
    const tem = [...batchData];
    const lastData = (Object.values(resultData).map((i) => i.data) as any).flat(2);
    (lastData || []).forEach((item: DataType) => {
      if (!batchData.some((i) => i.englishName === item.englishName)) {
        tem.push(item);
      }
   });
   setBatchData([...tem]);
  };

  const handleEnter = () => {
    if (searchValue) {
      $over(true);
    }
  };

  const handleLeave = () => {
    if (isOver) {
      $over(false);
    }
  };

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
      <div className='icon-header'>
        <div className='user'></div>
        <div className='search-content'>
          <div className='input'>
            <input
              onChange={handleChange}
              placeholder='输入图标关键词'
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              value={temValue}
            />
            <span
              onMouseEnter={handleEnter}
              onClick={() => {
                if (searchValue) {
                  $search('');
                  $temValue('');
                }
              }} 
              className='search-icon'          
            >
              <Icon
                type={searchValue && isOver ? 'delete' : 'search'}
                
              />
            </span>
          </div>
          {isBatch && <div style={{ marginTop: 5, marginLeft: 16 }}>
              <Checkbox onChange={(checked) => {
                setChecked(checked);
              }}>仅看已选</Checkbox>
            </div>}
        </div>
        <div className='btn'>
          {isBatch ?
            <>
              <Button disabled={isChecked} onClick={ChoseCurrentAll}>全部</Button>
              <Button
                onClick={handleExport}
                style={{ margin: '0px 12px' }}
                type='primary'
              >
                导出
              </Button>
              <Button onClick={() => {
                $isBatch(false);
                setChecked(false);
                setBatchData([]);
              }}>取消</Button>
            </>
            :
            <>
              <Button
                style={{ marginRight: 16 }}
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
        {
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
                {menus.length ? <IconFlex
                  size={size}
                  lineWidth={lineWidth}
                  color={color}
                  currentMenu={currentMenu}
                  isBatch={isBatch}
                  batchData={batchData}
                  setBatchData={setBatchData}
                  resultData={resultData}
                /> :  <img src={require('../assets/no-content.svg')} className="no-data" alt="no-content" />}
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
