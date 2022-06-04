"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5246],{6396:function(n,e,i){i.r(e),i.d(e,{assets:function(){return c},contentTitle:function(){return p},default:function(){return b},frontMatter:function(){return d},metadata:function(){return l},toc:function(){return f}});var o=i(7462),t=i(3366),a=(i(7294),i(3905)),r=i(1148),s=["components"],d={title:"Enable, Disable and Hide",sidebar_position:6},p=void 0,l={unversionedId:"prop-config/animation-config/enable-disable-hide",id:"prop-config/animation-config/enable-disable-hide",title:"Enable, Disable and Hide",description:"",source:"@site/docs/prop-config/animation-config/enable-disable-hide.mdx",sourceDirName:"prop-config/animation-config",slug:"/prop-config/animation-config/enable-disable-hide",permalink:"/docs/prop-config/animation-config/enable-disable-hide",draft:!1,editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/prop-config/animation-config/enable-disable-hide.mdx",tags:[],version:"current",sidebarPosition:6,frontMatter:{title:"Enable, Disable and Hide",sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Rotation",permalink:"/docs/prop-config/animation-config/rotation"},next:{title:"Transition Timing Function",permalink:"/docs/prop-config/animation-config/transition-timing-function"}},c={},f=[],u={toc:f};function b(n){var e=n.components,i=(0,t.Z)(n,s);return(0,a.kt)("wrapper",(0,o.Z)({},u,i,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"You can enable/disable or hide a prop at any frame:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Enable/Disable affects the prop's icon style"),(0,a.kt)("li",{parentName:"ul"},"Hide/Show affects the prop's opacity")),(0,a.kt)("p",null,"By default, a prop's ",(0,a.kt)("inlineCode",{parentName:"p"},"enabled")," with opacity set to ",(0,a.kt)("inlineCode",{parentName:"p"},"1"),"."),(0,a.kt)(r.$9,{generator:"new GlobalConfigGenerator()\n    .addProp((generator) => {\n        generator.type('TABLE').addPosition((positionGenerator) => {\n            positionGenerator.x(50).y(50).hide()\n        }).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).show()\n        }, 2).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90)\n        }, 3).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).hide()\n        }, 4).shouldDisplayName(false)\n    })\n    .addProp((generator) => {\n        generator.type('CHARACTER').addPosition((positionGenerator) => {\n            positionGenerator.x(200).y(200).enable()\n        }).addPosition((positionGenerator) => {\n            positionGenerator.x(50).y(50).disable()\n        }, 2).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).disable()\n        }, 3).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).disable()\n        }, 4)\n    })",config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 50,\n            "y": 50,\n            "hide": true\n          },\n          "2": {\n            "x": 90,\n            "y": 90,\n            "hide": false\n          },\n          "3": {\n            "x": 90,\n            "y": 90\n          },\n          "4": {\n            "x": 90,\n            "y": 90,\n            "hide": true\n          }\n        },\n        "type": "TABLE",\n        "shouldDisplayName": false\n      },\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 200,\n            "y": 200,\n            "enabled": true\n          },\n          "2": {\n            "x": 50,\n            "y": 50,\n            "enabled": false\n          },\n          "3": {\n            "x": 90,\n            "y": 90,\n            "enabled": false\n          },\n          "4": {\n            "x": 90,\n            "y": 90,\n            "enabled": false\n          }\n        },\n        "type": "CHARACTER"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,a.kt)(r.PV,(0,o.Z)({autoPlay:!0},r.$2,{mdxType:"SceneOnlyShort"})))}b.isMDXComponent=!0}}]);