(this.webpackJsonpreact_interface=this.webpackJsonpreact_interface||[]).push([[0],{67:function(e,t,r){},75:function(e,t,r){"use strict";r.r(t);var o=r(0),n=r.n(o),c=r(23),i=r.n(c),l=(r(66),r(98)),a=(r(67),r(7)),s=r(10),d=r(97),h=r(99),b=r(54),j=r.n(b),u=r(55),x=r.n(u),f=r(95),O=r(3),w={root:{height:240,flexGrow:1,maxWidth:400}};function g(e){var t=e.BoxSelectFunc,r=e.tree_data;return Object(O.jsx)(h.a,{style:w.root,defaultCollapseIcon:Object(O.jsx)(j.a,{}),defaultExpandIcon:Object(O.jsx)(x.a,{}),sx:{height:110,flexGrow:1,maxWidth:400,overflowY:"auto"},onNodeSelect:t,children:function e(t){return Object(O.jsx)(f.a,{nodeId:t.id,label:t.name,children:Array.isArray(t.children)?t.children.map((function(t){return e(t)})):null},t.id)}(r)})}var m={box_root:{},wells:{TextAlign:"center",backgroundColor:"white",borderStyle:"solid",borderColor:"black",borderWidth:"1px",minWidth:"50px",minHeight:"50px"}};function p(e){var t=e.box_info,r=e.height,o=e.width,n=t.size,c=n.rows,i=n.columns,l={height:o/i,width:o/i};return r/c<o/i&&(l={height:r/c,width:r/c}),Object(O.jsx)("div",{style:m.box_root,children:Object(s.a)(Array(c)).map((function(r,o){return Object(O.jsx)(d.a,{display:"flex",flexGrow:1,children:Object(s.a)(Array(i)).map((function(r,n){var c={backgroundColor:"white"};return o*i+n===e.selected_well&&(c={backgroundColor:"red"}),Object(O.jsx)("div",{onClick:function(){return e.WellSelectFunc(o*i+n)},style:Object.assign({},m.wells,l,c),children:t.content[o*i+n]+1},n)}))},o)}))})}var y=r(56),v={root:{height:"100%"},top:{height:"100px",backgroundColor:"red"},well:{backgroundColor:"salmon",overflow:"auto"},paper:{padding:5,height:"100%"}},_={1:{content:Object(s.a)(Array(9).keys()),size:{rows:3,columns:3}},2:{content:Object(s.a)(Array(81).keys()),size:{rows:9,columns:9}},3:{content:Object(s.a)(Array(96).keys()),size:{rows:8,columns:12}}},k={id:"root",name:"Rum931",children:[{id:"1",name:"l\xf8s box"},{id:"fre4",name:"Fryser -80",children:[{id:"2",name:"Box 1"},{id:"3",name:"Box CHO"}]}]};function C(){var e=Object(y.a)(),t=e.observe,r=e.width,n=e.height,c=Object(o.useState)({content:[0],size:{rows:1,columns:1}}),i=Object(a.a)(c,2),l=i[0],s=i[1],h=Object(o.useState)(0),b=Object(a.a)(h,2),j=b[0],u=b[1];return Object(O.jsxs)(d.a,{display:"flex",flexDirection:"column",style:v.root,children:[Object(O.jsx)("div",{id:"storage_top",style:v.top,children:"header"}),Object(O.jsxs)(d.a,{display:"flex",flexGrow:1,id:"storage_bottom",children:[Object(O.jsx)("div",{id:"storage_tree",children:Object(O.jsx)(g,{BoxSelectFunc:function(e,t){t in _&&s(_[t])},tree_data:k})}),Object(O.jsx)("div",{id:"storage_box",ref:t,children:Object(O.jsx)(p,{selected_well:j,WellSelectFunc:function(e){u(e)},box_info:l,height:n,width:r})}),Object(O.jsx)(d.a,{id:"storage_well",flexGrow:1,style:v.well,children:j+1})]})]})}i.a.render(Object(O.jsxs)(n.a.StrictMode,{children:[Object(O.jsx)(l.a,{}),Object(O.jsx)(C,{})]}),document.getElementById("root"))}},[[75,1,2]]]);
//# sourceMappingURL=main.f963bf45.chunk.js.map