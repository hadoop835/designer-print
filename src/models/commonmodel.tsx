export interface Page {
    paper:string,
    layout:string,
    marginX:number,
    marginY:number,
    pxWidth:string,
    pxHeight:string,
    definition:number, 
    width: number,
    height: number,
    //是否套打
    isBackend: boolean,
  }

  export interface ModalProps {
    visible: boolean; 
    onClose?: any;
    width?: number;
  }