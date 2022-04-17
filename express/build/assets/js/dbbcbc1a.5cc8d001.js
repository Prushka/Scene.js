"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8449],{9497:function(n,o,e){e.r(o),e.d(o,{assets:function(){return d},contentTitle:function(){return p},default:function(){return m},frontMatter:function(){return c},metadata:function(){return l},toc:function(){return f}});var t=e(7462),a=e(3366),i=(e(7294),e(3905)),r=e(1148),s=["components"],c={title:"Scale X and Scale Y",sidebar_position:4},p=void 0,l={unversionedId:"prop-config/animation-config/scale",id:"prop-config/animation-config/scale",title:"Scale X and Scale Y",description:"",source:"@site/docs/prop-config/animation-config/scale.mdx",sourceDirName:"prop-config/animation-config",slug:"/prop-config/animation-config/scale",permalink:"/docs/prop-config/animation-config/scale",editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/prop-config/animation-config/scale.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"Scale X and Scale Y",sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Static / Dynamic Scene",permalink:"/docs/prop-config/animation-config/static-dynamic-scene"},next:{title:"Rotation",permalink:"/docs/prop-config/animation-config/rotation"}},d={},f=[],u={toc:f};function m(n){var o=n.components,e=(0,a.Z)(n,s);return(0,i.kt)("wrapper",(0,t.Z)({},u,e,{components:o,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"You can scale the prop by x-axis or/and y-axis."),(0,i.kt)("p",null,"By default, a prop's ",(0,i.kt)("strong",{parentName:"p"},"scaleX")," and ",(0,i.kt)("strong",{parentName:"p"},"scaleY")," are both set to 1."),(0,i.kt)(r.$9,{generator:"new GlobalConfigGenerator()\n    .addProp((generator) => {\n        generator.type('TABLE').addPosition((positionGenerator) => {\n            positionGenerator.x(50).y(50).scaleY(2)\n        }).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).scaleX(2)\n        }, 2).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).scale(2)\n        }, 3).shouldDisplayName(false)\n    })\n    .addProp((generator) => {\n        generator.type('CHARACTER').addPosition((positionGenerator) => {\n            positionGenerator.x(200).y(200).scale(0.5)\n        }).addPosition((positionGenerator) => {\n            positionGenerator.x(50).y(50).scale(2)\n        }, 2).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).scale(1)\n        }, 3)\n    })",config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 50,\n            "y": 50,\n            "scaleY": 2\n          },\n          "2": {\n            "x": 90,\n            "y": 90,\n            "scaleX": 2\n          },\n          "3": {\n            "x": 90,\n            "y": 90,\n            "scaleX": 2,\n            "scaleY": 2\n          }\n        },\n        "type": "TABLE",\n        "shouldDisplayName": false\n      },\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 200,\n            "y": 200,\n            "scaleX": 0.5,\n            "scaleY": 0.5\n          },\n          "2": {\n            "x": 50,\n            "y": 50,\n            "scaleX": 2,\n            "scaleY": 2\n          },\n          "3": {\n            "x": 90,\n            "y": 90,\n            "scaleX": 1,\n            "scaleY": 1\n          }\n        },\n        "type": "CHARACTER"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,i.kt)(r.PV,(0,t.Z)({autoPlay:!0},r.em,{mdxType:"SceneOnlyShort"})))}m.isMDXComponent=!0}}]);