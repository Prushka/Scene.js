"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6605],{2303:function(e,t,n){n.r(t),n.d(t,{SceneCustomComponent:function(){return f},assets:function(){return d},contentTitle:function(){return p},default:function(){return k},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return m}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=n(1262),s=n(1148),c=["components"],l={title:"Play/Pause and Frames",sidebar_position:5,description:"Programmatically play / pause a scene and select frame"},p=void 0,u={unversionedId:"developer-interactions/play-pause-frames",id:"developer-interactions/play-pause-frames",title:"Play/Pause and Frames",description:"Programmatically play / pause a scene and select frame",source:"@site/docs/developer-interactions/play-pause-frames.mdx",sourceDirName:"developer-interactions",slug:"/developer-interactions/play-pause-frames",permalink:"/docs/developer-interactions/play-pause-frames",editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/developer-interactions/play-pause-frames.mdx",tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"Play/Pause and Frames",sidebar_position:5,description:"Programmatically play / pause a scene and select frame"},sidebar:"tutorialSidebar",previous:{title:"Filter Props",permalink:"/docs/developer-interactions/filter-props"},next:{title:"Theme Interaction",permalink:"/docs/developer-interactions/theme-interaction"}},d={},m=[],f=function(e){var t=e.scene,n=e.uid;return(0,o.kt)(i.Z,{mdxType:"BrowserOnly"},(function(){return(0,o.kt)("div",{className:"docs__actions"},(0,o.kt)(s.yN,{title:"Play / Pause:",buttonText:"Click to toggle the play status",scene:t,action:"scene.play(!scene.isPlaying())",mdxType:"CodeBlockWithAction"}),(0,o.kt)(s.yN,{title:"Select next frame:",buttonText:"Click to select the next frame",scene:t,action:"scene.propCtx.nextFrame()",mdxType:"CodeBlockWithAction"}),(0,o.kt)(s.yN,{title:"Select frame 1:",buttonText:"Click to select frame 1 (try to select a different frame first)",scene:t,action:"scene.propCtx.currentFrame = 1",mdxType:"CodeBlockWithAction"}),(0,o.kt)(s.yN,{title:"Get current frame:",buttonText:"Click to get the current frame",scene:t,action:"alert(scene.propCtx.currentFrame)",mdxType:"CodeBlockWithAction"}),(0,o.kt)(s.Ad,{scene:t,uid:n,width:"100%",height:"650px",mdxType:"SceneComponent"}))}))},y={toc:m,SceneCustomComponent:f};function k(e){var t=e.components,n=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},y,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)(f,(0,r.Z)({},s.aw,{mdxType:"SceneCustomComponent"})))}k.isMDXComponent=!0}}]);