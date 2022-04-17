"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8728],{4797:function(n,i,t){t.r(i),t.d(i,{assets:function(){return m},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return l}});var e=t(7462),o=t(3366),a=(t(7294),t(3905)),r=["components"],s={title:"What is an animation config?",sidebar_position:1},p=void 0,c={unversionedId:"prop-config/animation-config/what-is-animation-config",id:"prop-config/animation-config/what-is-animation-config",title:"What is an animation config?",description:"An animation config describes the following data of the prop at a specified frame:",source:"@site/docs/prop-config/animation-config/what-is-animation-config.mdx",sourceDirName:"prop-config/animation-config",slug:"/prop-config/animation-config/what-is-animation-config",permalink:"/docs/prop-config/animation-config/what-is-animation-config",editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/prop-config/animation-config/what-is-animation-config.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"What is an animation config?",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Create Props",permalink:"/docs/prop-config/create-props"},next:{title:"Create Animation Configs",permalink:"/docs/prop-config/animation-config/create-positions"}},m={},l=[{value:"Every position must be tied to one frame number",id:"every-position-must-be-tied-to-one-frame-number",level:3}],d={toc:l};function f(n){var i=n.components,t=(0,o.Z)(n,r);return(0,a.kt)("wrapper",(0,e.Z)({},d,t,{components:i,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"An animation config describes the following data of the prop at ",(0,a.kt)("strong",{parentName:"p"},"a specified frame"),":"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Position X and Position Y"),(0,a.kt)("li",{parentName:"ul"},"Scale X and Scale Y"),(0,a.kt)("li",{parentName:"ul"},"Rotation Degree"),(0,a.kt)("li",{parentName:"ul"},"Enabled OR Disabled (affects its icon)"),(0,a.kt)("li",{parentName:"ul"},"Hidden OR Visible"),(0,a.kt)("li",{parentName:"ul"},"Transition Timing Function")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Every property")," listed above will be considered in the frame to frame transition of that prop."),(0,a.kt)("p",null,"You can use ",(0,a.kt)("strong",{parentName:"p"},"any combination")," of properties listed above in your prop's animation config."),(0,a.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"To not confuse the developer, ",(0,a.kt)("strong",{parentName:"p"},"Position")," and ",(0,a.kt)("strong",{parentName:"p"},"Animation Config")," will be used interchangeably."))),(0,a.kt)("h3",{id:"every-position-must-be-tied-to-one-frame-number"},"Every position must be tied to one frame number"),(0,a.kt)("p",null,"You should set prop's frame number 1's position if your scene's static."),(0,a.kt)("p",null,"This can be easily achieved using the generator:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"// Passing no frame into PropConfigGenerator's addPosition sets the animation config at frame 1\nnew PropConfigGenerator().addPosition((positionGenerator) => {\n          positionGenerator.x(200).y(200)\n})\n\n// The following sets the animation config at frame 2\nnew PropConfigGenerator().addPosition((positionGenerator) => {\n          positionGenerator.x(200).y(200)\n}, 2)\n")))}f.isMDXComponent=!0}}]);