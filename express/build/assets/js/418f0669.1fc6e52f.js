"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8618],{1520:function(n,t,e){e.r(t),e.d(t,{assets:function(){return d},contentTitle:function(){return m},default:function(){return u},frontMatter:function(){return p},metadata:function(){return l},toc:function(){return c}});var o=e(7462),i=e(3366),a=(e(7294),e(3905)),r=e(1148),s=["components"],p={title:"Thumbnails",sidebar_position:8},m=void 0,l={unversionedId:"prop-config/animation-config/thumbnails",id:"prop-config/animation-config/thumbnails",title:"Thumbnails",description:"",source:"@site/docs/prop-config/animation-config/thumbnails.mdx",sourceDirName:"prop-config/animation-config",slug:"/prop-config/animation-config/thumbnails",permalink:"/docs/prop-config/animation-config/thumbnails",editUrl:"https://github.com/Prushka/Scene.js/tree/main/docs/docs/prop-config/animation-config/thumbnails.mdx",tags:[],version:"current",sidebarPosition:8,frontMatter:{title:"Thumbnails",sidebar_position:8},sidebar:"tutorialSidebar",previous:{title:"Transition Timing Function",permalink:"/docs/prop-config/animation-config/transition-timing-function"},next:{title:"Prop and Name Color",permalink:"/docs/prop-config/color"}},d={},c=[{value:"Use thumbnails as storyboards",id:"use-thumbnails-as-storyboards",level:3}],h={toc:c};function u(n){var t=n.components,e=(0,i.Z)(n,s);return(0,a.kt)("wrapper",(0,o.Z)({},h,e,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"See ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"../type-style"},"Type and Style"))," if you aren't familiar with prop types."),(0,a.kt)("p",null,"Setting a prop's thumbnail at any specified frame will force it to render that thumbnail image in the viewport instead of its original icon."),(0,a.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"A prop's thumbnail is ",(0,a.kt)("strong",{parentName:"p"},"frame based"),", which means you have to set it for every frame (you can use the ",(0,a.kt)("strong",{parentName:"p"},"PositionConfigGenerator")," for helper methods)."),(0,a.kt)("p",{parentName:"div"},"Thumbnails ",(0,a.kt)("strong",{parentName:"p"},"only affect")," props with prop type ",(0,a.kt)("strong",{parentName:"p"},"STORYBOARD"),"."))),(0,a.kt)("h3",{id:"use-thumbnails-as-storyboards"},"Use thumbnails as storyboards"),(0,a.kt)("p",null,"Every animation config property also ",(0,a.kt)("strong",{parentName:"p"},"applies to STORYBOARD")," with thumbnail."),(0,a.kt)("p",null,"Apart from setting the storyboard's scale to scale it, you can also directly set the image's width and height (see below):"),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"If you simply want to attach some images or storyboard to your props, please check ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"../prop-dialog-properties"},"Scripts, Notes, Images, Step"))))),(0,a.kt)(r.$9,{generator:"new GlobalConfigGenerator()\n    .addProp((generator) => {\n        generator.type('STORYBOARD').addPosition((positionGenerator) => {\n            positionGenerator.x(0).y(0).thumbnail('https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png', 100)\n        }).addPosition((positionGenerator) => {\n            positionGenerator.x(25).y(25).thumbnail('https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg', 200)\n        }, 2).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90).degree(300).scale(0.5).degree(20)\n        }, 3).shouldDisplayName(false)\n    }).addProp((generator) => {\n        generator.type('CHARACTER').addPosition((positionGenerator) => {\n            positionGenerator.x(200).y(200)\n        }).addPosition((positionGenerator) => {\n            positionGenerator.x(50).y(50)\n        }, 2).addPosition((positionGenerator) => {\n            positionGenerator.x(90).y(90)\n        }, 3)\n    })",config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 0,\n            "y": 0,\n            "thumbnail": {\n              "imageURL": "https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png",\n              "width": 100\n            }\n          },\n          "2": {\n            "x": 25,\n            "y": 25,\n            "thumbnail": {\n              "imageURL": "https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg",\n              "width": 200\n            }\n          },\n          "3": {\n            "x": 90,\n            "y": 90,\n            "degree": 20,\n            "scaleX": 0.5,\n            "scaleY": 0.5\n          }\n        },\n        "type": "STORYBOARD",\n        "shouldDisplayName": false\n      },\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 200,\n            "y": 200\n          },\n          "2": {\n            "x": 50,\n            "y": 50\n          },\n          "3": {\n            "x": 90,\n            "y": 90\n          }\n        },\n        "type": "CHARACTER"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,a.kt)(r.PV,(0,o.Z)({autoPlay:!1},r.IX,{mdxType:"SceneOnlyShort"})))}u.isMDXComponent=!0}}]);