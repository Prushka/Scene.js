"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5425],{5360:function(e,t,n){n.d(t,{Z:function(){return g}});var r=n(7294),i=n(6010),c=n(9960),o=n(3438),s="cardContainer_woeA",a="cardTitle_pNjP",u="cardDescription_qC_k",l=n(3919),d=n(5999);function m(e){var t=e.href,n=e.children;return r.createElement(c.Z,{href:t,className:(0,i.Z)("card padding--lg",s)},n)}function f(e){var t=e.href,n=e.icon,c=e.title,o=e.description;return r.createElement(m,{href:t},r.createElement("h2",{className:(0,i.Z)("text--truncate",a),title:c},n," ",c),o&&r.createElement("p",{className:(0,i.Z)("text--truncate",u),title:o},o))}function p(e){var t=e.item,n=(0,o.Wl)(t);return n?r.createElement(f,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:(0,d.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function h(e){var t,n=e.item,i=(0,l.Z)(n.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",c=(0,o.xz)(null!=(t=n.docId)?t:void 0);return r.createElement(f,{href:n.href,icon:i,title:n.label,description:null==c?void 0:c.description})}function y(e){var t=e.item;switch(t.type){case"link":return r.createElement(h,{item:t});case"category":return r.createElement(p,{item:t});default:throw new Error("unknown item type "+JSON.stringify(t))}}function g(e){var t=e.items,n=e.className;return r.createElement("section",{className:(0,i.Z)("row",n)},function(e){return e.filter((function(e){return"category"!==e.type||!!(0,o.Wl)(e)}))}(t).map((function(e,t){return r.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},r.createElement(y,{key:t,item:e}))})))}},3912:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return l},default:function(){return h},frontMatter:function(){return u},metadata:function(){return d},toc:function(){return f}});var r=n(7462),i=n(3366),c=(n(7294),n(3905)),o=n(5360),s=n(3438),a=["components"],u={title:"User Interactions"},l=void 0,d={unversionedId:"user-interactions/user-interactions",id:"user-interactions/user-interactions",title:"User Interactions",description:"",source:"@site/docs/user-interactions/user-interactions.mdx",sourceDirName:"user-interactions",slug:"/user-interactions/",permalink:"/docs/user-interactions/",draft:!1,editUrl:"https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs/user-interactions/user-interactions.mdx",tags:[],version:"current",frontMatter:{title:"User Interactions"},sidebar:"tutorialSidebar",previous:{title:"Scene.js Intro",permalink:"/docs/intro"},next:{title:"Timeline",permalink:"/docs/user-interactions/timeline"}},m={},f=[],p={toc:f};function h(e){var t=e.components,n=(0,i.Z)(e,a);return(0,c.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,c.kt)(o.Z,{items:(0,s.jA)().items,mdxType:"DocCardList"}))}h.isMDXComponent=!0}}]);