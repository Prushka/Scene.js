"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5327],{2571:function(e,n,t){t.r(n),t.d(n,{assets:function(){return c},contentTitle:function(){return l},default:function(){return u},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return g}});var o=t(7462),r=t(3366),a=(t(7294),t(3905)),i=t(1148),p=["components"],s={title:"Scripts, Notes, Images, Steps",sidebar_position:7,description:"Set dialog related properties for your prop"},l=void 0,d={unversionedId:"prop-config/prop-dialog-properties",id:"prop-config/prop-dialog-properties",title:"Scripts, Notes, Images, Steps",description:"Set dialog related properties for your prop",source:"@site/docs/prop-config/prop-dialog-properties.mdx",sourceDirName:"prop-config",slug:"/prop-config/prop-dialog-properties",permalink:"/docs/prop-config/prop-dialog-properties",editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/prop-config/prop-dialog-properties.mdx",tags:[],version:"current",sidebarPosition:7,frontMatter:{title:"Scripts, Notes, Images, Steps",sidebar_position:7,description:"Set dialog related properties for your prop"},sidebar:"tutorialSidebar",previous:{title:"Render Stack Order",permalink:"/docs/prop-config/render-order"},next:{title:"Extra keys and data",permalink:"/docs/prop-config/prop-dialog-general-keys"}},c={},g=[{value:"Scripts",id:"scripts",level:2},{value:"Note",id:"note",level:2},{value:"Images",id:"images",level:2},{value:"Steps",id:"steps",level:2}],m={toc:g};function u(e){var n=e.components,t=(0,r.Z)(e,p);return(0,a.kt)("wrapper",(0,o.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Global config defines prop dialog tabs' behaviors (see ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"../global-config/global-components/prop-dialog-tabs"},"here")),")."),(0,a.kt)("p",null,"We will only cover setting the prop's dialog related properties in this page."),(0,a.kt)("h2",{id:"scripts"},"Scripts"),(0,a.kt)("p",null,"You can check the prop's scripts in ",(0,a.kt)("strong",{parentName:"p"},"prop dialog -> scripts tab"),"."),(0,a.kt)("p",null,"You can set a prop's scripts (",(0,a.kt)("em",{parentName:"p"},"e.g.,")," an actor's scripts):"),(0,a.kt)(i.$9,{generator:"new GlobalConfigGenerator()\n    .addProp((generator) => {\n            generator.type('CHARACTER')\n                .name('Eula')\n                .scripts(\"Good Morning\\n\\nHow's your day???\")\n                .addPosition((positionGenerator) => {\n                    positionGenerator.x(0).y(0)\n            })\n    })",config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 0,\n            "y": 0,\n          }\n        },\n        "type": "CHARACTER",\n        "name": "Eula",\n        "scripts": "Good Morning\n\nHow\'s your day???"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,a.kt)(i.Lb,(0,o.Z)({tabSelected:"SCRIPTS",propSelected:"Eula"},i.D6,{mdxType:"SceneWithSelection"})),(0,a.kt)("h2",{id:"note"},"Note"),(0,a.kt)("p",null,"You can check the prop's note in ",(0,a.kt)("strong",{parentName:"p"},"prop dialog -> general tab"),"."),(0,a.kt)("p",null,"You can set a prop's note:"),(0,a.kt)(i.$9,{generator:"new GlobalConfigGenerator()\n    .addProp((generator) => {\n            generator.type('TABLE')\n                .name('Great Table')\n                .note(\"Some note\")\n                .addPosition((positionGenerator) => {\n                    positionGenerator.x(0).y(0)\n            })\n    })",config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 0,\n            "y": 0\n          }\n        },\n        "images": [],\n        "type": "TABLE",\n        "name": "Great Table",\n        "note": "Some note"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,a.kt)(i.Lb,(0,o.Z)({propSelected:"Great Table"},i.DZ,{mdxType:"SceneWithSelection"})),(0,a.kt)("h2",{id:"images"},"Images"),(0,a.kt)("p",null,"You can check the prop's note in ",(0,a.kt)("strong",{parentName:"p"},"prop dialog -> images tab"),"."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Clicking")," the image gives you a full browser screen popup with that image."),(0,a.kt)("p",null,"You can set a prop's images:"),(0,a.kt)(i.$9,{generator:'new GlobalConfigGenerator()\n    .addProp((generator) => {\n        generator.type(\'LIGHT\')\n            .name("Here\'s LIGHT")\n            .addImage("https://s2.loli.net/2022/04/16/YwqJ74RUlGaCv6H.jpg","Light Style 1")\n            .addImage("https://s2.loli.net/2022/04/16/2MOenGxdwJPl1Hz.jpg","Light Style 2")\n            .addImage("https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png")\n            .addPosition((positionGenerator) => {\n                positionGenerator.x(0).y(0)\n            })\n    })',config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 0,\n            "y": 0\n          }\n        },\n        "images": [\n          {\n            "title": "Light Style 1",\n            "imageURL": "https://s2.loli.net/2022/04/16/YwqJ74RUlGaCv6H.jpg"\n          },\n          {\n            "title": "Light Style 2",\n            "imageURL": "https://s2.loli.net/2022/04/16/2MOenGxdwJPl1Hz.jpg"\n          },\n          {\n            "imageURL": "https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png"\n          }\n        ],\n        "type": "LIGHT",\n        "name": "Here\'s LIGHT"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,a.kt)(i.Lb,(0,o.Z)({propSelected:"Here's LIGHT",tabSelected:"IMAGES"},i.I5,{mdxType:"SceneWithSelection"})),(0,a.kt)("h2",{id:"steps"},"Steps"),(0,a.kt)("p",null,"You can check the prop's steps in ",(0,a.kt)("strong",{parentName:"p"},"prop dialog -> steps tab"),"."),(0,a.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Steps are sorted by the step number."),(0,a.kt)("p",{parentName:"div"},"A step's title and content are both ",(0,a.kt)("strong",{parentName:"p"},"optional"),"."),(0,a.kt)("p",{parentName:"div"},"You also don't have to follow a sequential order."))),(0,a.kt)("p",null,"You can set a prop's steps (",(0,a.kt)("em",{parentName:"p"},"e.g.,")," steps ",(0,a.kt)("em",{parentName:"p"},"n")," -> do something):"),(0,a.kt)(i.$9,{generator:'new GlobalConfigGenerator()\n    .addProp((generator) => {\n        generator.type(\'SHELF\')\n            .name("Bookcase")\n            .addStep(5)\n            .addStep(1, "Move this", "I mean move this")\n            .addStep(2, "Paint this")\n            .addStep(3, null, "I have empty title")\n            .addPosition((positionGenerator) => {\n            positionGenerator.x(0).y(0)\n        })\n    })',config:'config.props = [\n      {\n        "frameAnimationConfig": {\n          "1": {\n            "x": 0,\n            "y": 0\n          }\n        },\n        "images": [],\n        "steps": {\n          "1": {\n            "title": "Move this",\n            "content": "I mean move this"\n          },\n          "2": {\n            "title": "Paint this"\n          },\n          "3": {\n            "title": null,\n            "content": "I have empty title"\n          },\n          "5": {}\n        },\n        "type": "SHELF",\n        "name": "Bookcase"\n      }\n    ]',mdxType:"GeneratorConfigBlock"}),(0,a.kt)(i.Lb,(0,o.Z)({propSelected:"Bookcase",tabSelected:"STEPS"},i.ON,{mdxType:"SceneWithSelection"})))}u.isMDXComponent=!0}}]);