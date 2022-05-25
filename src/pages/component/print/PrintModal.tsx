import React, { useRef, useState } from 'react';
import { Modal, message, Button } from 'antd';  
import { ModalProps,Page} from '@/models/commonmodel'; 
import PrintForm  from './PrintForm';


const PrintModal: React.FC<ModalProps> = (props: ModalProps) => { 
  const { visible, onClose, width,onSubmit } = props;
  const [selectedUser, setSelectedUser] = useState<string[]>();
  const printRef = useRef(null as any); 
  /**
   * 
   * @param val 保存数据
   */
  const onOk = async (val?: string) => {
    let form = printRef.current.form;
    const values: Page = await form.validateFields();
    onSubmit(values);
  };

  return (
    <Modal
      title="打印设置"
      visible={visible}
      width={width ? width : 700}
      
      onCancel={onClose}
      destroyOnClose={true}
      footer={[
        <Button key='back' onClick={onClose}>取消</Button>,
        <Button key='submit' type='primary' onClick={() => onOk()}>确定</Button>
      ]}
    >
    <PrintForm ref={printRef}></PrintForm> 
    </Modal>
  );
};

export default PrintModal;