import  './index.less';
import React,{ useEffect, useState, useRef } from 'react'; 
import {Layout,Row, Col,Modal, Button,Radio} from "antd" 
import TreeSortable from './component/drag/TreeSortable'; 
const { Header, Footer, Sider, Content } = Layout;
import { ICON } from './util/icon';
import PrintModal from '@/pages/component/print/PrintModal';
const style:any = {
  margin: '0px',
  padding: '0px',
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: '0px',
  top: '0px',
  overflow:'hidden'
  };
let xs=null;
const IndexPage: React.FC = () => {   
  const [visible, setVisible] = useState<boolean>(false); 
  const [treeData, setTreeData] = useState<{}>();
  const [height, setHeight] = useState<number>();
  useEffect(() => {
     getTreeData();
     spreadsheet();
    }, []); // tab切换触发

   
   const  getTreeData=()=>{
    const treeData = [
      {
        title: '订单中心',
        key: '0-0',
        children: [
          {
            title: '订单管理',
            key: '0-0-0',
            children: [
              {
                title: '订单号',
                key: '0-0-0-0',
                name:'code'
              },
              {
                title: '订单金额',
                key: '0-0-0-1',
                name:'code'
              },
            ],
          },
          {
            title: '用户中心',
            key: '0-0-1',
            children: [{ title:"sss", key: '0-0-1-0' }],
          },
        ],
      },
      {
        title: '商品中心',
        key: '0-0-2',
        children: [{ title: "sss", key: '0-0-3-0' }],
      },
    ];
     setTreeData(treeData);
   }
  

  const spreadsheet=()=>{
    const options = {
      "domain": 'http://localhost:8080/jeecg-boot',
      "viewLocalImage":"/jmreport/img",//预览本地图片方法
      "uploadUrl":"/jmreport/upload", //统一上传地址
     // "uploadExcelUrl":"/jmreport/importExcel?token="+token,//上传excel方法
     // pageSize: viewPageSize, //分页条数
     // printPaper: printPaper,
     // domain:window.location.origin+baseFull,
      showToolbar: true,     //头部操作按钮
      showGrid: true,        //excel表格
      showContextmenu: true, //右键操作按钮
      showBottomBar: false,
      extendToolbar: {
        right: [
          {
            tip: '打印设置',
            icon: ICON.PRINT_ICON,
            onClick: (data, sheet) => {
               handleClick(data);
              console.log('click preview button：', data)
            }
          }
        ],
        left: [
          {
            tip: '保存',
            icon: ICON.SAVE_ICON,
            onClick: (data, sheet) => {
               handleClick(data);
              console.log('click preview button：', data)
            }
          },{
            tip: '预览',
            icon: ICON.PREVIE_ICON,
            onClick: (data, sheet) => {
               handleClick(data);
              console.log('click preview button：', data)
            }
          }]
     },
      view: {
          height: () => document.documentElement.clientHeight-80,
          width: () => document.documentElement.clientWidth-160,
      },
      row: {
          len: 100,
          height: 25,
          minRowResizerHeight:1 //拖拽行最小高度
      },
      col: {
          len: 60,
          width: 100,
          minWidth: 60,
          height: 0,
          minColResizerHeight:1//拖拽列最小高度
      },
      freeze: "A1",
      style: {
          bgcolor: '#ffffff',
          align: 'left',
          valign: 'middle',
          textwrap: false,
          strike: false,
          underline: false,
          color: '#0a0a0a',
          font: {
              name: 'Microsoft YaHei',
              size: 10,
              bold: false,
              italic: false,
          },
      },
     };
      xs = x_spreadsheet('#x-spreadsheet',options);
    let menuSheet =  document.getElementById("x-spreadsheet");
    initEvent(menuSheet,xs); 
     
    window.addEventListener("resize",resizeFunc);
  }

  const resizeFunc = ()=>{
     setHeight(document.body.scrollHeight-140);
  };
  
  const initEvent=(menuSheet,spreadsheet)=>{
    // 双击事件
    menuSheet.ondblclick=function(ev){
      console.log("双击=====1");
    }
      // 拖拽开始
      menuSheet.ondragover = function (ev) { 
      ev.preventDefault(); //阻止向上冒泡
    };
    // 拖拽结束
    menuSheet.ondrop = function (ev) {
      ev.preventDefault();
      let id = ev.dataTransfer.getData('id');
      let { ri, ci } = spreadsheet.data.getCellRectByXY(ev.offsetX, ev.offsetY);
      if(id){
       let leaf = JSON.parse(id);
       spreadsheet.cellText(ri, ci,"${"+leaf.title+"}").reRender();
       spreadsheet.sheet.toolbar.undoEl.setState(false);
      }
    }; 
  }

  const handleClick = (data) => {
    setVisible(true);
  };

  // 弹窗关闭回调
  const handleClose = () => {
     setVisible(false);
  };
  
  //获取弹框数据
  const onPrintSubmit=(page)=>{
      console.log(page);

      setVisible(false);
  }
  return (
    <Layout>
    <Header>Header</Header>
    <Content><Layout>
        <Content>
          <Row style={{height:500}}>
            <Col span={3}><TreeSortable treedata={treeData} getValue={(item)=>{}} /></Col>
            <Col span={21} ><div id="x-spreadsheet" style={style}></div></Col>
          </Row>
          </Content>
      </Layout></Content>
      <PrintModal 
          visible={visible} 
          width={600}
          onClose={handleClose} onSubmit={onPrintSubmit}></PrintModal>
  </Layout>
  );
};

export default IndexPage;