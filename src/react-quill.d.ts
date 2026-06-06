declare module 'react-quill' {
  import * as React from 'react';
  
  export interface ReactQuillProps {
    theme?: string;
    modules?: any;
    formats?: string[];
    value?: string;
    defaultValue?: string;
    onChange?: (content: string, delta: any, source: string, editor: any) => void;
    className?: string;
  }
  
  export default class ReactQuill extends React.Component<ReactQuillProps> {}
}
