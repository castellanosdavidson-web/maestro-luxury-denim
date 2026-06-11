"use client";

import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Registrar tamaños personalizados
const Size: any = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '11px', '12px', '12.5px', '13px', '14px', '15px', '16px', '18px', '20px', '24px', '30px', '36px'];
Quill.register(Size, true);

export default function Editor(props: any) {
  return <ReactQuill {...props} />;
}
