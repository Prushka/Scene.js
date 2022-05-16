"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[170],{8181:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return m}});var o=n(7462),a=n(3366),i=(n(7294),n(3905)),r=n(1148),p=["components"],s={title:"Custom Prop Types",sidebar_position:9,description:"Define your custom prop types"},l=void 0,d={unversionedId:"global-config/custom-prop-types",id:"global-config/custom-prop-types",title:"Custom Prop Types",description:"Define your custom prop types",source:"@site/docs/global-config/custom-prop-types.mdx",sourceDirName:"global-config",slug:"/global-config/custom-prop-types",permalink:"/docs/global-config/custom-prop-types",editUrl:"https://github.com/Prushka/Scene.js/tree/main/docs/docs/global-config/custom-prop-types.mdx",tags:[],version:"current",sidebarPosition:9,frontMatter:{title:"Custom Prop Types",sidebar_position:9,description:"Define your custom prop types"},sidebar:"tutorialSidebar",previous:{title:"Walls and Lines",permalink:"/docs/global-config/wall/walls-lines"},next:{title:"Prop Config",permalink:"/docs/prop-config/"}},c={},m=[],u={toc:m};function f(e){var t=e.components,n=(0,a.Z)(e,p);return(0,i.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Check ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"../prop-config/type-style"},"Prop Types and Styles"))," if you aren't familiar with prop types."))),(0,i.kt)("p",null,"You can define custom prop types, their styles and enabled/disabled icons."),(0,i.kt)("p",null,"Note that 4 parameters are required when you use ",(0,i.kt)("inlineCode",{parentName:"p"},"new GlobalConfigGenerator().addPropType")),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Type of the prop: ",(0,i.kt)("inlineCode",{parentName:"li"},"string")),(0,i.kt)("li",{parentName:"ol"},"Style of the paths you are about to enter: ",(0,i.kt)("inlineCode",{parentName:"li"},"string")),(0,i.kt)("li",{parentName:"ol"},"SVG path of the enabled icon: ",(0,i.kt)("inlineCode",{parentName:"li"},"string")),(0,i.kt)("li",{parentName:"ol"},"SVG path of the disabled icon: ",(0,i.kt)("inlineCode",{parentName:"li"},"string"))),(0,i.kt)(r.$9,{generator:"new GlobalConfigGenerator()\n    .addPropType('HOUSE', 'default',\n        '<path d=\"M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z\"/>',\n        '<path fill-rule=\"evenodd\" d=\"m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z\"/><path fill-rule=\"evenodd\" d=\"M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z\"/>')\n    .addProp((generator) => {\n        generator.type('HOUSE').addPosition((positionGenerator) => {\n            positionGenerator.x(50).y(50).enable()\n        }).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).disable()\n        }, 2)\n    })",config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 50,\n            "y": 50,\n            "enabled": true\n          },\n          "2": {\n            "x": 90,\n            "y": 90,\n            "enabled": false\n          }\n        },\n        "type": "HOUSE"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,i.kt)(r.PV,(0,o.Z)({},r.ql,{mdxType:"SceneOnlyShort"})))}f.isMDXComponent=!0}}]);