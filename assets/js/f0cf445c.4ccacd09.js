"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[4558],{6991:function(e,t,o){o.r(t),o.d(t,{ScenePropManualSelection:function(){return S},assets:function(){return u},contentTitle:function(){return d},default:function(){return b},frontMatter:function(){return l},metadata:function(){return a},toc:function(){return m}});var n=o(7462),r=o(3366),i=(o(7294),o(3905)),c=o(1262),p=o(1148),s=["components"],l={title:"Prop Selection",sidebar_position:2,description:"Get and set selected prop by prop, prop name or prop id"},d=void 0,a={unversionedId:"developer-interactions/prop-selection",id:"developer-interactions/prop-selection",title:"Prop Selection",description:"Get and set selected prop by prop, prop name or prop id",source:"@site/docs/developer-interactions/prop-selection.mdx",sourceDirName:"developer-interactions",slug:"/developer-interactions/prop-selection",permalink:"/docs/developer-interactions/prop-selection",draft:!1,editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/developer-interactions/prop-selection.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Prop Selection",sidebar_position:2,description:"Get and set selected prop by prop, prop name or prop id"},sidebar:"tutorialSidebar",previous:{title:"Embedded Snackbar",permalink:"/docs/developer-interactions/embedded-snackbar"},next:{title:"Dialog Tab Selection",permalink:"/docs/developer-interactions/tab-selection"}},u={},m=[],S=function(e){var t=e.scene,o=e.uid;return(0,i.kt)(c.Z,{mdxType:"BrowserOnly"},(function(){return(0,i.kt)("div",{className:"docs__actions"},(0,i.kt)(p.yN,{title:"Select a prop by its name: ",buttonText:"Click to select prop with name: 'Select Me'",scene:t,action:"const prop = scene.propCtx.getPropByName('Select Me')\nif(prop){\n    scene.propCtx.selectedProp = prop\n}",mdxType:"CodeBlockWithAction"}),(0,i.kt)(p.yN,{title:"Toggle a prop's selection: ",buttonText:"Click to toggle prop selection with name: 'Select Me'",scene:t,action:"const prop = scene.propCtx.getPropByName('Select Me')\nif(prop){\n    scene.propCtx.toggleSelected(prop)\n}",mdxType:"CodeBlockWithAction"}),(0,i.kt)(p.yN,{title:"Check if a prop is selected: ",buttonText:"Click to check if prop: 'Select Me' is selected",scene:t,action:"const prop = scene.propCtx.getPropByName('Select Me')\nif(prop){\n    const isSelected = scene.propCtx.isPropSelected(prop)\n    const selectedString = isSelected ? 'is' : 'is not'\n    scene.snackbarCtx.snackbar(\"Prop: Select Me \"+selectedString+\" selected\", !isSelected)\n}",mdxType:"CodeBlockWithAction"}),(0,i.kt)(p.Ad,{scene:t,uid:o,width:"100%",height:"650px",mdxType:"SceneComponent"}))}))},k={toc:m,ScenePropManualSelection:S};function b(e){var t=e.components,o=(0,r.Z)(e,s);return(0,i.kt)("wrapper",(0,n.Z)({},k,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)(S,(0,n.Z)({},p.PR,{mdxType:"ScenePropManualSelection"})))}b.isMDXComponent=!0}}]);