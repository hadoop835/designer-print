import React, {
  useEffect,
  useState,
  useImperativeHandle,
  ReactNode,
} from 'react';
import {Row, Col,Form, Input,Select,Radio,InputNumber,Slider,Switch} from "antd" 
const { Option } = Select;
import {
  Page,
} from '@/models/commonmodel'; 
import config from '@/config/config';

const PrintForm = React.forwardRef<ReactNode>((props, ref) => {  
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState<Page>();
    const [loading, setLoading] = useState<boolean>(true);
    useImperativeHandle(ref, () => ({
      form: form,
    }));
    useEffect(() => {
       getInit();
    }, []);


  const  getInit=()=>{
    const init:Page = {
      paper:"A4",
      layout:"portrait",
      marginX:10,
      marginY:10,
      pxWidth:"718px",
      pxHeight:"1047px",
      definition:1, 
      width: 210,
      height: 297,
      //是否套打
      isBackend: false
    }
    setInitialValues(init);
    setLoading(false);
  }

  const onPaperChange=(value)=>{
    let arr = config.PAPERS.filter(item=>{
        return item.paper === value;
    })
    resetForm(arr[0]);
}

  //获取窗口dpi
  const getWindowDpi=() =>{
    //25.41 1英寸=25.41mm 96是window默认dpi,mac:72
    let arrDPI = new Array();
    if ( window.screen.deviceXDPI != undefined ) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
    }
    else {
        let tmpNode = document.createElement( "DIV" );
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild( tmpNode );
        arrDPI[0] = parseInt( tmpNode.offsetWidth );
        arrDPI[1] = parseInt( tmpNode.offsetHeight );
        tmpNode.parentNode.removeChild( tmpNode );
    }
    return arrDPI;
}
//获取像素宽
const getPxWidth=(width)=>{
    let margin = form.getFieldValue("marginX");
    let isBackend = form.getFieldValue("isBackend");
    if(isBackend==true){
        margin = 0
    }
   let dpi = getWindowDpi();
    return Math.ceil((width - margin*2)/25.41 * dpi[0]);
}
//获取像素高
const getPxHeight=(height)=>{
  let margin = form.getFieldValue("marginY");
  let isBackend = form.getFieldValue("isBackend");
    if(isBackend==true){
        margin = 0
    }
    let dpi = getWindowDpi();
    return Math.ceil((height-margin*2)/25.41 * dpi[1]);
}
// 重置宽高px的值
let resetPrintPx = (width,height) =>{
  let rs = new Map();
  let pxWidth = getPxWidth(width)+'px'
  let pxHeight = getPxHeight(height)+'px'
  let layout = form.getFieldValue("layout");
  if(layout == 'portrait'){
    rs["pxWidth"] = pxWidth;
    rs["pxHeight"] = pxHeight; 
  }else{
    rs["pxWidth"] = pxHeight;
    rs["pxHeight"] = pxWidth;
  }
  return rs;
}
/**
 * 
 * @param param 
 */
const resetForm = (param) => {
  if(param){
    let val = new Map();
    val["paper"] = param.paper;
    val["width"] = param.width;
    val["height"] = param.height;
    val["marginX"] = 10; 
    val["marginY"] = 10; 
    val["layout"] = "portrait"; 
    let rs =  resetPrintPx(param.width,param.height);
    val["definition"] = 1; 
    val["isBackend"] = false; 
     form.setFieldsValue(Object.assign(val,rs));
  }
}
  const onPaperMarginYChange=(value)=>{
    var rs = new Map();
    let layout = form.getFieldValue("layout");
    let height = form.getFieldValue("height"); 
    console.log(height)
    let temp = parseInt(value || 0)
    if(temp<0){
        temp = 0
    }
    rs["marginY"] = temp;
    if(layout == 'portrait'){
      rs["pxHeight"] = getPxHeight(height)+'px'; 
    }else{
      rs["pxWidth"] = getPxHeight(height)+'px'; 
    }
    form.setFieldsValue(rs);
}
const onPaperMarginXChange=(value)=>{
   let layout = form.getFieldValue("layout");
   let width = form.getFieldValue("width"); 
   var rs = new Map();
    let temp = parseInt(value || 0)
    if(temp<0){
        temp = 0
    }
    rs["marginX"] = temp;
    if(layout == 'portrait'){
      rs["pxWidth"] = getPxWidth(width)+'px'; 
    }else{
      rs["pxHeight"] = getPxWidth(width)+'px'; 
    }
    form.setFieldsValue(rs);
}


    return !loading ?(
        <Form
              form={form}
              name="basic"
              autoComplete="off"
              preserve={false}
              initialValues={initialValues}
      >
         <Input name="width" type="hidden"></Input>
          <Row>
              <Col span={24}>
                  <Form.Item
                  label="打印纸张"
                  name="paper"
                  rules={[{ required: true, message: '请选择打印纸张!' }]}
                >
              <Select onChange={onPaperChange}>
                      {
                      config.PAPERS.map(item=>{
                          return (<Option value={item.paper} key={item.paper}>{item.paper+": "+item.width+"mm x "+item.height}</Option>)
                      })}
                  </Select>
              </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col span={24}>
              <Form.Item
                  label="打印布局"
                  name="layout"
                  rules={[{ required: true, message: '打印布局' }]}
              >
              <Radio.Group  buttonStyle="solid" style={{fontSize: 16 }}>
                  <Radio.Button value="portrait">纵向</Radio.Button>
                  <Radio.Button value="landscape">横向</Radio.Button>
              </Radio.Group>
              
              </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col span={15}>
              <Form.Item
                  label="打印边距(mm)"
                  name="marginX"
                  rules={[{ required: true, message: '请选择打印边距(mm)' }]}
              >
               <InputNumber size="small"   style={{width:160}} onChange={onPaperMarginXChange} />
              </Form.Item>
              </Col>
              <Col span={1}>-</Col>
              <Col span={8}>
              <Form.Item
                  name="marginY"
              >
                  <InputNumber size="small" min={1} max={100000} style={{width:160}} onChange={onPaperMarginYChange} /> 
              </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col span={15}>
              <Form.Item
                  label="&nbsp;&nbsp;像素宽高(px)"
                  name="pxWidth"
                  rules={[{ required: true,  }]}
              > 
               <Input disabled name='pxWidth' size="small"  style={{width:160}} />
              </Form.Item>
              </Col>
              <Col span={1}>-</Col>
              <Col span={8}>
              <Form.Item
                  name="pxHeight"
              >
                  <Input disabled size="small"  style={{width:160}}  /> 
              </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col span={15}>
              <Form.Item
                  label="&nbsp;&nbsp;纸张规格(mm)"
                  name="width"
                  rules={[{ required: true,  }]}
              > 
               <Input disabled  size="small"  style={{width:160}} />
              </Form.Item>
              </Col>
              <Col span={1}>-</Col>
              <Col span={8}>
              <Form.Item
                  name="height"
              >
                  <Input disabled size="small"  style={{width:160}}  /> 
              </Form.Item>
              </Col>
          </Row>
          <Row>
              <Col span={24}>
                  <Form.Item
                  label="打印清晰度"
                  name="definition"
                  rules={[{ required: true, message: '请选择打印清晰度!' }]}
                >
               <Slider
                  min={1}
                  max={10}
              />
              </Form.Item>
              </Col>
          </Row>
      </Form>
    ):null
  },
);
export default PrintForm;
