"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9882],{7739:function(n,e,o){o.r(e),o.d(e,{assets:function(){return d},contentTitle:function(){return c},default:function(){return u},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return g}});var t=o(7462),r=o(3366),a=(o(7294),o(3905)),i=o(1148),p=["components"],s={title:"Create Props",sidebar_position:1,description:"Create props using generators and json"},c=void 0,l={unversionedId:"prop-config/create-props",id:"prop-config/create-props",title:"Create Props",description:"Create props using generators and json",source:"@site/docs/prop-config/create-props.mdx",sourceDirName:"prop-config",slug:"/prop-config/create-props",permalink:"/docs/prop-config/create-props",editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/prop-config/create-props.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Create Props",sidebar_position:1,description:"Create props using generators and json"},sidebar:"tutorialSidebar",previous:{title:"Prop Config",permalink:"/docs/prop-config/"},next:{title:"What is an animation config?",permalink:"/docs/prop-config/animation-config/what-is-animation-config"}},d={},g=[],m={toc:g};function u(n){var e=n.components,o=(0,r.Z)(n,p);return(0,a.kt)("wrapper",(0,t.Z)({},m,o,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Even though you can create prop configs by\neither creating its ",(0,a.kt)("strong",{parentName:"p"},"json")," or using a ",(0,a.kt)("strong",{parentName:"p"},"PropConfigGenerator"),",\nyou have to include it in the ",(0,a.kt)("strong",{parentName:"p"},"Global Config's Prop List"),"."),(0,a.kt)("p",null,"You can however interact with a scene's ",(0,a.kt)("strong",{parentName:"p"},"PropContext")," to modify your prop list."),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"We will only use ",(0,a.kt)("inlineCode",{parentName:"p"},"GlobalConfigGenerator.addProp")," to demonstrate functionalities later since it uses an underlying ",(0,a.kt)("inlineCode",{parentName:"p"},"PropConfigGenerator"),"."))),(0,a.kt)("p",null,"There are 3 ways to create a prop. We will cover prop's properties later."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Create its json and add it to global config's ",(0,a.kt)("strong",{parentName:"li"},"props")),(0,a.kt)("li",{parentName:"ul"},"Use a ",(0,a.kt)("strong",{parentName:"li"},"PropConfigGenerator"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"new GlobalConfigGenerator().addProp((generator)=>generator...)")," (this gives you a callback with one instance of ",(0,a.kt)("strong",{parentName:"li"},"PropConfigGenerator"),")"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"const generator = new PropConfigGenerator()")," and ",(0,a.kt)("inlineCode",{parentName:"li"},"generator.getConfig()")," (This gives you a prop config object)")))),(0,a.kt)(i.gF,{propGenerator:"const camera = new PropConfigGenerator()\n    .type('CAMERA')\n    .addPosition((positionGenerator) => {\n          positionGenerator.x(200).y(200)\n    })\nconst table = new PropConfigGenerator()\n    .type('TABLE')\n    .addPosition((positionGenerator) => {\n          positionGenerator.x(50).y(50)\n    })\nnew GlobalConfigGenerator().withProps([table, camera])",generator:"new GlobalConfigGenerator()\n    .addProp((generator) => {\n        generator.type('TABLE').addPosition((positionGenerator) => {\n            positionGenerator.x(50).y(50)\n        })\n    })\n    .addProp((generator) => {\n        generator.type('CAMERA').addPosition((positionGenerator) => {\n            positionGenerator.x(200).y(200)\n        })\n    })",config:'config.props = [\n    {\n      "frameAnimationConfig": {\n        "1": {\n          "x": 50,\n          "y": 50,\n        }\n      },\n      "type": "TABLE"\n    },\n    {\n      "frameAnimationConfig": {\n        "1": {\n          "x": 200,\n          "y": 200,\n        }\n      },\n      "type": "CAMERA"\n    }\n  ]',mdxType:"GeneratorWithPropConfigBlock"}),(0,a.kt)(i.PV,(0,t.Z)({},i.dy,{mdxType:"SceneOnlyShort"})))}u.isMDXComponent=!0}}]);