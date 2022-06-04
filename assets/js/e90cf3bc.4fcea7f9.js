"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6072],{2329:function(e,t,n){n.r(t),n.d(t,{SceneCustomComponent:function(){return u},assets:function(){return l},contentTitle:function(){return h},default:function(){return k},frontMatter:function(){return m},metadata:function(){return d},toc:function(){return p}});var o=n(7462),a=n(3366),i=(n(7294),n(3905)),c=n(1262),r=n(1148),s=["components"],m={title:"Theme Interaction",sidebar_position:10,description:"Get and set selected prop's dialog tab"},h=void 0,d={unversionedId:"developer-interactions/theme-interaction",id:"developer-interactions/theme-interaction",title:"Theme Interaction",description:"Get and set selected prop's dialog tab",source:"@site/docs/developer-interactions/theme-interaction.mdx",sourceDirName:"developer-interactions",slug:"/developer-interactions/theme-interaction",permalink:"/docs/developer-interactions/theme-interaction",draft:!1,editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/developer-interactions/theme-interaction.mdx",tags:[],version:"current",sidebarPosition:10,frontMatter:{title:"Theme Interaction",sidebar_position:10,description:"Get and set selected prop's dialog tab"},sidebar:"tutorialSidebar",previous:{title:"Play/Pause and Frames",permalink:"/docs/developer-interactions/play-pause-frames"},next:{title:"Global Config",permalink:"/docs/global-config/"}},l={},p=[],u=function(e){var t=e.scene,n=e.uid;return(0,i.kt)(c.Z,{mdxType:"BrowserOnly"},(function(){return(0,i.kt)("div",{className:"docs__actions"},(0,i.kt)(r.yN,{title:"Change the theme to dark: ",buttonText:"Click to change the theme to 'dark'",scene:t,action:"scene.themeCtx.changeThemeByThemeName('dark')",mdxType:"CodeBlockWithAction"}),(0,i.kt)(r.yN,{title:"Change the theme to light: ",buttonText:"Click to change the theme to 'light'",scene:t,action:"scene.themeCtx.changeThemeByThemeName('light')",mdxType:"CodeBlockWithAction"}),(0,i.kt)(r.yN,{title:"Cycle to next theme: ",buttonText:"Click to cycle themes",scene:t,action:"scene.themeCtx.next()",mdxType:"CodeBlockWithAction"}),(0,i.kt)(r.yN,{title:"Get the current and next theme name:",buttonText:"Click to get the current and next theme name",scene:t,action:"// Note that \"Next Theme\" refers to the name theme in the sequence (so that the user can cycle through all themes)\nscene.snackbarCtx.success(scene.themeCtx.getCurrentThemeName() + ' -> ' + scene.themeCtx.getNextThemeName())",mdxType:"CodeBlockWithAction"}),(0,i.kt)(r.Ad,{scene:t,uid:n,width:"100%",height:"650px",mdxType:"SceneComponent"}))}))},g={toc:p,SceneCustomComponent:u};function k(e){var t=e.components,n=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,o.Z)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"CHECK ",(0,i.kt)("a",{parentName:"h5",href:"../global-config/theme/theme-scope"},"THEME CONFIG"))),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Even though you can programmatically change all scenes' theme, you can achieve the same goal\nwith the ",(0,i.kt)("a",{parentName:"p",href:"../global-config/theme/theme-scope"},"theme scope config")," and change a single instance of scene in your page."))),(0,i.kt)(u,(0,o.Z)({},r.Si,{mdxType:"SceneCustomComponent"})))}k.isMDXComponent=!0}}]);