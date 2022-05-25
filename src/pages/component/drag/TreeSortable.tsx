/*
 * @Author: muge
 * @Date: 2021-12-07 18:30:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-07 19:54:39
 */ 
import React,{forwardRef} from 'react';
import { Tree,Tag,Card} from 'antd';
import {
  MenuOutlined,
} from '@ant-design/icons';
const { TreeNode } = Tree;

export interface DetailProps{ 
  treedata:any;
  getValue: (...args: any[]) => any;  
}

const TreeSortable = forwardRef<any, DetailProps>(({treedata,getValue},ref)=>{
      // 拖拽开始
    const   dragStart=(e,item)=>{
       e.dataTransfer.setData("id", JSON.stringify(item));
           getValue(item);
    }
    const getTreeNode = (data: any) => {
      if (data && data.length > 0) {
        return data.map((item: any) => {
          if (item.children) {
            return (
              <TreeNode key={item.key} title={item.title}>
                {getTreeNode(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode key={item.key} title={<Tag icon={<MenuOutlined />} color="#2db7f5" draggable="true" onDragStart={(e)=>dragStart(e,item)}>{item.title}</Tag>} />;
        });
      }
      return [];
    };
    
    return (<Card title="字段区域" headStyle={{height:56}}><Tree showLine={{showLeafIcon:false}}>{getTreeNode(treedata)}</Tree></Card>);
  });


export default TreeSortable;
